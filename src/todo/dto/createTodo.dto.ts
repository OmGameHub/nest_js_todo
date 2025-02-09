import { TodoStatus } from "src/enums";

export class CreateTodoDto {
  readonly title: string;
  readonly description: string;
  readonly status: TodoStatus;
}
