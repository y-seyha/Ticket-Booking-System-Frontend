export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "USER" | "CASHIER";
  emailVerified: boolean;
  phoneVerified: boolean;
  profile?: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
  };
}

export interface RegisterResponse {
  message: string;
}

export interface LoginResponse {
  user: User;
  accessToken?: string;
}

export interface TwoFactorRequiredResponse {
  requiresTwoFactor: true;
  tempToken: string;
}

export interface Verify2FARequest {
  tempToken: string;
  code: string;
}

export interface Verify2FAResponse {
  success: boolean;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface ReactivateAccountRequest {
  email: string;
}

export interface AuthMessageResponse {
  message: string;
}

export interface Setup2FAResponse {
  qrCode: string;
  secret: string;
}

export interface Enable2FARequest {
  code: string;
}

export interface CurrentUserResponse {
  user: User;
  accessToken?: string;
}
