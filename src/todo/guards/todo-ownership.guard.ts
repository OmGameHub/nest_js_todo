import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  ParseIntPipe,
} from "@nestjs/common";
import { TodoService } from "../todo.service";
import { Request } from "express";

@Injectable()
export class TodoOwnershipGuard implements CanActivate {
  constructor(private readonly todoService: TodoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const currentUser = request.user as any;
    const paramPipe = new ParseIntPipe();
    const todoId = await paramPipe.transform(request.params?.id, {
      type: "param",
      //   data: "id",
      metatype: Number,
    });

    const existingTodo = await this.todoService.getTodoById(todoId);
    console.log("existingTodo", existingTodo);

    if (!existingTodo || existingTodo.user.id !== currentUser.userId) {
      throw new ForbiddenException(
        "You are not authorized to access this todo.",
      );
    }

    console.log("pass request.params >>> ", request.params.id);

    return true; // Ownership verified
  }
}
