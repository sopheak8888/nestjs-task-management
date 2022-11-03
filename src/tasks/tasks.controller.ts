import { Body, Controller, Get, Post, Param, Delete, Patch, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasksWithFilters(
        @Query() filterDto: FilterTaskDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(
        @Body() CreateTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return await this.tasksService.createTask(CreateTaskDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id: number,
        @GetUser() user: User    
    ) {
        return this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id: number,
        @GetUser() user: User  
    ): Promise<void> {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    async updateTaskStatus(
        @Param('id') id: number, 
        @GetUser() user: User,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return await this.tasksService.updateTaskStatus(id, user, status);
    }
}