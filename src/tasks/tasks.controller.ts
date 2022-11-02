import { Body, Controller, Get, Post, Param, Delete, Patch, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasksWithFilters(@Query() filterDto: FilterTaskDto): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(@Body() CreateTaskDto: CreateTaskDto): Promise<Task> {
        return await this.tasksService.createTask(CreateTaskDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: number) {
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: number): Promise<void> {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    async updateTaskStatus(@Param('id') id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
        return await this.tasksService.updateTaskStatus(id, status);
    }
}