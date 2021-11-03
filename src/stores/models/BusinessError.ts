import {ErrorTO} from "@/services/models/ErrorTO";
import {AxiosError} from "axios";

export class BusinessError implements ErrorTO {
    errorMessage: string;
    status: number;

    constructor(errorMessages: string, status: number) {
        this.errorMessage = errorMessages;
        this.status = status;

    }

    /**
     * Creates a Error from a Response
     * @param error The Error Object containing an response and response data
     * @returns {ErrorTO}
     */
    static fromResponse(error: AxiosError): BusinessError {

        if (error.response && error.response.data) {

            let errorMessageObject = error.response.data;
            if (errorMessageObject.errorMessage) {
                return new BusinessError(errorMessageObject.errorMessage, errorMessageObject.status);
            }
        }
        return new BusinessError("Something bad happened, please try again later", 500);


    }

    static fromTO(error: ErrorTO): BusinessError {
        return new BusinessError(error.errorMessage, error.status)
    }

}