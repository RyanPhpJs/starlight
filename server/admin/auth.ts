import { AppRequest, AppResponse } from "../../app/types";
import { z } from "zod";
import argon2 from "argon2";
import { createToken } from "~/token";

export const postSchema = z.object({
    username: z.string(),
    password: z.string(),
});
export async function post(
    req: AppRequest<typeof postSchema>,
    res: AppResponse
) {
    const admin = await req.db.admin.findFirst({
        where: {
            username: req.body.username,
        },
    });
    if (!admin) {
        return res.api.unathorized("Usuário ou senha inválidos");
    }
    if (!(await argon2.verify(admin.password, req.data.password))) {
        return res.api.unathorized("Usuário ou senha inválidos");
    }

    res.api.success({
        token: createToken(admin.id, req.ip || "127.0.0.1"),
    });
}
