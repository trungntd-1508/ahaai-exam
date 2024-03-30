interface UserInterface {
  id: number;
  email: string;
  password: string;
  passwordConfirmation?: string;
  unEncryptedPassword?: string;
  fullName: string;
  verificationOtp: string;
  verificationAt: Date;
  googleUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default UserInterface;
