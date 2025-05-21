const { Module, Global } = require('@nestjs/common');
const { ConfigModule, ConfigService } = require('@nestjs/config');
const { DatabaseService } = require('./database.service');

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

exports.DatabaseModule = DatabaseModule;