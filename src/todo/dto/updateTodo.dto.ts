import { TodoStatus } from "src/enums";

export class UpdateTodoDto {
  readonly title?: string;
  readonly description?: string;
  readonly status?: TodoStatus;
  readonly completed?: boolean;
}
