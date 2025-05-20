const { Module } = require('@nestjs/common');
const { ConfigModule } = require('@nestjs/config');
const { DatabaseModule } = require('./database/database.module');
const { UsersModule } = require('./users/users.module');

class AppModule {}

Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
  ],
})(AppModule);

exports.AppModule = AppModule;