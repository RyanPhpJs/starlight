import express, { json as ExpressJson, Request, Response } from "express";
import Bun from "bun";
import database from "./database";
import { API } from "./response";
import { z } from "zod";
import { AppRequest, AppResponse } from "./types";
import { decodeToken } from "./token";

const json = ExpressJson();

export class Server {
    private app: express.Application;
    private routes: Bun.FileSystemRouter;

    constructor() {
        this.app = express();
        this.routes = new Bun.FileSystemRouter({
            style: "nextjs",
            dir: "./server/",
        });

        this.app.use("/api", (req, res, next) => {
            const route = this.routes.match(req.url);

            if (route) {
                this.execute(route, req, res);
            } else {
                res.status(404).send({
                    status: false,
                    message: "Not Found Route ",
                });
            }
        });

        this.app.use((req, res) => {
            this.routeClient(req, res);
        });
    }

    async validateAuth(req: AppRequest, res: AppResponse) {
        req.auth = () => {
            res.api.unathorized("Necessário informar um token valído");
            return true;
        };
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const parts = token.split(" ");
            if (parts.length !== 2 || parts[0] !== "Bearer") {
                return;
            }
            const result = decodeToken(parts[1]);
            if (!result.status) {
                req.auth = () => {
                    res.api.unathorized("Necessário informar um token valído");
                    return true;
                };
                return false;
            }
            const [userType, userId] = result.id.split(":");
            if (userType === "admin") {
                const user = await req.db.admin.findFirst({
                    where: {
                        id: userId,
                    },
                });
                if (!user) {
                    req.auth = () => {
                        res.api.unathorized(
                            "Necessário informar um token valído"
                        );
                        return true;
                    };
                    return;
                }
                req.auth = (mode?: "admin" | "user") => {
                    if (mode === "user") {
                        res.api.forbidden(
                            "Sem permissão de acesso a esse recurso"
                        );
                        return true;
                    }
                    req.admin = user;
                    return false;
                };
            } else {
                const user = await req.db.user.findFirst({
                    where: {
                        id: userId,
                    },
                });
                if (!user) {
                    req.auth = () => {
                        res.api.unathorized(
                            "Necessário informar um token valído"
                        );
                        return true;
                    };
                    return;
                }
                req.auth = (mode?: "admin" | "user") => {
                    if (mode === "admin") {
                        res.api.forbidden(
                            "Sem permissão de acesso a esse recurso"
                        );
                        return true;
                    }
                    req.user = user;
                    return false;
                };
            }
        }
    }

    routeClient(req: Request, res: Response) {
        res.send("Hello World");
    }

    async execute(route: Bun.MatchedRoute, req: Request, res: Response) {
        const result = await import(route.filePath);

        if (!["GET", "POST", "PUT", "DELETE", "HEAD"].includes(req.method)) {
            return res.status(401).send("Method Invalid");
        }
        req.params = route.params;
        req.query = route.query;
        req.url = route.pathname;
        // @ts-ignore
        req.data = {};
        // @ts-ignore
        req.db = database;
        // @ts-ignore
        res.api = new API(res);
        // @ts-ignore
        this.validateAuth(req, res);
        // @ts-ignore
        const fn = this.getFnName(req.method);
        if (!["POST", "PUT", "DELETE"].includes(req.method)) {
            await new Promise((resolve) => {
                json(req, res, resolve);
            });
            const $name = req.method.toLowerCase();
            if (result["schema"] instanceof z.ZodObject) {
                try {
                    // @ts-ignore
                    req.data = await result["schema"].parseAsync(req.body);
                } catch (err: any) {
                    // @ts-ignore
                    return res.api.bad(err.message);
                }
            } else if (result[`${$name}Schema`] instanceof z.ZodObject) {
                try {
                    // @ts-ignore
                    req.data = await result[`${$name}Schema`].parseAsync(
                        req.body
                    );
                } catch (err: any) {
                    // @ts-ignore
                    return res.api.bad(err.message);
                }
            }
        }

        if (typeof result === "function") {
            return result(req, res);
        }
        for (const key of fn) {
            if (typeof result[key] === "function") {
                return result[key](req, res);
            }
        }
        res.status(404).send({
            status: false,
            message: "Not Found Route ",
        });
    }

    private getFnName(method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD") {
        return [method.toLowerCase(), "default"];
    }

    start() {
        this.app.listen(3000, () => {
            console.log("Server Running");
        });
    }
}
