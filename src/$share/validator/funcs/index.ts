import { registerDecorator, ValidationOptions } from 'class-validator';

type DefaultValidMime = 'image/jpg' | 'image/png' | 'image/jpeg';

interface FileMimeOptions {
  mime: DefaultValidMime[];
}

export function FileMime(options: FileMimeOptions, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    return registerDecorator({
      name: 'fileMime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: options.mime,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value?.mimetype && (options.mime ?? []).includes(value?.mimetype)) {
            return true;
          }

          return false;
        },
      },
    });
  };
}

/**
 * @param maxSize Max file size in MB
 * @param validationOptions 
 * @returns 
 */
export function MaxFileSize(maxSize: number, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    return registerDecorator({
      name: 'maxFileSize',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const fileSize = value?.size || 1024;
          return maxSize * 1024 * 1024 >= fileSize;
        },
      },
    });
  };
}
