import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class BasePaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @IsIn([10, 25, 50, 100])
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  q?: string;
}
