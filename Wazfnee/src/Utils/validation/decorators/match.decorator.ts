import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export const IsMatch = (
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName) => {
    registerDecorator({
      name: 'isMatch',
      target: object.constructor,
      propertyName: propertyName as string,
      constraints: [property],

      ...(validationOptions && {
        options: validationOptions,
      }),

      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints;

          const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];

          return value === relatedValue;
        },

        defaultMessage(): string {
          return 'Passwords do not match';
        },
      },
    });
  };
};
