import {HTTP} from "@/axios";
import UserInformation from "@/stores/models/UserInformation";
import UserInformationTO from "@/services/models/UserInformationTO";
import {AxiosResponse} from "axios";
import SearchUserNames from "@/services/user/types/SearchUserNames";


/**
 * Static http service for user related logic
 */
export default class UserService {

    /**
     * Gets information about the user.
     * @returns {Promise<UserInformation>}
     */
    static async getUserInformation(): Promise<UserInformation> {
        let response: AxiosResponse<UserInformationTO> = await HTTP().get("/users/current");
        return UserInformation.fromTO(response.data);
    }

    /**
     * Gets information about the user.
     * @returns {Promise<UserInformation>}
     */
    static async getUserInformationById(userId): Promise<UserInformation> {
        let response: AxiosResponse<UserInformationTO> = await HTTP().get("/users", {
            params: {
                "userId": userId
            }
        });
        return UserInformation.fromTO(response.data);
    }

    static async fetchUserNames(): Promise<SearchUserNames> {
        let response = await HTTP().get("users/names");
        return response.data as SearchUserNames;

    }
}