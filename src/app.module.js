const { Module } = require('@nestjs/common');
const { ConfigModule } = require('@nestjs/config');
const { DatabaseModule } = require('./database/database.module');
const { UsersModule } = require('./users/users.module');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
  ],
})
class AppModule {}

exports.AppModule = AppModule;