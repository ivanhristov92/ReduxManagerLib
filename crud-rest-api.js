export default function restApiFactory() {
  return {
    create(payload) {
      return new Promise((resolve, reject) => {
        let response = { byId: {} };
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
