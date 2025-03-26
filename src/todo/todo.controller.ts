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
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dto/createTodo.dto";
import { UpdateTodoDto } from "./dto/updateTodo.dto";
import ApiResponse from "src/utils/ApiResponse";
import { GetTodosQuery } from "./dto/getTodosQuery.dto";
import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";

@Controller({
  version: "1",
  path: "/todos",
})
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get("/")
  async getAllTodos(@Query() query: GetTodosQuery) {
    const todos = await this.todoService.getTodos(query);
    return new ApiResponse(200, "Todos fetched successfully", todos);
  }

  @Get("/:id")
  async getTodoById(@Param("id") id: number) {
    const todo = await this.todoService.getTodoById(id);
    return new ApiResponse(200, "Todo fetched successfully", todo);
  }

  @Post("/")
  async addTodo(@Body() todo: CreateTodoDto) {
    const newTodo = await this.todoService.addTodo(todo);
    return new ApiResponse(201, "Todo added successfully", newTodo);
  }

  @Put("/:id")
  async updateTodo(@Param("id") id: string, @Body() todo: UpdateTodoDto) {
    const updatedTodo = await this.todoService.updateTodo(parseInt(id), todo);
    return new ApiResponse(200, "Todo updated successfully", updatedTodo);
  }

  @Delete("/:id")
  async deleteTodo(@Param("id") id: number) {
    await this.todoService.deleteTodoById(id);
    return new ApiResponse(200, "Todo deleted successfully", { todoId: id });
  }
}
