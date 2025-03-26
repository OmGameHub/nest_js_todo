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
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dto/createTodo.dto";
import { UpdateTodoDto } from "./dto/updateTodo.dto";
import ApiResponse from "src/utils/ApiResponse";
import { GetTodosQuery } from "./dto/getTodosQuery.dto";
import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorators";

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
  async getTodoById(@Param("id", ParseIntPipe) id: number) {
    const todo = await this.todoService.getTodoById(id);
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
  async updateTodo(
    @Param("id", ParseIntPipe) id: number,
    @Body() todo: UpdateTodoDto,
  ) {
    const updatedTodo = await this.todoService.updateTodo(id, todo);
    return new ApiResponse(
      HttpStatus.OK,
      "Todo updated successfully",
      updatedTodo,
    );
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async deleteTodo(@Param("id", ParseIntPipe) id: number) {
    await this.todoService.deleteTodoById(id);
    return new ApiResponse(HttpStatus.OK, "Todo deleted successfully", {
      todoId: id,
    });
  }
}
