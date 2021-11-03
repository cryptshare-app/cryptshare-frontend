import {BusinessError} from "@/stores/models/BusinessError";
import {ValidationError} from "@/stores/models/ValidationError";

export class ErrorService {


    public static buildMessage(error: any): string {
        if (error instanceof BusinessError) {
            return error.errorMessage;
        } else if (error instanceof ValidationError) {
            const result = error.errors.map(it => it.errorMessage + "\n");
        }
    }

}