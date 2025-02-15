import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  createRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "incoreect inputs",
    });
    return;
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: parsedData.data?.password,
        name: parsedData.data.name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "user already exists with the username",
    });
  }
});

app.post("/signin", async (req, res) => {
  const paarsedData = CreateUserSchema.safeParse(req.body);
  if (!paarsedData.success) {
    res.json({
      message: "incorrect data",
    });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: paarsedData.data?.username,
      password: paarsedData.data?.password,
    },
  });

  if (!user) {
    res.json({
      message: "not authorized",
    });
  }
  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = createRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  //@ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "room already exists with this name",
    });
  }
});

app.get("/chats/:roomId", (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = prismaClient.chat.findMany({
    where: {
      roomId: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });
  res.json({
    messages,
  });
});

app.get("/room/:slug",async (req, res) => {
  const slug = Number(req.params.slug);
  const room =  await prismaClient.room.findFirst({
    where: {
      //@ts-ignore
          slug:slug,
    }
});

    res.json({
      room
    })
})

app.listen(3000, () => {
  console.log("running on Port 3000 connected to database");
});
