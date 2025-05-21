import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.databaseService.executeQuery<User[]>('SELECT * FROM users');
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const users = await this.databaseService.executeQuery<User[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (users.length === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      return users[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to retrieve user with ID ${id}`);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const result = await this.databaseService.executeQuery<any>(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [createUserDto.name, createUserDto.email]
      );
      
      return {
        id: result.insertId,
        ...createUserDto,
        created_at: new Date()
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email address already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      await this.findOne(id);
      
      const fields = Object.keys(updateUserDto);
      const values = Object.values(updateUserDto);
      
      if (fields.length === 0) {
        return this.findOne(id);
      }
      
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const query = `UPDATE users SET ${setClause} WHERE id = ?`;
      
      await this.databaseService.executeQuery(query, [...values, id]);
      
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email address already exists');
      }
      throw new InternalServerErrorException(`Failed to update user with ID ${id}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      
      await this.databaseService.executeQuery(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete user with ID ${id}`);
    }
  }
}