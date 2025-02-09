import { Injectable, NotFoundException, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "./todo.entity";
import { CreateTodoDto } from "./dto/createTodo.dto";
import { UpdateTodoDto } from "./dto/updateTodo.dto";
import { GetTodosQuery } from "./dto/getTodosQuery.dto";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  getTodos(@Query() query: GetTodosQuery): Promise<Todo[]> {
    const { q, completed } = query;
    const queryBuilder = this.todosRepository.createQueryBuilder("todo");

    if (completed !== undefined) {
      queryBuilder.andWhere("todo.completed = :completed", { completed });
    }

    if (q) {
      queryBuilder.andWhere(
        "todo.title ILIKE :q OR todo.description ILIKE :q",
        {
          q: `%${q}%`,
        },
      );
    }

    return queryBuilder.getMany();
  }

  async getTodoById(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException("Todo not found");
    }

    return todo;
  }

  async addTodo(todo: CreateTodoDto): Promise<Todo> {
    const newTodo = this.todosRepository.create(todo);
    await this.todosRepository.save(newTodo);
    return newTodo;
  }

  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    await this.getTodoById(id);

    const { title, description, status, completed } = updateTodoDto;
    const todoDetails: Partial<Todo> = { id };
    if (title) {
      todoDetails.title = title;
    }

    if (description) {
      todoDetails.description = description;
    }

    if (status) {
      todoDetails.status = status;
    }

    if (completed !== undefined) {
      todoDetails.completed = completed;
    }

    const updatedTodo = await this.todosRepository.preload(todoDetails);
    return this.todosRepository.save(updatedTodo);
  }

  async deleteTodoById(id: number) {
    await this.getTodoById(id);
    return this.todosRepository.softDelete(id);
  }
}
