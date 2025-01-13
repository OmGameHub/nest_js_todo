import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService, Todo } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("todos")
  getAllTodos(): Todo[] {
    return this.appService.getTodos();
  }

  @Get("todos/:id")
  getTodoById(@Param('id') id: string): Todo | undefined {
    return this.appService.getTodoById(parseInt(id));
  }

  @Post("todos")
  addTodo(@Body("title") title: string): Todo {
    return this.appService.addTodo(title);
  }

  @Put("todos/:id")
  updateTodo(
    @Param('id') id: string,
    @Body("title") title: string,
    @Body("completed") completed: boolean
  ): Todo | undefined {
    return this.appService.updateTodo(parseInt(id), title, completed);
  }

  @Put("todos/:id/toggle")
  toggleTodo(
    @Param('id') id: string
  ): Todo | undefined {
    const todo = this.appService.getTodoById(parseInt(id));
    if (todo) {
      todo.completed = !todo.completed;
    }
    return todo;
  }

  @Delete("todos/:id")
  deleteTodo(
    @Param('id') id: string
  ): boolean {
    return this.appService.deleteTodo(parseInt(id));
  }
}
