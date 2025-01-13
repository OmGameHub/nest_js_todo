import { Injectable } from '@nestjs/common';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class AppService {
  private todos: Todo[] = [];
  private idCounter = 1;

  getHello(): string {
    return 'Hello World!';
  }

  getHelloWithName(name: string): string {
    return `Hello ${name}!`;
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  getTodoById(id: number): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  addTodo(title: string): Todo {
    const newTodo: Todo = {
      id: Date.now() + this.idCounter++,
      title,
      completed: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  updateTodo(id: number, title: string, completed: boolean): Todo | undefined {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.title = title;
      todo.completed = completed;
    }
    return todo;
  }

  deleteTodo(id: number): boolean {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}
