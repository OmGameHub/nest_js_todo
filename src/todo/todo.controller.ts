import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  ForbiddenException,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dto/createTodo.dto";
import { UpdateTodoDto } from "./dto/updateTodo.dto";
import ApiResponse from "src/utils/ApiResponse";
import { GetTodosQuery } from "./dto/getTodosQuery.dto";
import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorators";
import { TodoOwnershipGuard } from "./guards/todo-ownership.guard";

@Controller({
  version: "1",
  path: "/todos",
})
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get("/")
  @HttpCode(HttpStatus.OK)
  async getAllTodos(
    @Query() query: GetTodosQuery,
    @CurrentUser() currentUser: any,
  ) {
    const todos = await this.todoService.getTodos(currentUser.userId, query);
    return new ApiResponse(HttpStatus.OK, "Todos fetched successfully", todos);
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TodoOwnershipGuard)
  async getTodoById(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
  ) {
    const todo = await this.todoService.getTodoById(id);

    // Check if the logged-in user is the owner of the todo
    if (todo.user.id !== currentUser.userId) {
      throw new ForbiddenException(
        "You are not authorized to access this todo.",
      );
    }

    return new ApiResponse(HttpStatus.OK, "Todo fetched successfully", todo);
  }

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async addTodo(@Body() todo: CreateTodoDto, @CurrentUser() currentUser: any) {
    const newTodo = await this.todoService.addTodo(todo, {
      id: currentUser.userId,
      ...currentUser,
    });
    return new ApiResponse(
      HttpStatus.CREATED,
      "Todo added successfully",
      newTodo,
    );
  }

  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TodoOwnershipGuard)
  async updateTodo(
    @Param("id", ParseIntPipe) id: number,
    @Body() todo: UpdateTodoDto,
    @CurrentUser() currentUser: any,
  ) {
    const existingTodo = await this.todoService.getTodoById(id);

    // Check if the logged-in user is the owner of the todo
    if (existingTodo.user.id !== currentUser.userId) {
      throw new ForbiddenException(
        "You are not authorized to update this todo.",
      );
    }

    const updatedTodo = await this.todoService.updateTodo(id, todo);
    return new ApiResponse(
      HttpStatus.OK,
      "Todo updated successfully",
      updatedTodo,
    );
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TodoOwnershipGuard)
  async deleteTodo(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
  ) {
    const existingTodo = await this.todoService.getTodoById(id);

    // Check if the logged-in user is the owner of the todo
    if (existingTodo.user.id !== currentUser.userId) {
      throw new ForbiddenException(
        "You are not authorized to delete this todo.",
      );
    }

    await this.todoService.deleteTodoById(id);
    return new ApiResponse(HttpStatus.OK, "Todo deleted successfully", {
      todoId: id,
    });
  }
}
