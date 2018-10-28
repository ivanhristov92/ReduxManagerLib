import { dispatchAnUnexpectedErrorEvent } from "../crud-error-types";

export function defaultRuntimeErrorHandler(error, details) {
  dispatchAnUnexpectedErrorEvent(error, details);
}
