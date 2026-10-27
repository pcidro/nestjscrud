import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @Max(50)
  @Min(0)
  @IsOptional()
  offset?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  limit?: number;
}
