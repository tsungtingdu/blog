---
slug: 2020-09-26-javascript-async-await
title: Async/Await in JavaScript
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [JavaScript, ironman]
---

<!--truncate-->

## Async/Await is just syntactic sugar

在上一篇文章當中有提到

> ## _async/await 這個語法糖，背後的運作就是透過 generator 和 promise 共同建立起來的_

所以今天就來看看 async/await 是如何運作的吧！

## Without async/await

在原本的 Promise 當中，我們可以用 `then` 的方式，來確保前面的動作完成，並把資訊往後傳遞。

譬如今天我們要用透過 axios 從 randomuser 拿到一筆 female user 資料，並進行處理

```javascript
let users = [];
let getUser = axios
  .get("https://randomuser.me/api/?gender=female")
  .then((res) => {
    users.push(res.data.results[0]);
    // .. do something
  });
```

如果突然想到要多抓一位 male 的資料，可以繼續用 `then` 把大家 (Promise) 串在一起，確保依序完成並且傳遞資料，像是

```javascript
let users = [];
let getUser = axios
  .get("https://randomuser.me/api/?gender=female")
  .then((res) => {
    users.push(res.data.results[0]);
    return axios.get("https://randomuser.me/api/?gender=male");
  })
  .then((res) => {
    users.push(res.data.results[0]);
    // .. do something with users
  });
```

但是，如果有更多的 Promise 工作需要被完成，這樣不就 `then` 接到天荒地老。那我可以分開取值嗎？像是：

```javascript
let user1 = axios
  .get("https://randomuser.me/api/?gender=female")
  .then((res) => {
    return res.data.results[0];
  });
let user2 = axios.get("https://randomuser.me/api/?gender=male").then((res) => {
  return res.data.results[0];
});

// .. do something with user1 & user2
```

實際上不行，這樣 user1 和 user2 拿到的其實是 Promise 物件，而不是我們預期的 user data。這樣看起來只能繼續在 `then` 裡面處理資料了。

這時候有人想到，不如我們把所有 task 放進一個 array，然後建立一個 function ，讓它負責用 `then` 把 array 裡面需要處理的 task 串起來，應該會方便許多喔！

首先，建立 array of tasks

```javascript
let element = "https://randomuser.me/api/";
let tasks = [
  (element) => {
    return axios.get(element + "?seed=abc").then((res) => {
      return res.data.results[0].name.first;
    });
  },
  (element) => {
    return axios.get(element + "?seed=edf").then((res) => {
      return res.data.results[0].name.first;
    });
  },
  (element) => {
    return axios.get(element + "?seed=ghi").then((res) => {
      return res.data.results[0].name.first;
    });
  },
];
```

然後，建立一個 function，可以遍歷 array 當中的所有 task，並依序用 `then` 把所有 task 串再一起，並不斷地將資料傳遞下去

```javascript
function chainPromise(element, tasks) {
  var returnValue = "";
  var p = tasks[0](element);
  for (let i = 1; i < tasks.length; i++) {
    p = p.then(function (value) {
      returnValue += " " + value;
      return tasks[i](element);
    });
  }

  return p
    .catch(function (e) {
      console.log(e);
    })
    .then(function (value) {
      returnValue += " " + value;
      return returnValue;
    });
}
```

這樣就可以避免寫 `then` 寫到天荒地老的狀況。但是這樣看起來還是有點麻煩，於是，async/await 就這樣誕生了。

## With async/await

要能夠滿足任務，就需要確保幾件事情

- 能夠遍歷（迭代）所有 tasks
- 確認上一個 task 完成後，才能繼續執行下一個 task
- 能夠往下傳遞資訊

這時候我們就想到了 generator 和 promise!

Generator 可以一步步的迭代所有需要處理的 task，並能夠進行進程控制，像是傳入參數。Promise 則可以確保非同步的任務完成。

所以兩個加起來，其實就可以完成上面提到的三個目標！

所以一步一步來的話，首先是建立 generator

```javascript
function* gen() {
  const result1 = yield task1();
  const result2 = yield task2(result1);
  const result3 = yield task3(result2);

  return result3;
}
```

這裡有三個 task 分別為 task1, task2, task3。當每次呼叫執行下一個 task 的時候，會把上一個 task 的結果傳進去。

接著，我們需要一個 runner (generator runner) 來操作這個 generator，也就是透過它來管理 generator 的進程，像是下面這樣：

```javascript
function runner(gen) {
  const it = gen();

  function run(arg) {
    const result = it.next(arg);
    if (result.done) {
      return result.value;
    } else {
      return Promise.reslove(result.value).then(run);
    }
  }
  return run();
}
```

把 generator (gen) 傳入之後，先呼叫 `next` 並傳入參數（如果有的話），這時 `run` function 內會接收回傳值 result，如果 result.done 為 true，就會結束並回傳 result.value；如果 result.done 為 false，那麼就會繼續執行 `run` function。

原理就先暫時講到這裡。讓我們來直接看一下 async/await 實際的程式碼為何。

## Example

這裡有個使用 async/await 所建立的 function

```javascript
async function foo() {
  let result1 = await bar1();
  let result2 = await bar2();
  return "ALL DONE";
}
```

如果轉成 ES5 之前的寫法，就會是

```javascript
// ES5
let foo = (() => {
  var ref = _asyncToGenerator(function* () {
    let result1 = yield bar1();
    let result2 = yield bar2();
    return "ALL DONE";
  });

  return function foo() {
    return ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function (value) {
              return step("next", value);
            },
            function (err) {
              return step("throw", err);
            }
          );
        }
      }
      return step("next");
    });
  };
}
```

這裡的 runner function 就是 **\_asyncToGenerator**，而 `run` function 就是 step(key, arg) ，跟前面比較不一樣的是，`run` function 被包在一個 Promise 裡面。

1. 首先，把 generator 丟進 runner function **\_asyncToGenerator()** 當中
2. 在進入 Promise 之前，用 apply 讓 generator 未來可以取用新的參數
3. 進入 Promise 之後，雖然一開始就看到一個 function，但是其實是在 line 39 的 `return step("next")` 這邊被呼叫，並帶入叫 “next” 的 key
4. 進入 run function step(key, arg) 當中，這裡用了 try catch 確保可以取到 generation 當中 yield 傳過來的值。此時 key 是 “next”，arg 是 undefined，也就是不會傳值回去給 yield。 `var info = gen[key](arg)` 其實就是我們之前看到的 it.next(arg) 。而取出的 value，就是從 yield 傳入的 bar1()
5. 由於這時 info.done 是 false，因此會直接到下面的 else 裡面的 Promose 當中，如果 value 、也就是 bar1() 順利完成，就會 `return step("next", value)`
6. 所以再次回到 step(key, arg)，這時 key 是 next，而 arg 就是完成 bar1() 後的回傳值，此時這個 value 會透過 yield 回傳到 generator 裡面的 result1 之中。所以 result1 就順利拿到執行完 bar1() 的值了！
7. 然後，就會這樣繼續往下跑，把所有 await 後面、也就是後來變成 generator 的 yield 後面的 function 按步就班執行完畢，直到沒有 yield 的時候，就會回傳 `{done: true}` ，也就是說，會執行 `if (info.done) { resolve(value)}` 這段程式碼，離開 Promise。此時的 value，就是最後傳過來的 "ALL DONE"。

## Reference

- [Async Functions](https://tc39.es/ecmascript-asyncawait/#intro)
- [Async-Await ≈ Generators + Promises](https://hackernoon.com/async-await-generators-promises-51f1a6ceede2)
- [Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
- [Any difference between await Promise.all() and multiple await?](https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-await)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10244352)_
