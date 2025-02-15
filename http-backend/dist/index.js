"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
const middleware_1 = require("./middleware");
const types_1 = require("@repo/common/types");
const client_1 = require("@repo/db/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/signup", async (req, res) => {
    const parsedData = types_1.CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "incoreect inputs"
        });
        return;
    }
    try {
        const user = await client_1.prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: parsedData.data?.password,
                name: parsedData.data.name
            }
        });
        res.json({
            userId: user.id
        });
    }
    catch (e) {
        res.status(411).json({
            message: "user already exists with the username"
        });
    }
});
app.post("/signin", async (req, res) => {
    const paarsedData = types_1.CreateUserSchema.safeParse(req.body);
    if (!paarsedData.success) {
        res.json({
            message: "incorrect data"
        });
        return;
    }
    const user = await client_1.prismaClient.user.findFirst({
        where: {
            email: paarsedData.data?.username,
            password: paarsedData.data?.password
        }
    });
    if (!user) {
        res.json({
            message: "not authorized"
        });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user?.id
    }, config_1.JWT_SECRET);
    res.json({
        token
    });
});
app.post("/room", middleware_1.middleware, async (req, res) => {
    const parsedData = types_1.createRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        });
        return;
    }
    //@ts-ignore
    const userId = req.userId;
    try {
        const room = await client_1.prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        });
        res.json({
            roomId: room.id
        });
    }
    catch (e) {
        res.status(411).json({
            message: "room already exists with this name"
        });
    }
});
app.listen(3000, () => {
    console.log("running on Port 3000 connected to database");
});
