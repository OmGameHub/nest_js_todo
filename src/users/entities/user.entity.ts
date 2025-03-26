import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";
import { TodoEntity } from "@/todo/todo.entity";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => TodoEntity, (todo) => todo.user)
  todos: TodoEntity[];

  toJSON() {
    return instanceToPlain(this);
  }
}
