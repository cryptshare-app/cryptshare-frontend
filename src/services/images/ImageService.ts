import {AxiosResponse} from "axios";
import {HTTP} from "@/axios";

export default class ImageService {
    static async uploadImage(): Promise<string> {
        let response: AxiosResponse<string> = await HTTP().get(
            "/images"
        );
        return response.data;
    }
}
