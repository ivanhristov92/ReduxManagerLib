export default function createMocks(restApiRejects = false) {
  return {
    mockActionTypes: {
      CREATE: "CREATE",
      CREATE__SUCCESS: "CREATE__SUCCESS",
      CREATE__FAILURE: "CREATE__FAILURE",
      READ: "READ",
      READ__SUCCESS: "READ__SUCCESS",
      READ__FAILURE: "READ__FAILURE",
      UPDATE: "UPDATE",
      UPDATE__SUCCESS: "UPDATE__SUCCESS",
      UPDATE__FAILURE: "UPDATE__FAILURE",
      DELETE: "DELETE",
      DELETE__SUCCESS: "DELETE__SUCCESS",
      DELETE__FAILURE: "DELETE__FAILURE"
    },
    mockRestApi: {
      create() {
        return testPromise();
      },
      read() {
        return testPromise();
      },
      update() {
        return testPromise();
      },
      delete() {
        return testPromise();
      }
    }
  };

  function testPromise() {
    return new Promise((resolve, reject) => {
      restApiRejects ? reject({ test: false }) : resolve({ test: true });
    });
  }
}
