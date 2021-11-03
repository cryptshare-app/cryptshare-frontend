import {ValidationErrorTO} from "@/services/models/ValidationErrorTO";
import {AxiosError} from "axios";
import {ErrorTO} from "@/services/models/ErrorTO";

export class ValidationError implements ValidationErrorTO {

    errors?: ErrorTO[];

    constructor(errors: ErrorTO[]) {
        this.errors = errors;

    }

    /**
     * Creates a Error from a Response
     * @param error The Error Object containing an response and response data
     * @returns {ErrorTO}
     */
    static fromResponse(error: AxiosError): ValidationError {

        if (error.response && error.response.data) {

            let errorMessageObject = error.response.data;
            if (errorMessageObject.errors) {
                return new ValidationError(errorMessageObject.errorMessage);
            }
        }


    }

    static fromTO(error: ValidationErrorTO): ValidationError {
        return new ValidationError(error.errors);
    }


}