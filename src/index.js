// import "./styles.css";
var urls = [
  "https://api.github.com/users/iliakan",
  "https://remy.com",
  "https://api.github.com/users/jeresig"
];

// // Each Promise handle error itself then promise all will return arry of all promises output
Promise.all(
  urls.map((url, index) => {
    if (index % 2 !== 0) {
      return new Promise((resolve, reject) => {
        resolve(index);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject("Failed to Fetch");
      }).then(
        (response) => {
          return response;
        },
        (err) => {
          return err;
        }
      );
    }
  })
).then((responses) => {
  console.log(responses);
});

// Each Promise not handled error itself then Promise
// all will return failed promise result and
// stop exeuting further promises
Promise.all(
  urls.map((url, index) => {
    if (index % 2 !== 0) {
      return new Promise((resolve, reject) => {
        resolve(index);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject("Failed to Fetch");
      });
    }
  })
)
  .then((responses) => {
    console.log(responses);
  })
  .catch((err) => {
    console.log(err);
  });

// Each Promise handled error itself then Promise all will return
// array of promises result and we can filter
// out error by using filter Boolean.
Promise.all(
  urls.map((url) =>
    fetch(url)
      .then((r) => r.json())
      .catch((e) => "")
  )
).then((responses) => {
  console.log("Response with error filterred", responses.filter(Boolean));
});

// Call array of promise synchronously

// function getPromise({ status, ans }) {
//   return new Promise((resolve, reject) => {
//     if (status) {
//       resolve(ans);
//     } else {
//       reject("Failed to fetch");
//     }
//   });
// }

// const promises = [
//   { status: true, ans: 1 },
//   { status: false, ans: 2 },
//   { status: true, ans: 3 }
// ];

// async function executePromises() {
//   var k = 0;
//   var results = [];
//   while (k < promises.length) {
//     var res = await getPromise(promises[k])
//       .then((res) => res)
//       .catch((err) => err);
//     console.log(res);
//     results.push(res);
//     k++;
//   }
//   console.log(results);
//   return results;
// }
// executePromises();

function getPromise(task) {
  return () => {
    new Promise((resolve, reject) => {
      setTimeout(resolve, 100, task);
    });
  };
}

// Promise.myAll = function (promises) {
//   return new Promise((resolve, reject) => {
//     var count = promises.length;
//     var results = [];
//     var check = function () {
//       --count;
//       if (count === 0) {
//         resolve(results);
//       }
//     };
//     promises.map((promise, i) => {
//       promise
//         .then((result) => {
//           results[i] = result;
//         }, reject)
//         .then(check);
//     });
//   });
// };
// Promise.myAll(promises).then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log(err.message);
//   }
// );

var promises = [
  { name: "D", job: getPromise("D"), dependent: ["A", "B"] },
  { name: "E", job: getPromise("E"), dependent: ["C", "D"] },
  { name: "A", job: getPromise("A"), dependent: [] },
  { name: "B", job: getPromise("B"), dependent: [] },
  { name: "C", job: getPromise("C"), dependent: [] }
];

async function executePromises(promises) {
  var promise = new Promise((resolve, reject) => {
    var count = promises.length;
    var executedList = {};
    var results = [];
    var check = function () {
      --count;
      promises.map((prom) => {
        if (!executedList[prom.name] && prom.dependent.length) {
          var isExecute = true;
          prom.dependent.map((dep) => {
            if (results.indexOf(dep) === -1) {
              isExecute = false;
            }
          });
          if (isExecute) {
            executedList[prom.name] = true;
            prom
              .job()
              .then((res) => {
                results.push(res);
              })
              .then(check);
          }
        }
      });
      if (count === 0) {
        resolve(results);
      }
    };
    promises.map((prom) => {
      if (!prom.dependent.length) {
        executedList[prom.name] = true;
        prom
          .job()
          .then((res) => {
            results.push(res);
          })
          .then(check);
      }
    });
  });
  var res = await promise.then((res) => {
    return res;
  });
  console.log(res);
}

executePromises(promises);

//Promise Pollyfill
function myPromise(func) {
  var callbackList = [];
  this.promiseStatus = "pending";

  var executeCallback = (acc = "", isError = false) => {
    callbackList.map((event) => {
      if (
        (!isError && (event.type === "then" || event.type === "finally")) ||
        (isError && event.type === "catch")
      ) {
        try {
          if (event.type === "finally") {
            event.callback(acc);
          } else {
            acc = event.callback(acc);
            if (event.type === "catch" && isError) {
              isError = false;
            }
          }
        } catch (err) {
          isError = true;
        }
      }
    });
  };
  const resolve = (val) => {
    this.promiseStatus = "fullfilled";
    if (callbackList.length) {
      executeCallback(val);
    }
  };
  const reject = (val) => {
    this.promiseStatus = "rejected";
    if (callbackList.length) {
      executeCallback(val, true);
    }
  };

  this.__proto__.then = (callback) => {
    callbackList.push({
      type: "then",
      callback,
    });
    return this;
  };

  this.__proto__.catch = (callback) => {
    callbackList.push({
      type: "catch",
      callback,
    });
    return this;
  };
  this.__proto__.finally = (callback) => {
    callbackList.push({
      type: "finally",
      callback,
    });
    return this;
  };

  try {
    func(resolve, reject);
  } catch (err) {
    reject(err);
  }
  return this;
}

var p1 = new myPromise((resolve, reject) =>
  setTimeout(() => resolve(1000), 1000)
);
console.log(p1);

p1.then((val) => {
  console.log("test", val);
  throw "error";
})
  .then((val) => {
    console.log("2nd", val);
  })
  .catch((err) => {
    console.log("catch", err);
    return 3000;
  })
  .then((val) => {
    console.log("3rd", val);
  });

new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(false);
  }, 1000);
})
  .then((response) => {
    console.log(response);
  })
  .catch((err) => console.log(err));

function myPromiseAll(promises) {
  return new myPromise((res, rej) => {
    var count = promises.length;
    var result = [];
    promises.map((promise1) => {
      promise1
        .then((payload, i) => {
          result.push(payload);
          count--;
          if (count === 0) {
            res(result);
          }
        })
        .catch((err) => {
          rej(err);
        });
    });
  });
}

myPromiseAll([
  new myPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  }),
  new myPromise((resolve, reject) => {
    setTimeout(() => {
      reject(false);
    }, 1000);
  })
])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

/* 


A --|
    |-- D --|
B --|       |-- E
    |       |
C --|-------|

Each node is a async job, illustrated by setTimeout.
A, B, and C can run at the same time.
D, needs to wait for A and B to be done.
E needs to wait for C and D to be done.
Implement an interface, let's call it runTasks to take care of this for us.


*/

var inputArr = [
  {
    name: "A",
    dependencies: [],
    prom: getPromise1("A")
  },
  {
    name: "B",
    dependencies: [],
    prom: getPromise1("B")
  },
  {
    name: "C",
    dependencies: [],
    prom: getPromise1("C")
  },
  {
    name: "D",
    dependencies: ["A", "B"],
    prom: getPromise1("D")
  },
  {
    name: "E",
    dependencies: ["C", "D"],
    prom: getPromise1("E")
  }
];

function getPromise1(task) {
  return () => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(task);
      }, 1000);
    });
  };
}

function runTasks(promises) {
  return new Promise((resolve, reject) => {
    var result = [];
    var count = promises.length;
    var executedTasks = [];
    const executeTasks = (prom2) => {
      // console.log(`${promise.name} starts here`);
      prom2
        .prom()
        .then((response) => {
          // console.log(`${response.name} ends here`);
          result.push(response);
        })
        .catch((err) => {
          reject(`Task ${err.name} is failed to execute`);
        })
        .then(() => {
          checkTasks();
        });
    };
    const checkTasks = () => {
      --count;
      console.log(count, result);
      if (count === 0) {
        resolve(result);
      } else {
        promises.map((promise) => {
          if (
            promise.dependencies &&
            executedTasks.indexOf(promise.name) === -1
          ) {
            var canExecute = true;
            promise.dependencies.map((dep) => {
              if (result.indexOf(dep) === -1) {
                canExecute = false;
              }
            });
            if (canExecute) {
              executedTasks.push(promise.name);
              executeTasks(promise);
            }
          }
        });
      }
    };

    promises.map((prom1) => {
      if (!prom1.dependencies.length) {
        console.log(prom1);
        executedTasks.push(prom1.name);
        executeTasks(prom1);
      }
    });
  });
}

runTasks(inputArr)
  .then((result) => {
    console.log("task result", result);
  })
  .catch((err) => {
    console.log("task err", err);
  });
