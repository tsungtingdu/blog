---
slug: 2020-10-10-javascript-nan
title: NaN in JavaScript
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [JavaScript, ironman]
---

<!--truncate-->

如果先去查看 [ECMA 2020](https://www.ecma-international.org/ecma-262/#sec-terms-and-definitions-nan) 當中關於 NaN 的資料，會發現只有短短一行：

> Number value that is an IEEE 754-2019 “Not-a-Number” value

如果查看 [Wikipedia](https://en.wikipedia.org/wiki/NaN) 上關於 NaN 的介紹：

> In computing, NaN, standing for Not a Number, is a member of a numeric data type that can be interpreted as a value that is undefined or unrepresentable, especially in floating-point arithmetic. Systematic use of NaNs was introduced by the IEEE 754 floating-point standard in 1985, along with the representation of other non-finite quantities such as infinities.

會知道 NaN 誕生於 1985 年，關於浮點數相關的標準當中，也稱作 IEEE 754，目的是為了「解釋」那些無法定義或無法表現的浮點運算內容。這裡的重點是，NaN 本身是一個 "numeric data type"

而在 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 當中，定義了關於浮點運算在電腦當中所呈現的方式，除了二進位、十進位之外等數之外，也同時定義了無限 (包含正無限和負無限)，以及今天的主角 NaN。

看到這裡，可以知道其實 NaN 的概念與表現方式，其實是被定義在 IEEE 當中，也因此會在不同的程式語言當中被實作出來。

## What will generate NaN?

接下來會思考，什麼情況下會出現 NaN？如果根據上面剛剛看過的內容，會知道 NaN 會代表那些「無法定義或無法表現的浮點運算內容」。無法呈現的內容，有以下幾種情況

- `0 / 0` (基本上這在數學中是無意義的運算式)
- `Infinity or -Infinity / Infinity or -Infinity`
- `Infinity` 或 `-Infinity` 與 0 相乘
- `x % y`，而 x 是無限大，y 等於 0
- `Infinity`, `-Infinity ` 彼此（或自己）進行加減運算
- ...

等等，本身在數學當中不是無意義，就是概念上的操作，並無法在電腦當中以真實的數字呈現，也因此，IEEE 需要定義一個方式，來呈現上面操作的的值，這裡也就是 NaN 出現的原因。

所以這裡也可以發現，雖然表面上看到的都是 NaN，但實際上發生的原因很不一樣。

## Comparison with NaN

可以想像 NaN 只是代表這那些無法被表現出來的數，所以 NaN 本身不是一個有固定值的數，任何數和 NaN 比較都是沒有意義的，像是

```javascript
NaN > 1; // false
NaN < 1; // false
NaN == 1; // false
NaN === 1; // false
```

所以拿兩個 NaN 相比，也一定不會相等：

```javascript
NaN == NaN; // false
NaN === NaN; // false
```

會得到 true 的狀況是

```javascript
NaN != 1; //  true
NaN !== 1; //  true
NaN != NaN; //  true
NaN !== NaN; //  true
```

因為 NaN 根本就不等於任何數，也不會等於自己。

## NaN in JavaScript

剛剛提，NaN 是 numeric data type，在 JavaScript 當中可以用 typeof 檢查

```javascript
typeof NaN; // number
```

雖然 NaN 的 data type 是 number，但因為 NaN 不是一個有固定值的數，因此所有的運算都會失效：

```javascript
NaN + 1; // NaN
NaN - 1; // NaN
NaN * 1; // NaN
NaN / 1; // NaN
```

比較特別的是下面這三種運算，會得到非 NaN 的值：0

```javascript
NaN >> 1; // 0
NaN << 1; // 0
NaN ^ 0; // 0
```

如果把 NaN 做轉型的話，會得到

```javascript
Number(NaN); // NaN
String(NaN); // "NaN"
```

另外，在 JavaScript 當中有一個可以判斷是否為 NaN 的 function，叫做 isNaN，如下：

```javascript
isNaN(0); // false
isNaN(1); // false
isNaN(Infinity); // false
isNaN(NaN); // true
isNaN(); // true
isNaN([1, 2, 3]); // true
isNaN({ age: 18 }); // true
```

所以可以知道

- Infinity 本身還是個 number
- NaN 雖然是 numeric data type，但卻是 not a number

## NaN in array

如果 NaN 出現在一個 arr 當中，是無法用 indexOf 找到，但是可以用其他方式找到，像是下面這樣：

```javascript
let arr = [2, 4, NaN, 12];
arr.indexOf(NaN); // -1 (false)
arr.includes(NaN); // true
arr.findIndex((n) => Number.isNaN(n)); // 2
```

## End

看完這麼多東西，會發現 NaN 真的是個奇怪的東西，如果要小結的話，就會是

- 數學無法計算出來的東西，就會用 NaN 代表
- NaN 本身的型別是 number，但它沒有一個固定的數值，它是 not a number
- 沒辦法用 indexOf 找到 array 當中的 NaN

## Reference

- [ECMA 2020](https://www.ecma-international.org/ecma-262/#sec-terms-and-definitions-nan)
- [NaN (wiki)](https://en.wikipedia.org/wiki/NaN)
- [NaN (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)
- [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10251553)_
