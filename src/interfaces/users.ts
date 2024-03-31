interface UserInterface {
  id: number;
  email: string;
  password: string;
  passwordConfirmation?: string;
  unEncryptedPassword?: string;
  fullName: string;
  verificationCode: string;
  verificationAt: Date;
  googleUserId: string;
  lastActiveAt: Date;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;

  totalOrder?: number;
}

export default UserInterface;
