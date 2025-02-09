import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { TodoModule } from "./todo/todo.module";

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads .env variables
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true, // Only use synchronize: true during development
    }),
    TodoModule,
  ],
})
export class AppModule {}
