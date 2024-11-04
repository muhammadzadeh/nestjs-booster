import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityRegionDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
