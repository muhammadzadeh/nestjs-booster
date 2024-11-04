import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class NotificationCTAResponse {
  @ApiProperty({
    type: String,
    description: 'The cta title',
    example: 'Verify your email',
  })
  @Type(() => String)
  title!: string;

  @ApiProperty({
    type: String,
    description: 'the cta url',
    example: 'https://example.com',
  })
  @Type(() => String)
  url!: string;

  @ApiProperty({
    type: Boolean,
    description: 'is main cta',
    example: false,
  })
  @Type(() => Boolean)
  isMain!: boolean;
}
