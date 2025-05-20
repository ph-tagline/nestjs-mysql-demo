const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    // Create connection without database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database '${process.env.DB_NAME}' created or already exists`);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');
    
    // Insert some sample data
    await connection.query(`
      INSERT INTO users (name, email) 
      VALUES 
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com')
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `);
    console.log('Sample users inserted or updated');
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

setupDatabase();