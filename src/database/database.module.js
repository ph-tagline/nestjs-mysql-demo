const { Module, Global } = require('@nestjs/common');
const { ConfigModule, ConfigService } = require('@nestjs/config');
const { DatabaseService } = require('./database.service');

class DatabaseModule {}

Global()(
  Module({
    imports: [ConfigModule],
    providers: [DatabaseService],
    exports: [DatabaseService],
  })(DatabaseModule)
);

exports.DatabaseModule = DatabaseModule;