import {z} from "zod";

export const CreateUserSchema=z.object({
    username:z.string().min(3).max(30),
    password:z.string().min(3).max(30),
    name:z.string()
})

export const SigninSchema=z.object({
    username:z.string().min(3).max(20),
    password:z.string()
})

export const createRoomSchema=z.object({
    name:z.string().min(3).max(20)
})