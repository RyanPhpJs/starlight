import { AppRequest, AppResponse } from "~/types";
export function get(req: AppRequest, res: AppResponse) {
    if (req.auth()) return;
    return res.send({ id: 1 });
}
