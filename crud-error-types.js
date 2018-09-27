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
