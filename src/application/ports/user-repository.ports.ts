import {CreateUserDto, ResponseUserDto, UserDto} from "../../domain/entities/user.entity";

export interface UserRepositoryPorts {
    findByEmail(email: string): Promise<UserDto | null>;
    findById(id: string): Promise<ResponseUserDto | null>;
    create(user: CreateUserDto): Promise<ResponseUserDto>;
}
