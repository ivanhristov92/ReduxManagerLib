export class ModuleInitializationTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = "ModuleInitializationTypeError";
  }
}

export class UnexpectedRuntimeError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnexpectedRuntimeError";
  }
}

export function dispatchAnUnexpectedErrorEvent(error, details) {
  let event = new window.CustomEvent("unexpectedruntimeerror", {
    detail: { error: new UnexpectedRuntimeError(error), details }
  });
  document.dispatchEvent(event);
}

export function attachAnUnexpectedErrorLogger() {
  document.addEventListener("unexpectedruntimeerror", reduxManagerLibError => {
    console.log(reduxManagerLibError.detail);
    console.log(reduxManagerLibError.detail.error);
  });
}
