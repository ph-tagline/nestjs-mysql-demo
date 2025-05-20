const { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } = require('@nestjs/common');
const { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } = require('@nestjs/swagger');
const { UsersService } = require('./users.service');
const { CreateUserDto, UpdateUserDto } = require('./dto/user.dto');

class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  async findAll() {
    return this.usersService.findAll();
  }

  async findOne(id) {
    return this.usersService.findOne(id);
  }

  async create(createUserDto) {
    return this.usersService.create(createUserDto);
  }

  async update(id, updateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  async remove(id) {
    return this.usersService.remove(id);
  }
}

Controller('users')(UsersController);

exports.UsersController = UsersController;