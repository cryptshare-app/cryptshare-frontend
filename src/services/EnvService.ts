export default class EnvService {

    static getEnv(key: string): string {
        return process.env[key];
    }
}