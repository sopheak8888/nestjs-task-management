import { Injectable } from '@nestjs/common';
import { TaskStatus } from "./task-status.enum";
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from "./task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FilterTaskDto } from './dto/filter-task.dto';
@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private taskRepository: Repository<Task>
    ) {}

    async getTaskById(id: number): Promise<Task> {
        const found =  await this.taskRepository.findOne({
            where: {id: id},
            select: ['id', 'title', 'description', 'status']
        });
        if (!found) {
            throw new Error('Task not found');
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task: Task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN
        });
        await this.taskRepository.save(task);
        return task;
    }

    async deleteTaskById(id: number): Promise<void> {
        const found = await this.getTaskById(id);
        if (!found) {
            throw new Error('Task not found');
        }
        await this.taskRepository.delete({
            id: id
        });
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        let task = await this.getTaskById(id);
        await this.taskRepository.update({
            id: id
        }, {
            status: status
        });
        task.status = status;
        return task;
    }

    async getTasks(filterDto: FilterTaskDto): Promise<Task[]>{
        const { status, search } = filterDto;
        let tasks = this.taskRepository.createQueryBuilder('task');
        if (status) {
            tasks.andWhere('task.status = :status', { status });
        }
        if (search) {
            tasks.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        return await tasks.getMany();
    }
}