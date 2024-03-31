import { Error, ValidationErrorItem } from 'sequelize';

class CustomError extends Error {
  public path: string;

  constructor(message: string, path?: string) {
    super(message);
    this.path = path;
  }
}

export const FailValidation = (errors: ValidationErrorItem[]) => {
  const messages: any = {};
  errors.forEach((error: any) => {
    const path = (error.original as CustomError)?.path || error.path;
    const message = (error.original as CustomError)?.message || error.message;
    messages[path] ||= [];
    messages[path].push(message);
  });
  return {
    errorCode: 120,
    messages,
  };
};

export const NoData = {
  errorCode: 8,
  message: 'No data available',
};

export const InternalError = {
  errorCode: 131,
  message: 'Internal error',
};

export const BadAuthentication = {
  errorCode: 215,
  message: 'Bad authentication data',
};

export const InvalidAuthenticationCode = {
  errorCode: 216,
  message: 'Invalid authentication',
};

export const NewPasswordCannotBeTheSame = {
  errorCode: 215,
  message: 'New password cannot be the same as current password',
};
