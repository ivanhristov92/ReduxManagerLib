function extend(additionalProperties) {
  if (
    typeof additionalProperties !== "object" ||
    Array.isArray(additionalProperties) ||
    additionalProperties === null
  ) {
    throw new TypeError(
      "Expected and object, but received " + typeof additionalProperties
    );
  }

  return Object.assign(Object.create(this), additionalProperties);
}

export function addExtendFunctionality(objectToExtend) {
  return Object.assign(Object.create({ extend }), objectToExtend);
}
