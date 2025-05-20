const { Module } = require('@nestjs/common');
const { ConfigModule, ConfigService } = require('@nestjs/config');
const { DatabaseService } = require('./database.service');

class DatabaseModule {}

Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DatabaseService,
      useFactory: (configService) => new DatabaseService(configService),
      inject: [ConfigService],
    },
  ],
  exports: [DatabaseService],
})(DatabaseModule);

exports.DatabaseModule = DatabaseModule;