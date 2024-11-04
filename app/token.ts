import crypto from "crypto";
const SP = "/";
const KEY = crypto
    .createHash("sha256")
    .update(process.env.TOKEN || "")
    .digest();
function encrypt(plainText: string) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
    let encrypted = cipher.update(plainText, "utf8", "base64url");
    encrypted += cipher.final("base64url");

    // Retorna o IV junto com o texto criptografado
    return `${iv.toString("base64url")}${SP}${encrypted}`;
}
function decrypt(encryptedText: string) {
    const parts = encryptedText.split(SP);
    const iv = Buffer.from(parts[0], "base64url");
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    let decrypted = decipher.update(encrypted, "base64url", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

export function createToken(userId: string, userIp: string, expire = 60 * 24) {
    return encrypt(
        [userId, userIp, Math.floor(Date.now() / 1000) + expire * 60].join(";")
    );
}
export function createAdminToken(
    userId: string,
    userIp: string,
    expire = 60 * 24
) {
    return createToken(`admin:${userId}`, userIp, expire);
}
export function createUserToken(
    userId: string,
    userIp: string,
    expire = 60 * 24
) {
    return createToken(`admin:${userId}`, userIp, expire);
}

export function decodeToken(
    token: string,
    userIp?: string
):
    | {
          status: true;
          id: string;
      }
    | {
          status: false;
          type: "EXPIRED_TOKEN" | "INVALID_IP" | "INVALID_TOKEN";
      } {
    try {
        const result = decrypt(token);
        const [userId, userIP, expire] = result.split(";");
        if (Date.now() > Number(expire) * 1000) {
            return { status: false, type: "EXPIRED_TOKEN" };
        }
        if (userIp && userIP !== userIp)
            return { status: false, type: "INVALID_IP" };
        return {
            status: true,
            id: userId,
        };
    } catch (err) {
        return { status: false, type: "INVALID_TOKEN" };
    }
}
