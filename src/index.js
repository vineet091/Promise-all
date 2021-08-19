// import "./styles.css";
// var urls = [
//   "https://api.github.com/users/iliakan",
//   "https://remy.com",
//   "https://api.github.com/users/jeresig"
// ];

// // Each Promise handle error itself then promise all will return arry of all promises output
// Promise.all(
//   urls.map((url, index) => {
//     if (index % 2 !== 0) {
//       return new Promise((resolve, reject) => {
//         resolve(index);
//       });
//     } else {
//       return new Promise((resolve, reject) => {
//         reject("Failed to Fetch");
//       }).then(
//         (response) => {
//           return response;
//         },
//         (err) => {
//           return err;
//         }
//       );
//     }
//   })
// ).then((responses) => {
//   console.log(responses);
// });

// // Each Promise not handled error itself then Promise all will return failed promise result and stop exeuting further promises
// Promise.all(
//   urls.map((url, index) => {
//     if (index % 2 !== 0) {
//       return new Promise((resolve, reject) => {
//         resolve(index);
//       });
//     } else {
//       return new Promise((resolve, reject) => {
//         reject("Failed to Fetch");
//       });
//     }
//   })
// )
//   .then((responses) => {
//     console.log(responses);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // Each Promise handled error itself then Promise all will return array of promises result and we can filter out error by using filter Boolean.
// Promise.all(
//   urls.map((url) =>
//     fetch(url)
//       .then((r) => r.json())
//       .catch((e) => "")
//   )
// ).then((responses) => {
//   console.log(responses.filter(Boolean));
// });

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
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, task);
  });
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
            prom.job
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
        prom.job
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
  var resolve;
  var reject;
  function exec(val) {
    resolve(val);
  }

  function exec2(val) {
    reject(val);
  }
  this.then = function (callback) {
    resolve = callback;
    return this;
  };

  this.catch = function (callback) {
    reject = callback;
    return this;
  };

  func(exec, exec2);
}
new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(false);
  }, 1000);
})
  .then((response) => {
    console.log(response);
  })
  .catch((err) => console.log(err));