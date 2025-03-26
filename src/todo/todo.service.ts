import { Injectable, NotFoundException, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TodoEntity } from "./todo.entity";
import { CreateTodoDto } from "./dto/createTodo.dto";
import { UpdateTodoDto } from "./dto/updateTodo.dto";
import { GetTodosQuery } from "./dto/getTodosQuery.dto";
import { UserEntity } from "@/users/entities/user.entity";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todosRepository: Repository<TodoEntity>,
  ) {}

  getTodos(
    userId: number,
    @Query() query: GetTodosQuery,
  ): Promise<TodoEntity[]> {
    const { q, completed } = query;
    const queryBuilder = this.todosRepository.createQueryBuilder("todo");

    queryBuilder.where("todo.userId = :userId", { userId });

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

  async getTodoById(id: number): Promise<TodoEntity> {
    const todo = await this.todosRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!todo) {
      throw new NotFoundException("Todo not found");
    }

    return todo;
  }

  async addTodo(todo: CreateTodoDto, user: UserEntity): Promise<TodoEntity> {
    const newTodo = this.todosRepository.create({ ...todo, user });
    await this.todosRepository.save(newTodo);
    return newTodo;
  }

  async updateTodo(
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    await this.getTodoById(id);

    const { title, description, status, completed } = updateTodoDto;
    const todoDetails: Partial<TodoEntity> = { id };
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
