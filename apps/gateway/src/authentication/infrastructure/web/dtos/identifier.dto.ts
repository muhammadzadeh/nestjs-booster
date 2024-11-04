import { IsNotEmpty } from 'class-validator';
import { ToLowerCase } from '@repo/decorator';
import { IsIdentifier } from '@repo/validator/is-identifier.validator';

export class IdentifierDto {
  @IsNotEmpty()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: string;
}
