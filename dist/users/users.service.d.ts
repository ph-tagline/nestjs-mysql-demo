import { DatabaseService } from '../database/database.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
interface User {
    id: number;
    name: string;
    email: string;
    created_at: Date;
}
export declare class UsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
}
export {};
