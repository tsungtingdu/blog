---
slug: 2020-10-09-javascript-comparison
title: Abstract Equality Comparison in JavaScript
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [JavaScript, ironman]
---

<!--truncate-->

今天要來談談關於 JavaScript abstract equality comparison 的事情。我們都知道在 JavaScript 當中，在做比較的時候，有 `==` 和 `===` 之分，分別代表 `abstract equality comparison` 和 `strict equality comparison`

`strict equality comparison` 會同時比較左右兩邊運算元的「型別」和「值」，如果只要有一個不同，那麼就會回傳 false。

譬如

```Javascript
1 === '1'      // false
```

但如果使用 `abstract equality comparison` 則就有不同的結果：

```Javascript
1 == '1'       // true
```

因為 JavaScript 會「很聰明」的幫我們轉型，把兩邊的運算元轉換成可以比較的型別與值。

不過，JavaScript 究竟是根據什麼規則進行轉換的呢？

## Abstract Equality comparision

其實規則都寫在 [ECMA 的規格文件](https://www.ecma-international.org/ecma-262/#sec-abstract-equality-comparison) 當中了：

![](https://i.imgur.com/T09OwqA.png)

今天，就讓我們一起好好看一下吧！

在進行 `x == y` 的比較時：

### Rule 1

如果 x 和 y 的 type 都一樣，那麼其實就跟操作 `strict equality comparision` 一樣，不需要進行強制轉型。譬如

```javascript
1 === 1; // true
"hello" === "world"; // false
```

### Rule 2

如果 x 為 null 而 y 為 undefined，回傳 true

```javascript
null == undefined; // true
```

### Rule 3

如果 x 為 undefined 而 y 為 null，回傳 true

```javascript
undefined == null; // true
```

### Rule 4

如果 x 是 number 而 y 是 string，那麼會將 y 轉成 number 然後再進行比較

```javascript
1 == "1"; // true
2 == "1"; // false
```

### Rule 5

如果 x 是 string 而 y 是 number，那麼會將 x 轉成 number 然後再進行比較

```javascript
"1" == 1; // true
"2" == 1; // false
```

### Rule 6

如果 x 是 BigInt 而 y 是 string，那麼會將 y 轉成 BigInt 然後再進行比較。如果轉換的過程中出現 NaN，則直接回傳 false

```javascript
1 == "1"; // true
2 == "1"; // false
```

### Rule 7

如果 x 是 string 而 y 是 BigInt，則回傳 y == x 的結果（參考上面的規定）

```javascript
"1" == 1; // true
"2" == 1; // false
```

### Rule 8

如果 x 是一個 boolean 值，那麼會將 x 轉回 number 後再進行比較

```javascript
true == 0; // false
true == 1; // true
true == 2; // false
```

如果這時候 y 是字串，那麼就會參考第四點來做比較

```javascript
true == "0"; // false
true == "1"; // true
true == "2"; // false
```

### Rule 9

如果 y 是一個 boolean 值，則回傳 y == x 的結果（參考上面的規定）

```javascript
0 == true; // false
1 == true; // true
2 == true; // false
"0" == true; // false
"1" == true; // true
"2" == true; // false
```

---

### Rule 10

如果 x 是 String, Number, BigInt, 或是 Symbol，而 y 是個 Object，那麼會需要先把 y 轉換成 Primative (`ToPrimitive(y)`) 之後再進行比較。

但是，`ToPrimitive(y)` 會變成什麼東西呢？

![](https://i.imgur.com/mGQwznQ.png)

如果有特別設定 `hint`，那麼就會使用該 `hint`，譬如是`number` 或 `string`。如果沒有設定 `hint`，就會使用 `default`。

知道 `hint` 是什麼之後，接下來，就會開始進行轉換。在實作上，會使用 `@@toPrimitive` API 接口的方式，像下面這樣：

```javascript
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint == "number") {
      return 10;
    }
    if (hint == "string") {
      return "hello";
    }
    return true;
  },
};
```

根據 ECMA 文件說明，會先看看即將要轉換的 object，是否有轉換的 `hint`，也就是告訴大家該 object 該如何轉型。

如果根據 `hint` 而得到的轉換結果「不是 `undefined`」，本身不是 object，那麼就直接回傳結果。如果轉換結果還是 object，那麼就會丟出 TypeError。

而 `hint` 實際上來自於 "需要轉換環境"，譬如以剛剛的 `obj` 來說

```javascript
console.log(+obj); // 10        -- hint is "number"
console.log(`${obj}`); // "hello"   -- hint is "string"
console.log(obj + ""); // "true"    -- hint is "default"
Number(obj); // 10        -- hint is "number"
String(obj); // "hello"   -- hint is "string"
```

如果根據 `hint` 而得到的轉換結果「是 `undefined`」，那麼這時候就需要額外做以下的處理。

![](https://i.imgur.com/m2vhJIO.png)

首先，如果原本的 `hint` 是 `default`，那麼這時候就會被強制轉成 `number`。如果 `hint` 是

- `string`，那麼就會去找這個 object 裡面是否有 `toString()` 或是 `valueOf` 的方法，之後依序提取。
- `number`，那麼就會去找這個 object 裡面是否有 `valueOf` 或是 `toString()` 的方法，之後依序提取。

兩種狀況看起來很像，差別在於不同方法的提取順序。之後，就會「依照順序」呼叫方法，如果得到的結果不是 object，就會回傳結果；若還是 object，則會丟出 TypeError。

舉例來說，這裡我們使用原生的陣列 (沒有使用者定義的 `@@toPrimitive`)：

```javascript
let arr = [1];
console.log(+arr); // 1        -- hint is "number"
console.log(`${arr}`); // "1"      -- hint is "string"
Number(arr); // 1        -- hint is "number"
String(arr); // "1"      -- hint is "string"
```

比較特別的是

```javascript
console.log(arr + ""); // "1"      -- hint is "default"
```

因為 `hint` 為 `default`，所以會被自動轉為 `number`，接著，就會依序呼叫 `valueOf` 和 `toString` 方法。結果分別為

```javascript=
[1]
  .valueOf() // [1]   object
  [1].toString(); //  "1"  string
```

因此最後會回傳 `string` 的結果。

如果改成 `let arr = [1, 2]` 的話，最後就無法順利轉成 Primitive 囉！

---

### Rule 11

如果 x 是 object 而 y 是 String, Number, BigInt, 或是 Symbol，那麼就會直接回傳 y == x 的結果（參考上面的規則）

### Rule 12

如果 x 和 y 其中一個為 BigInt 另外一個為 numebr，只要其中有一個是 `NaN`, 無限大或無限小，直接回傳 false。如果沒有，則會比較實際上的數值大小，然後回傳結果

### Rule 13

如果沒有符合上述的任何一個規則，直接回傳 false。譬如我們在規則 10 的時候，轉換過程中出現 TypeError (例外狀況)，那麼就會在這裡直接回傳 false。譬如

---

## Reference

- [ECMA](https://www.ecma-international.org/ecma-262/#sec-abstract-equality-comparison)
- [你懂 JavaScript 嗎？#8 強制轉型（Coercion）](https://cythilya.github.io/2018/10/15/coercion/#%E6%8A%BD%E8%B1%A1%E7%9A%84%E9%97%9C%E4%BF%82%E5%BC%8F%E6%AF%94%E8%BC%83)
- [Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10251167)_
