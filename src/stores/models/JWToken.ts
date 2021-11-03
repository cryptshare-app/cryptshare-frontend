import JWTokenTO from "@/services/auth/types/JWTokenTO";

export class JWToken implements JWTokenTO {
    accessToken?: string;
    refreshToken?: string;


    static fromTO(tokens: JWTokenTO): JWToken {
        const result = new JWToken();
        Object.assign(result, tokens);
        return result
    }
}