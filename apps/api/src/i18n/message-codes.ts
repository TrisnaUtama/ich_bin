import type { ErrorCodeValue } from "../errors/error-codes";
import type { SuccessCodeValue } from "./success-codes";

/** Every translatable code in the app — error codes and success codes share one locale dictionary. */
export type MessageCode = ErrorCodeValue | SuccessCodeValue;
