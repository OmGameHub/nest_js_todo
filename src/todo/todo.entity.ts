import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from "typeorm";
import { TodoStatus } from "src/enums";
import { UserEntity } from "@/users/entities/user.entity";

@Entity()
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: TodoStatus,
    default: TodoStatus.TODO,
  })
  status: TodoStatus;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => UserEntity, (user) => user.todos)
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
