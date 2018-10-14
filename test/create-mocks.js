export default function createMocks(restApiRejects = false) {
  return {
    mockActionTypes: {
      CREATE: "SomeModel/CREATE",
      CREATE__SUCCESS: "SomeModel/CREATE__SUCCESS",
      CREATE__FAILURE: "SomeModel/CREATE__FAILURE",
      READ: "SomeModel/READ",
      READ__SUCCESS: "SomeModel/READ__SUCCESS",
      READ__FAILURE: "SomeModel/READ__FAILURE",
      UPDATE: "SomeModel/UPDATE",
      UPDATE__SUCCESS: "SomeModel/UPDATE__SUCCESS",
      UPDATE__FAILURE: "SomeModel/UPDATE__FAILURE",
      DELETE: "SomeModel/DELETE",
      DELETE__SUCCESS: "SomeModel/DELETE__SUCCESS",
      DELETE__FAILURE: "SomeModel/DELETE__FAILURE"
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
