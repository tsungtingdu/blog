---
slug: 2020-09-23-javascript-this
title: "'this' in JavaScript"
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [JavaScript, ironman]
---

<!--truncate-->

在物件導向的程式語言當中常常回看到 this 的出現，通常這個 this 會指向物件本身，譬如

```javascript
const obj = {
  value: 18,
  print: function () {
    console.log(this.value);
  },
};

obj.print(); // 18
```

但是，好像不是每次使用 this 的時候都能如願以償，如果把上面的 print function 改成 arrow function，就沒辦法得到一樣的值

```javascript
const obj = {
  value: 18,
  print: () => {
    console.log(this.value);
  },
};

obj.print(); // undefined
```

所以想趁這個機會，再次釐清一下在 JavaScript 當中關於 this 的用法。不過關於 this 的用法，網路上已經有許多的討論，特別是 Huli 的 [淺談 JavaScript 頭號難題 this：絕對不完整，但保證好懂](https://blog.huli.tw/2019/02/23/javascript-what-is-this/)，內容相當的豐富。所以今天我想反過來，直接從規則和案例出發，幫助自己在實作的時候更能夠上手。

當然，還是建議大家有機會能閱讀相關文章當中的深入討論。

## Rules

1. this 指向的值，跟作用域或在程式碼的哪個位置沒有關係，只跟如何被呼叫有關
2. 如果找不到被呼叫的對象，那麼 this 就會是
   - 在嚴格模式下，this 為 undefined
   - 在非嚴格模式下，在瀏覽器當中，會是 window
   - 在非嚴格模式下，在 Node.js 當中，會是 global

- 但是如果遇到 arrow function，則 this 會和「在哪裡被宣告」有關

## Cases

以下的例子都是在瀏覽器中執行：

### Case 1.

```javascript
const obj = {
  value: 18,
  print: function () {
    console.log(this);
  },
};

let fn = obj.print;
console.log(fn); // [Function: printer]

obj.print(); // { value: 18, print: [Function: printer] }
fn(); // window
```

在這裡我們建立了一個變數 `fn` 來指向`obj.print` 這個 function，看起來 `fn` 跟 `obj.print` 是一模一樣的 function，然而印出來的東西卻完全不一樣。

那是因為在執行 `obj.print()` 的時候，`print` function 知道他是被 `obj` 呼叫，因此當中的 this 會指向 `obj`。要怎麼知道誰呼叫誰呢？看那個 `.` 就對了！所以 `obj.print()` 的意思就是 `obj` 呼叫 `print` function 並執行

而當我們在執行 `fn()` 的時候，因為沒有那個 `.`，所以找不到可以指向的對象，在找不到的情況下，就會直接指向 `window`!

---

### Case 2.

```javascript
const obj = {
  value: 18,
  tool: {
    value: 81,
    print: function () {
      console.log(this.value);
    },
  },
};

let a = obj.tool;
let b = obj.tool.print;

obj.tool.print(); // 81
a.print(); // 81
b(); // undefined
```

根據同樣的邏輯，往前找是誰呼叫了這個 function，所以在 `obj.tool.print()` 這個例子，是 `tool` 呼叫了 `print`，所以值是 81。

`a.print()` 這個例子是 `a` 呼叫了 `print`，而 `a` 本身就是 `tool`，所以結果一樣是 81。

最後，雖然 `b` 本身就是 `print`，但是因為找不到呼叫的對象，所以 `this` 會指向 `window`，而因為 `window` 當中找不到 `value` 這個值，所以得到的結果是 undefined。

---

### Case 3.

```javascript
const obj = {
  value: 18,
  print: function () {
    function c() {
      console.log(this);
    }
    c();
  },
};

obj.print(); // window
```

在這個 case 當中，`print` function 裡面包含了另外一個 `c` function，而且這個 `c` 會直接執行。雖然看起來是因為 `print` 執行之後 `c` 跟著執行，所以好像是 `print` 呼叫了他。但回到剛剛的規則上，`c` 其實找不到是誰呼叫他的（前面沒有 `.`），所以在 `c` 當中的 `this` 就是 window。

如果今天要讓 `c` function 當中的 `this` 指向 `obj`，可以怎麼做呢？

#### **解法 1: 先把 this 存下來**

```javascript
const obj = {
  value: 18,
  print: function () {
    let self = this;
    function c() {
      console.log(self);
    }
    c();
  },
};
obj.print(); // {value: 18, print: [Function]}
```

#### **解法 2: 變成 IIFE，直接把 this 給傳進去**

```javascript
const obj = {
  value: 18,
  print: function () {
    (function c(self) {
      console.log(self);
    })(this);
  },
};
obj.print(); // {value: 18, print: [Function]}
```

#### **解法 3: 使用 arrow function**

```javascript
const obj = {
  value: 18,
  print: function () {
    const c = () => console.log(this);
    c();
  },
};

obj.print(); // {value: 18, print: [Function]}
```

arrow function 的出現使得規則好像變得不太一樣了？沒錯，Arrow function 當中的 this，會跟「**它被宣告的地方**」有關，而不是跟「它被呼叫的對象」有關。所以因為這裡我們是在 `obj` 裡面宣告 `c`，所以 `c` 當中的 `this` 就會指向 `obj`。

#### **解法 4: 使用 call, apply, bind**

```javascript
// call
const obj = {
  value: 18,
  print: function () {
    function c() {
      console.log(this);
    }
    c.call(this);
  },
};

obj.print(); // {value: 18, print: [Function]}
```

```javascript
// apply
const obj = {
  value: 18,
  print: function () {
    function c() {
      console.log(this);
    }
    c.apply(this);
  },
};

obj.print(); // {value: 18, print: [Function]}
```

```javascript
// bind
const obj = {
  value: 18,
  print: function () {
    function c() {
      console.log(this);
    }
    const d = c.bind(this);
    d();
  },
};

obj.print(); // {value: 18, print: [Function]}
```

使用 JavaScript 當中的 `call`, `apply`, `bind` 方法，綁定 function 當中的 `this`。三者的差異在於：

- `call`: 綁定 `this` 並可以傳入引數
- `apply`: 跟 `call` 一樣，只是用陣列的方式傳入引數
- `bind`: 永久綁定 `this`。使用的時候會產生新的 function，因此需要傳出來使用。或者當下直接執行。以剛剛的例子來說，就是

```javascript
// 傳出來使用
const d = c.bind(this);
d(); // {value: 18, print: [Function]}

// 直接執行
c.bind(this)(); // {value: 18, print: [Function]}
```

## Reference

- [淺談 JavaScript 頭號難題 this：絕對不完整，但保證好懂](https://blog.huli.tw/2019/02/23/javascript-what-is-this/)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10242419)_
