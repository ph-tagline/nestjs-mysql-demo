const { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } = require('@nestjs/common');
const { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } = require('@nestjs/swagger');
const { UsersService } = require('./users.service');
const { CreateUserDto, UpdateUserDto } = require('./dto/user.dto');

class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  async create(@Body() createUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id, @Body() updateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id) {
    return this.usersService.remove(Number(id));
  }
}

Controller('users')(UsersController);
Get()(UsersController.prototype, 'findAll');
Get(':id')(UsersController.prototype, 'findOne');
Post()(UsersController.prototype, 'create');
Put(':id')(UsersController.prototype, 'update');
Delete(':id')(UsersController.prototype, 'remove');

exports.UsersController = UsersController;