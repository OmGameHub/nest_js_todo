import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from "@nestjs/common";

type ValidationErrors = Record<string, string>;

const generateErrors = (errors: ValidationError[]): ValidationErrors => {
  return errors.reduce((accumulator, currentValue) => {
    if ((currentValue.children?.length ?? 0) > 0) {
      return { ...accumulator, ...generateErrors(currentValue.children ?? []) };
    }
    return {
      ...accumulator,
      [currentValue.property]: Object.values(
        currentValue.constraints ?? {},
      ).join(", "),
    };
  }, {} as ValidationErrors);
};

export const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: generateErrors(errors),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  },
};
