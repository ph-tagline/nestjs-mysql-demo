const { Injectable, NotFoundException, ConflictException, InternalServerErrorException } = require('@nestjs/common');
const { DatabaseService } = require('../database/database.service');

class UsersService {
  constructor(databaseService) {
    this.databaseService = databaseService;
  }

  async findAll() {
    try {
      return await this.databaseService.executeQuery('SELECT * FROM users');
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findOne(id) {
    try {
      const users = await this.databaseService.executeQuery(
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

  async create(createUserDto) {
    try {
      const result = await this.databaseService.executeQuery(
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

  async update(id, updateUserDto) {
    try {
      // Check if user exists
      await this.findOne(id);
      
      // Build dynamic query based on provided fields
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

  async remove(id) {
    try {
      // Check if user exists
      await this.findOne(id);
      
      await this.databaseService.executeQuery(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      
      return { message: `User with ID ${id} successfully deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete user with ID ${id}`);
    }
  }
}

Injectable()(UsersService);

exports.UsersService = UsersService;