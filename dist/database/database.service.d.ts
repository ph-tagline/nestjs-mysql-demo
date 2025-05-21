import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private pool;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    executeQuery<T>(query: string, params?: any[]): Promise<T>;
}
