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

export function dispatchAnUnexpectedErrorEvent(error) {
  let event = new window.CustomEvent("unexpectedruntimeerror", {
    detail: new UnexpectedRuntimeError(error)
  });
  document.dispatchEvent(event);
}
