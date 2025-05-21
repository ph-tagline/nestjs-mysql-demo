"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let UsersService = class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async findAll() {
        try {
            return await this.databaseService.executeQuery('SELECT * FROM users');
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve users');
        }
    }
    async findOne(id) {
        try {
            const users = await this.databaseService.executeQuery('SELECT * FROM users WHERE id = ?', [id]);
            if (users.length === 0) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return users[0];
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to retrieve user with ID ${id}`);
        }
    }
    async create(createUserDto) {
        try {
            const result = await this.databaseService.executeQuery('INSERT INTO users (name, email) VALUES (?, ?)', [createUserDto.name, createUserDto.email]);
            return {
                id: result.insertId,
                ...createUserDto,
                created_at: new Date()
            };
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.ConflictException('Email address already exists');
            }
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
    }
    async update(id, updateUserDto) {
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.ConflictException('Email address already exists');
            }
            throw new common_1.InternalServerErrorException(`Failed to update user with ID ${id}`);
        }
    }
    async remove(id) {
        try {
            await this.findOne(id);
            await this.databaseService.executeQuery('DELETE FROM users WHERE id = ?', [id]);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to delete user with ID ${id}`);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map