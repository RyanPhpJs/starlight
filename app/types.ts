import { Request, Response } from "express";
import Db from "./database";
import { API } from "./response";
import { z } from "zod";
import { Admin, User } from "@prisma/client";

export type AppRequest<Body extends z.ZodSchema = z.ZodAny> = Request<
    {},
    Body
> & {
    db: typeof Db;
    validate: (schema: any) => boolean;
    data: z.infer<Body>;
    auth: (mode?: "user" | "admin") => boolean;
    admin: Admin;
    user: User;
};

export type AppResponse = Response & {
    api: API;
};
