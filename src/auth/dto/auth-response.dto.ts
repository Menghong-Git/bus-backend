import { UserRole } from '../../common/enums/user-role.enum';

export class AuthResponseDto {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    profile?: any; // Make profile optional
  };
}
