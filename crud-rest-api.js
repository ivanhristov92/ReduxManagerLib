export default function restApiFactory() {
  return {
    create(objects) {
      return new Promise((resolve, reject) => {
        if (!Array.isArray(objects)) {
          reject({
            error: new TypeError(
              "'create' expects am array of objects. You provided: " +
                typeof objects
            )
          });
        }
        if (objects.length === 0) {
          reject({
            error: new TypeError(
              "'create' expects am array of objects. You provided an empty array"
            )
          });
        }

        let response = objects.reduce(
          (acc, obj, i) => {
            return {
              ...acc,
              byId: {
                ...acc.byId,
                [i]: obj
              }
            };
          },
          { byId: {} }
        );
        resolve(response);
      });
    },
    read(payload) {
      return new Promise((res, rej) => {});
    },
    update(payload) {
      return new Promise((res, rej) => {});
    },
    delete(payload) {
      return new Promise((res, rej) => {});
    }
  };
}
