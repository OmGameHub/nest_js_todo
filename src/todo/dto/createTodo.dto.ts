import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TodoStatus } from "src/enums";

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsEnum(TodoStatus, { message: "Invalid status value" })
  readonly status: TodoStatus;
}
