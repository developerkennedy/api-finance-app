import {UserRepositoryPorts} from "../../application/ports/user-repository.ports";
import {CreateUserDto, ResponseUserDto, UserDto} from "../../domain/entities/user.entity";
import {db} from "../database/client";
import {eq} from "drizzle-orm";
import {users} from "../database/schema";

export class UsersRepository implements UserRepositoryPorts{
    async findByEmail(email: string): Promise<UserDto | null> {
        const user = await db.query.users.findFirst({
            where: eq(users.email,email)
        })
        return  user ?? null
    }

    async findById(id: string): Promise<ResponseUserDto | null> {
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                id: true,
                name: true,
                email: true,
            },
        })

        return user ?? null
    }

    async create(data: CreateUserDto): Promise<ResponseUserDto> {
       const [user] = await db.insert(users).values({
           name:data.name,
           email: data.email,
           password: data.password,
       }).returning({
           id:users.id,
           name:users.name,
           email:users.email,
           created_at: users.created_at,
           updated_at: users.updated_at
       })
        return user
    }
}
