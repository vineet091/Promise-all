import "./styles.css";
var urls = [
  "https://api.github.com/users/iliakan",
  "https://remy.com",
  "https://api.github.com/users/jeresig"
];

// Each Promise handle error itself then promise all will return arry of all promises output
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

// Each Promise not handled error itself then Promise all will return failed promise result and stop exeuting further promises
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

// Each Promise handled error itself then Promise all will return array of promises result and we can filter out error by using filter Boolean.
Promise.all(
  urls.map((url) =>
    fetch(url)
      .then((r) => r.json())
      .catch((e) => "")
  )
).then((responses) => {
  console.log(responses.filter(Boolean));
});
