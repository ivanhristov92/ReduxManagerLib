export default function restApiFactory() {
  return {
    create(payload) {
      return new Promise((resolve, reject) => {
        let response = { byId: {} };
        resolve(response);
      });
    },
    read(payload) {
      return new Promise((resolve, reject) => {
        let response = { byId: {} };
        resolve(response);
      });
    },
    update(payload) {
      return new Promise((resolve, reject) => {
        let response = { byId: {} };
        resolve(response);
      });
    },
    delete(payload) {
      return new Promise((resolve, reject) => {
        let response = { byId: {} };
        resolve(response);
      });
    }
  };
}
