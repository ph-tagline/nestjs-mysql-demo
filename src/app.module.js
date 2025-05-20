const { Module } = require('@nestjs/common');
const { ConfigModule } = require('@nestjs/config');
const { UsersModule } = require('./users/users.module');
const { DatabaseModule } = require('./database/database.module');

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