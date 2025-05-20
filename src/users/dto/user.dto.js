const { ApiProperty } = require('@nestjs/swagger');
const { IsEmail, IsNotEmpty, IsString, IsOptional, Length } = require('class-validator');

class CreateUserDto {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// Define properties and validations
ApiProperty({
  description: 'The name of the user',
  example: 'John Doe',
})(CreateUserDto.prototype, 'name');

IsNotEmpty({ message: 'Name is required' })(CreateUserDto.prototype, 'name');
IsString({ message: 'Name must be a string' })(CreateUserDto.prototype, 'name');
Length(2, 100, { message: 'Name must be between 2 and 100 characters' })(CreateUserDto.prototype, 'name');

ApiProperty({
  description: 'The email of the user',
  example: 'john.doe@example.com',
})(CreateUserDto.prototype, 'email');

IsNotEmpty({ message: 'Email is required' })(CreateUserDto.prototype, 'email');
IsEmail({}, { message: 'Invalid email format' })(CreateUserDto.prototype, 'email');

class UpdateUserDto {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// Define properties and validations
ApiProperty({
  description: 'The name of the user',
  example: 'John Doe',
  required: false,
})(UpdateUserDto.prototype, 'name');

IsOptional()(UpdateUserDto.prototype, 'name');
IsString({ message: 'Name must be a string' })(UpdateUserDto.prototype, 'name');
Length(2, 100, { message: 'Name must be between 2 and 100 characters' })(UpdateUserDto.prototype, 'name');

ApiProperty({
  description: 'The email of the user',
  example: 'john.doe@example.com',
  required: false,
})(UpdateUserDto.prototype, 'email');

IsOptional()(UpdateUserDto.prototype, 'email');
IsEmail({}, { message: 'Invalid email format' })(UpdateUserDto.prototype, 'email');

exports.CreateUserDto = CreateUserDto;
exports.UpdateUserDto = UpdateUserDto;