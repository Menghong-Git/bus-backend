import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
  Logger,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // ---------- AUTH ----------
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    this.logger.log('POST /auth/signup');
    
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    this.logger.log('POST /auth/signin');
    return this.authService.signIn(signInDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    this.logger.log('POST /auth/verify-otp');
    return this.authService.verifyOtp(body.email, body.otp);
  }

  // ---------- PROFILE ----------
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    this.logger.log(`GET /auth/profile by user ${req.user.id}`);
    return this.authService.getProfileDetails(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/update')
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    this.logger.log(`PATCH /auth/profile/update by user ${req.user.id}`);
    return this.authService.updateProfile(req.user.id, dto);
  }

  // ✅ FIXED: Add missing avatar upload endpoint
  @UseGuards(JwtAuthGuard)
  @Patch('profile/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log(`PATCH /auth/profile/avatar by user ${req.user.id}`);
    return this.authService.uploadAvatar(req.user.id, file);
  }

  // ---------- DELETE ----------
  @UseGuards(JwtAuthGuard)
  @Delete('profile/delete')
  async deleteProfile(@Request() req) {
    this.logger.log(`DELETE /auth/profile/delete by user ${req.user.id}`);
    return this.authService.deleteProfile(req.user.id);
  }
}
