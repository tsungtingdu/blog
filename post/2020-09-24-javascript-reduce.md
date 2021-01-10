---
slug: 2020-09-24-javascript-reduce
title: Reduce in JavaScript
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [JavaScript, ironman]
---

<!--truncate-->

Map, Filter, Reduce 是 JavaScript array 當中三種常用的方法。Map 的目的是遍歷所有 item，經過處理之後，回傳同樣長度的陣列；filter 同樣是遍歷所有 item，但是回傳符合條件的 items。

不過 Reduce 的功能就更為強大了，不僅僅有累加的功能，更可以實現 map 和 filter 的功能，可以說應用場景非常的廣。

所以，今天就來特別介紹一下 reduce 方法。

## Syntax

reduce 的基本結構如下：

```javascript
array.reduce((acc, cur, index, array) => {
  // do something
  return acc;
}, initialValue);
```

除了一般 array method 當中 callback function 會接收的

- cur (current value)
- index
- array (array 自己本身)

之外，還多了一個 acc (accumulator)，中文是累加器的意思。這個累加器會接收上一次迭代後的回傳值，所以通常 callback function 裡面會 return acc，作為下一次迭代的 arr 值。

這個 acc 可以是 number, string, array 甚至是 object，因此操作的彈性非常大！

等等，那第一次迭代當中， acc 會是什麼？

第一次迭代當中，沒有機會接收到上一次迭代的回傳值，因此這時候的 acc 會有兩種情況：

**1. 有設定 initialValue**

在有設定 initialValue 的情況下，acc 就會是這個 initialValue，同時，reduce() 就會從 array[0] 開始迭代。

```javascript
let array = [0, 1, 2, 3, 4];
array.reduce((acc, cur, index, array) => {
  acc += cur;
  return acc;
}, 99);
```

在第一次迭代當中，acc, cur, index 分別為 99, 0, 0，在 callback function 當中執行 acc + cur 並回傳 acc，因此，在第二次的迭代當中 acc, cur, index 分別為 99, 1, 1，以此類推

**2. 沒有設定 initialValue**

如果沒有設定 initialValue 的話，acc 預設為 array 的第一個值，同時，reduce 就會從 array[1] 開始迭代。以下面這個例子來說

```javascript
let array = [0, 1, 2, 3, 4];
array.reduce((acc, cur, index, array) => {
  acc += cur;
  return acc;
});
```

在第一次迭代當中，acc, cur, index 分別為 0, 1, 1，然後回傳結果 1 ；在第二次的迭代當中 acc, cur, index 則為 1, 2, 2，以此類推。

## 基本累加功能

一開始設定累加器 acc 為 0，接著，在每一次的迭代當中，把 cur (curren value) 加入到 acc 當中：

```javascript
let array = [0, 1, 2, 3, 4];
array.reduce((acc, cur) => {
  acc += cur;
  return acc;
}, 0);
```

## 實現 map 功能

map() 可以幫助我們轉化 array 當中的所有 elements，譬如全部乘以 2 並回傳結果陣列

```javascript
let array = [0, 1, 2, 3, 4];
array.map((item) => item * 2); // [ 0, 2, 4, 6, 8 ]
```

這裡我們也可以用 reduce() 來做到！只要設定 acc 初始值為一個 empty array，在每一次的迭代放入 cur 乘以 2 的結果

```javascript
let array = [0, 1, 2, 3, 4];
array.reduce((acc, cur) => {
  acc.push(cur * 2);
  return acc;
}, []);
```

最後可以得到一個同樣的結果

## 實現 filter 功能

如果要篩選出 array 當中的偶數，只要在 callback function 當中透過 if/else 來篩選出我們要的 element，然後再放入 acc 這個 array 當中，就可以得到我們想要的結果囉

```javascript
let array = [0, 1, 2, 3, 4];
array.reduce((acc, cur) => {
  if (cur % 2 === 0) {
    acc.push(cur);
  }
  return acc;
}, []);
```

## 實現 join 功能

其實用 join() 就很方便了，不過這裡只是想示範 reduce() 可以做很多種事情。如果我們想要達到 array.join('-') 的效果，可以這麼做：

```javascript
let array = ["this", "is", "a", "book"];
array.reduce((acc, cur, index) => {
  if (index === 0) return (acc = cur);
  acc += "-" + cur;
  return acc;
}, "");
```

會得到結果 `"this-is-a-book"`

## 其他應用

如果我們要同時計算 array 當中所有數值的總和與平均，這裡我們可以使用 reduce() 一口氣完成：

```javascript
let array = [0, 1, 2, 3, 4];
let result = array.reduce(
  (acc, cur, index) => {
    acc.sum += cur;
    acc.avg = (acc.avg * index + cur) / (index + 1);
    return acc;
  },
  { sum: 0, avg: 0 }
);
```

這裡我設定 arr 的初始值為一個 object，當中分別紀錄總和與平均的值。最後可以得到結果 `{ sum: 10, avg: 2 }`

## Reference

- [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10243053)_
