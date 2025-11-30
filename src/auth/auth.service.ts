import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { PassengerProfilesService } from '../passenger-profiles/passenger-profiles.service';
import { OperatorProfilesService } from '../operator-profiles/operator-profiles.service';
import { BusesService } from '../buses/buses.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private passengerProfilesService: PassengerProfilesService,
    private operatorProfilesService: OperatorProfilesService,
    private busesService: BusesService,
    private jwtService: JwtService,
  ) {}

    // ---------------- SIGN UP ----------------
    async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
      const existingUser = await this.usersService.findByEmail(signUpDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(signUpDto.password, 12);
      const user = await this.usersService.create({
        email: signUpDto.email,
        password: hashedPassword, // Changed from hashedPassword to password
        role: signUpDto.role,
        isActive: true,
      });

      // Create role-based profiles
      if (signUpDto.role === UserRole.PASSENGER) {
        if (!signUpDto.firstName || !signUpDto.lastName || !signUpDto.phone) {
          throw new BadRequestException(
            'Passenger requires firstName, lastName, and phone',
          );
        }
        await this.passengerProfilesService.create({
          userId: user.id,
          firstName: signUpDto.firstName,
          lastName: signUpDto.lastName,
          phone: signUpDto.phone,
          nationality: signUpDto.nationality || '',
        });
      } else if (signUpDto.role === UserRole.OPERATOR) {
        await this.operatorProfilesService.create({
          userId: user.id,
          isVerified: false,
          licensePlate: signUpDto.licensePlate || '',
          busType: signUpDto.busType || '',
          driverPhone: signUpDto.driverPhone || '',
        });
      }
      

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      return { ...tokens, user };
    }

  // ---------------- SIGN IN ----------------
  async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive)
      throw new UnauthorizedException('Account is deactivated');

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // OTP logic
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Convert Date to ISO string for the DTO
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await this.usersService.update(user.id, {
      otpCode: otp,
      otpExpiresAt: otpExpiresAt,
    });

    console.log(`✅ OTP for ${user.email}: ${otp}`);

    return {
      message: 'OTP sent to your email. Please verify to continue.',
      requiresOtp: true,
      email: user.email,
    };
  }

  // ---------------- VERIFY OTP ----------------
  async verifyOtp(email: string, otp: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.otpCode) {
      throw new UnauthorizedException('No OTP found for this user');
    }

    if (user.otpCode !== otp) throw new UnauthorizedException('Invalid OTP');
    if (user.otpExpiresAt && user.otpExpiresAt < new Date())
      throw new UnauthorizedException('OTP expired');

    // Clear OTP by setting to null
    await this.usersService.update(user.id, {
      otpCode: null as any, // Use type assertion for null
      otpExpiresAt: null as any, // Use type assertion for null
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { ...tokens, user };
  }

  // ---------------- TOKEN HELPERS ----------------
  private async generateTokens(userId: string, email: string, role: UserRole) {
    const payload = { email, sub: userId, role };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload);
    return { access_token, refresh_token };
  }

  async refreshToken(userId: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(userId);
    if (!user.isActive)
      throw new UnauthorizedException('User account is inactive');
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  // ---------------- PROFILE MANAGEMENT ----------------
  async getProfileDetails(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    let profile: any = null;

    if (user.role === UserRole.PASSENGER) {
      profile = await this.passengerProfilesService.findByUserId(userId);
    } else if (user.role === UserRole.OPERATOR) {
      profile = await this.operatorProfilesService.findByUserId(userId);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      profileImage: user.profileImage,
      firstName: profile?.firstName || user.passengerProfile?.firstName,
      lastName: profile?.lastName || user.passengerProfile?.lastName,
      phone: profile?.phone || user.passengerProfile?.phone,
      nationality: profile?.nationality || user.passengerProfile?.nationality,
      profile,
      createdAt: user.createdAt, // Use proper camelCase from BaseEntity
      updatedAt: user.createdAt, // Use proper camelCase from BaseEntity
    };
  }

  // Update profile
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    // Update email if provided
    if (dto.email) {
      const existing = await this.usersService.findByEmail(dto.email);
      if (existing && existing.id !== user.id) {
        throw new ConflictException('Email already in use');
      }
      await this.usersService.update(user.id, { email: dto.email });
    }

    // Update passenger/operator profile
    if (user.role === UserRole.PASSENGER) {
      await this.passengerProfilesService.updateByUserId(user.id, {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        nationality: dto.nationality,
      });
    }

    if (user.role === UserRole.OPERATOR) {
      await this.operatorProfilesService.updateByUserId(user.id, {
        driverPhone: dto.phone, // map shared field
      });
    }

    this.logger?.log(`User ${user.email} updated profile successfully`);
    return this.getProfileDetails(user.id);
  }

  // Avatar upload
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const imageUrl = `http://localhost:3000/uploads/profile/${file.filename}`;
    await this.usersService.update(userId, { profileImage: imageUrl });

    return {
      message: 'Avatar uploaded successfully',
      imageUrl,
    };
  }

  // Account delete
  async deleteProfile(userId: string) {
    await this.usersService.remove(userId);
    return { message: 'User account deleted successfully' };
  }
}
