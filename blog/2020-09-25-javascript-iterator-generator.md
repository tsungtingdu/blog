---
slug: 2020-09-25-javascript-iterator-generator
title: Iterator & Generator in JavaScript
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [JavaScript, ironman]
---

<!--truncate-->

## Iterator

Iterator 中文稱做迭代器，顧名思義，就是拿來迭代某些東西的工具。迭代這件事情在過去其實很常出現，譬如使用 for loop 或 forEach 來遍歷整個陣列，就是一種迭代的過程。

在 ES6 當中，提供了一個方式讓 JavaScript 當中所有物件都變成是可以迭代的。不過要達到可以迭代的情況，需要遵守下面兩個 protocols:

### 1. Iterable protocol

要成為一個可以迭代的物件，必須實作 `@@iterator` 方法，也就是在物件當中需要有一個 key 為 `@@iterator` 的屬性。而 `@@iterator` 可以透過操作 `[Symbol.iterator]` 來取得。舉例來說：

```javascript=
const obj = {
  [Symbol.iterator]: function () {
    // return something
  },
};
```

而這個 `[Symbol.iterator]` 本身會滿足下面會提到的 Iterator protocol。

### 2. Iterator protocol

這個 protocol 當中則定義了產生一系列迭代所產生的值的規格。當一個 iterator 呼叫 `next` 方法之後，會得到至少以下兩個屬性與值：

- done - 若值為 false，代表後續還有值可以迭代；若為 true，代表迭代結束。
- value - 經迭代而獲得的值

講到這裡，不如直接來看個例子吧。

### Example

```javascript
const obj = [1, 2, 3, 4, 5];
let iterator = obj[Symbol.iterator]();

iterator.next(); // { value: 1, done: false }
iterator.next(); // { value: 2, done: false }
iterator.next(); // { value: 3, done: false }
iterator.next(); // { value: 4, done: false }
iterator.next(); // { value: 5, done: false }

iterator.next(); // { value: undefined, done: true }
```

這段程式碼的意思是，一開始先建立一個 obj 物件（其實是個陣列，不過 JavaScript 當中所有東西都是物件）

接著實作 `@@iterator`，方式是執行「透過 `Symbol.iterator` 所回傳的 function」而得到 iterator。這裡其實也會發現，JavaScript 其實早就先把這個 "API" 放到所有物件當中了。

最後，只要我們透過 iterator 呼叫 `next` function，就可以迭代這個物件當中的值。當沒有東西可以迭代的時候， done 的值就變為 true。

舉另外一個例子：

```javascript
let str = "td";
let iterator = str[Symbol.iterator]();

iterator.next(); // { value: 't', done: false }
iterator.next(); // { value: 'd', done: false }
iterator.next(); // { value: undefined, done: true }
```

看到這裡可能會想，其實本來陣列和字串就可以迭代了，為什麼要這麼麻煩呢？

的確在 JavaScript 當中有些東西本身不需要特別做什麼事情，就可以迭代了。除了陣列和字串之外，還有

- Map
- Set
- function 當中的 arguments (很像 array 但不是 array 的東西)
- DOM 當中的 NodeList

都可以直接透過 `for...of` 來迭代。不過 `for...of` 本身，其實就是透過上面的方法，呼叫出 iterator 來一步步迭代上面這些物件。

## Build our own iterator

其實一般的物件並沒有定義迭代的順序，因此若開發者要讓自己的物件變成可迭代，就需要自行定義迭代的順序，以及所產生的值。

舉例來說：

```javascript
const fb = {
  [Symbol.iterator]() {
    let a = 0,
      b = 1;
    return {
      next() {
        let val = { value: b, done: false };
        b += a;
        a = val.value;
        return val;
      },
    };
  },
};
```

這裡我們在物件當中，建立了一個 key 為 `[Symbol.iterator]` 的 function，並會回傳一個 `next` function 提供 iterator 呼叫。這裡我們並沒有建立從外部取得數值或儲存數值的方法，而是直接定義了每次迭代所會產生的值。

執行結果如下：

```javascript
let iterator = fb[Symbol.iterator]();
iterator.next(); // { value: 1, done: false }
iterator.next(); // { value: 1, done: false }
iterator.next(); // { value: 2, done: false }
iterator.next(); // { value: 3, done: false }
iterator.next(); // { value: 5, done: false }
iterator.next(); // { value: 8, done: false }
```

其實這就是一個 Fibonacci 數列產生器。

但講到這裡，可能還是不知道為什麼要談 iterator。其實說了這麼多，都是為了介紹下面的 generator 出場

## Generator

generator 實際上就是建構在 iterator 之上，同樣可以透過呼叫 `next` function 來執行或迭代下一步。它長得和一般的 function 很像，只是多了個星號 (\*)。

另外，generator 是透過 yield 而不是 return 來回傳數值。譬如

```javascript
function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}
```

透過 `next` 不斷呼叫下一步，直到沒有回傳值的時候，回傳 `{done: true}` ，像是下面這樣：

```javascript
const iterator = numbers();
iterator.next(); // {value: 1, done: false}
iterator.next(); // {value: 2, done: false}
iterator.next(); // {value: 3, done: false}
iterator.next(); // {value: undefined, done: true}
```

更特別是的是，呼叫方可以跟 generator 進行溝通。譬如這裡有另外一個 generator

```javascript
function* generator() {
  let name = yield "what is your name?";
  let age = yield "how old are your?";
  return `${name} is ${age} years old.`;
}
```

接著，我們可以在每次執行的過程中傳入資訊，像是：

```javascript
const iterator = generator();

iterator.next(); // { value: 'what is your name?', done: false }
iterator.next("td"); // { value: 'how old are you?', done: false }
iterator.next("18"); // { value: 'td is 18 years old.', done: true }
iterator.next(); // { value: undefined, done: true }
```

第一次呼叫的時候，會得到第一行 yield 傳出來的 “what is your name?”。

第二次呼叫的時候，我們在 next() 裡面傳入 ‘td’，所以第一行的 yield 收到之後會存入變數 name 當中，並往下執行，傳出 “how old are you?”。

在第三次呼叫的時候傳入 ‘18’，yield 收到之後存入變數 age 當中，然後往下執行。

generator 當中的最後一行是 return，所以直接執行並結束。

## What can we do with generator?

在這篇文章中，我們先看到了 iterator 的特性，接著也看到了建立在 iterator 之上的 generator。雖然在剛剛的過程中，我們自己不斷呼叫 `next` 來達到迭代效果，但其實我們也可以建立一個 function，來代替我們操作 iterator。這樣的 function 有時叫做 `runner`。

另一方面，在使用 generator 的過程中，會發現我們可以自己一步步控制「迭代的過程」，甚至是「傳入參數進而參與迭代的過程」，這些都是無法透過過去常用的迭代方法來完成。

那麼，在什麼情況下會用到 generator 呢？

其中一個就是大家熟悉的 async/await 語法。async/await 本身是個語法糖，背後的運作就是透過 generator 和 promise 所建立起來的。

另一個就是在 Redux-saga 當中，會看到 generator 的出現。

## Reference

- [Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10243640)_
