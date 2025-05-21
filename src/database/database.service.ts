import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import { Pool, PoolConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {}

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
    } catch (error) {
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

  async executeQuery<T>(query: string, params: any[] = []): Promise<T> {
    try {
      const [rows] = await this.pool.execute(query, params);
      return rows as T;
    } catch (error) {
      console.error('Query execution error:', error.message);
      throw error;
    }
  }
}