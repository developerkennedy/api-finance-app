import z from "zod";

export const userSchema = z.object({
    id: z.uuid(),
    name: z.string().min(3),
    email: z.email(),
    password: z.string(),
})


export const createUserSchema = userSchema.omit({id:true, password:true}).extend({
    password: z.string().min(6),
})

export const ResponseUserSchema = userSchema.omit({ password: true})

export type ResponseUserDto = z.infer<typeof ResponseUserSchema>

export type UserDto = z.infer<typeof userSchema>

export type CreateUserDto = z.infer<typeof createUserSchema>

