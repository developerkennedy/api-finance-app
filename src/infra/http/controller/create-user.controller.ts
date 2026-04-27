import {Request, Response} from 'express'
import {APIError} from "../../../domain/errors/errors";
import {CreateUserUseCase} from "../../../application/use-cases/create-user.use-case";
import {registerSchema} from "../../../auth/schema";

export class CreateUserController {
    constructor(private readonly createUserUseCase: CreateUserUseCase) {}
    async handle(request: Request, response: Response): Promise<void> {
        const parsed = registerSchema.safeParse(request.body)

        if(!parsed.success){
            response.status(400).json({message: parsed.error.flatten().fieldErrors})
            return
        }

        try {
            const user = await this.createUserUseCase.execute(parsed.data)
            response.status(201).json(user)
        }catch (e) {
            if(e instanceof APIError){
                response.status(400).json({message: e.message})
                return
            }

            console.error('Unexpected error on register:', e)
            response.status(500).json({ message: 'Internal server error' })
        }


    }
}

