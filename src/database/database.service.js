const { Injectable, OnModuleInit, OnModuleDestroy } = require('@nestjs/common');
const { ConfigService } = require('@nestjs/config');
const mysql = require('mysql2/promise');

class DatabaseService {
  constructor(configService) {
    this.configService = configService;
    this.pool = null;
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
    
    // Verify connection
    try {
      const connection = await this.pool.getConnection();
      console.log('Database connection established successfully');
      connection.release();
      
      // Create users table if it doesn't exist
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

  async executeQuery(query, params = []) {
    try {
      const [rows, fields] = await this.pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Query execution error:', error.message);
      throw error;
    }
  }
}

Injectable()(DatabaseService);

exports.DatabaseService = DatabaseService;