import { AppResponse } from "./types";

export class API {
    private res: AppResponse;
    constructor(res: AppResponse) {
        this.res = res;
    }
    private send(success: boolean, status: number, data: any, extra?: any) {
        if (success) {
            this.res.status(status).send({
                success: true,
                result: data,
            });
            return;
        } else {
            this.res.status(status).send({
                success: false,
                message: data,
                info: extra,
            });
            return;
        }
    }
    badGateway(message: string) {
        return this.send(false, 400, message);
    }
    bad(message: string) {
        return this.send(false, 400, message);
    }
    unathorized(message: string) {
        return this.send(false, 401, message);
    }
    needAuthenticate(message: string, authType: string) {
        return this.send(false, 401, message, { type: authType });
    }
    needPayment(message: string) {
        return this.send(false, 402, message);
    }
    forbidden(message: string) {
        return this.send(false, 403, message);
    }
    notFound(message: string) {
        return this.send(false, 404, message);
    }
    methodNotAllowed(message: string) {
        return this.send(false, 405, message);
    }
    notAcceptable(message: string) {
        return this.send(false, 406, message);
    }
    needProxy(message: string) {
        return this.send(false, 407, message);
    }
    timeout(message: string) {
        return this.send(false, 408, message);
    }
    gone(message: string) {
        return this.send(false, 410, message);
    }
    notAvalliable(message: string) {
        return this.send(false, 410, message);
    }
    lengthRequired(message: string) {
        return this.send(false, 411, message);
    }
    conditionFailed(message: string) {
        return this.send(false, 412, message);
    }
    preConditionFailed(message: string) {
        return this.send(false, 412, message);
    }
    payloadLarge(message: string) {
        return this.send(false, 413, message);
    }
    payloadLong(message: string) {
        return this.send(false, 413, message);
    }
    uriLarge(message: string) {
        return this.send(false, 414, message);
    }
    unsupported(message: string) {
        return this.send(false, 415, message);
    }
    unsupportedMediaType(message: string) {
        return this.send(false, 415, message);
    }
    invalidRange(message: string) {
        return this.send(false, 416, message);
    }
    expectFailed(message: string) {
        return this.send(false, 417, message);
    }
    teapot(message: string) {
        return this.send(false, 418, message);
    }
    misdirect(message: string) {
        return this.send(false, 421, message);
    }
    unprocessable(message: string) {
        return this.send(false, 422, message);
    }
    unprocessableEntity(message: string) {
        return this.send(false, 422, message);
    }
    locked(message: string) {
        return this.send(false, 423, message);
    }
    failedDependency(message: string) {
        return this.send(false, 424, message);
    }
    upgradeRequired(message: string) {
        return this.send(false, 426, message);
    }
    needUpgrade(message: string) {
        return this.send(false, 426, message);
    }
    conditionRequired(message: string) {
        return this.send(false, 428, message);
    }
    needCondition(message: string) {
        return this.send(false, 428, message);
    }
    preConditionRequired(message: string) {
        return this.send(false, 428, message);
    }
    needPreCondition(message: string) {
        return this.send(false, 428, message);
    }
    tooManyRequest(message: string) {
        return this.send(false, 429, message);
    }
    rateLimit(message: string) {
        return this.send(false, 429, message);
    }
    headerLarge(message: string) {
        return this.send(false, 431, message);
    }
    headerLong(message: string) {
        return this.send(false, 431, message);
    }
    legalReason(message: string) {
        return this.send(false, 451, message);
    }
    success(data: any) {
        return this.send(true, 200, data);
    }
    ok(data: any) {
        return this.send(true, 200, data);
    }
    created(data: any) {
        return this.send(true, 201, data);
    }
    accepted(data: any) {
        return this.send(true, 202, data);
    }
    notAuthoritativeInformation(data: any) {
        return this.send(true, 203, data);
    }
    notContent(data: any) {
        return this.send(true, 204, data);
    }
    resetContent(data: any) {
        return this.send(true, 205, data);
    }
    reset(data: any) {
        return this.send(true, 205, data);
    }
    partialContent(data: any) {
        return this.send(true, 206, data);
    }
    partial(data: any) {
        return this.send(true, 206, data);
    }
}
