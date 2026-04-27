import { hash } from "bcryptjs";
import { APIError } from "../../domain/errors/errors";
import { env } from "../../main/config/env";
import { CreateUserDto, ResponseUserDto } from "../../domain/entities/user.entity";
import { UserRepositoryPorts } from "../ports/user-repository.ports";

export class CreateUserUseCase {
    constructor(private readonly userRepository: UserRepositoryPorts) {}

    async execute(data: CreateUserDto): Promise<ResponseUserDto> {
        const userAlreadyExists = await this.userRepository.findByEmail(data.email);

        if (userAlreadyExists) {
            throw new APIError("User already exists");
        }

        // A senha nunca vai em texto puro para o banco.
        const hashedPassword = await hash(data.password, env.BCRYPT_ROUNDS);

        return this.userRepository.create({ ...data, password: hashedPassword });
    }
}
