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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mysql = require("mysql2/promise");
let DatabaseService = class DatabaseService {
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        this.pool = mysql.createPool({
            host: this.configService.get('DB_HOST'),
            port: this.configService.get('DB_PORT'),
            user: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_NAME'),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        try {
            const connection = await this.pool.getConnection();
            console.log('Database connection established successfully');
            connection.release();
            await this.executeQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
            console.log('Users table initialized');
        }
        catch (error) {
            console.error('Database connection failed:', error.message);
            throw error;
        }
    }
    async onModuleDestroy() {
        if (this.pool) {
            await this.pool.end();
            console.log('Database connection closed');
        }
    }
    async executeQuery(query, params = []) {
        try {
            const [rows] = await this.pool.execute(query, params);
            return rows;
        }
        catch (error) {
            console.error('Query execution error:', error.message);
            throw error;
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map