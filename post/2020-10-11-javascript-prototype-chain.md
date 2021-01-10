---
slug: 2020-10-11-javascript-prototype-chain
title: One chart for JavaScript prototype chain
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [JavaScript, ironman]
---

<!--truncate-->

今天想來談談 JavaScript 當中的 prototype chain，不過，我想偷懶一下，不打算從頭談起。如果是第一次接觸到 prototype chain 的朋友，可以先閱讀以下兩篇文章：

- [前端三十｜ 15. [JS] 什麼是原型鏈？](https://medium.com/schaoss-blog/%E5%89%8D%E7%AB%AF%E4%B8%89%E5%8D%81-15-js-%E4%BB%80%E9%BA%BC%E6%98%AF%E5%8E%9F%E5%9E%8B%E9%8F%88-15543787efb)
- [該來理解 JavaScript 的原型鍊了](https://blog.huli.tw/2017/08/27/the-javascripts-prototype-chain/)

那我今天要幹嘛呢？其實我一直想做一件事情，就是透過圖解來表達 prototype chain 錯綜復雜的關係。於是，我就畫出了下面這張圖了：

![](https://i.imgur.com/wEdzUSG.png)

圖中有四個物件，分別為

左上角：JavaScript Function
右上角：JavaScript Object
左下角：使用者自己建立的 Person class

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function () {
  console.log("Hello!");
};
```

右下角：使用者建立的 Person instance, tim

```javascript
const tim = new Person("tim", 18);
```

人物介紹完畢之後，接下來，就可以來解釋那張圖當中物件與線條的關係了！

---

關於 Person class，最初的 function 當中只有設定 `name` 和 `age` 兩個 properties，而 `greet` method 是後來直接加入到 Person 的 prototype 裡面。

## **藍色線段**

![](https://i.imgur.com/wEdzUSG.png)

因為 tim 是 Person 的 instance，因此可以透過 `__proto__` 來找到（指向） Person 放在 `prototype` 裡面的東西，也就是說

```javascript
tim.__proto__ === Person.prototype; // true
```

---

## **紅色線段**

![](https://i.imgur.com/wEdzUSG.png)

當我們想要呼叫 `tim.greet()` ，這時候發現 tim 本身並沒有 `greet` 這個方法，因為當初 `greet` 不在 Person 的 `contructor` 當中，是後來才加入到 Person 的 `prototype` 當中。

所以，當無法在 tim 當中找到 `greet` 方法的時候，就會透過 prototype chain (`__proto__`) 往回找，看看 Person 的 `prototype` 中有沒有這個方法。若有，就可以直接執行；若無，就會一路透過 `__proto__` 往回找，一最終找到 JavaScript 的 Object 之上。

另一方面，這時候的 tim 並沒有`prototype` 這個屬性。所以

```javascript
tim.prototype; // undefined
```

---

## **棕色線段**

![](https://i.imgur.com/wEdzUSG.png)

因為 Person class 本身是由 JavaScript Function 實作而來，因此在 prototype chain 當中，Person 的 `__proto__` 會指向 Function 的 `prototype`

```javascript
Person.__proto__ === Function.prototype; // true
```

---

## **深綠色線段**

![](https://i.imgur.com/wEdzUSG.png)

那如果是 Person 的 `prototype` 當中的 `__proto__` 呢？則會指向 JavaScript Object 的 `prototype`

```javascript
Person.prototype.__proto__ === Object.prototype; // true
```

Person class 當中的 `prototype` 本身是個物件，所以也就繼承自 JavaScript Object

---

## **紫色線段**

![](https://i.imgur.com/wEdzUSG.png)

接下來就會進入 JavaScript 當中 Function 和 Object 的複雜關係

首先，Function 的 `__proto__` 會指向自己的 `prototype`

```javascript
Function.__proto__ === Function.prototype; // true
```

---

## **粉紅色線段**

![](https://i.imgur.com/wEdzUSG.png)

接著，Function 的 `prototype` 當中的 `__proto__` 會指向 Object 的 `prototype`

```javascript
Function.proto.__proto__ === Object.prototype; // true
```

---

## **橘色線段**

![](https://i.imgur.com/wEdzUSG.png)

然後很妙的是，JavaScript Object 的 `__proto__` 指回了 Function 的 `prototype`

```javascript
Object.__proto__ === Function.prototype; // true
```

---

## **黑色虛線段**

![](https://i.imgur.com/wEdzUSG.png)

最後，Object 當中的 `prototype` 的 `__proto__` 指向 null（結束這段複雜的關係）

```javascript
Object.prototype.__proto__ === null; // true
```

## Reference

- [前端三十｜ 15. [JS] 什麼是原型鏈？](https://medium.com/schaoss-blog/%E5%89%8D%E7%AB%AF%E4%B8%89%E5%8D%81-15-js-%E4%BB%80%E9%BA%BC%E6%98%AF%E5%8E%9F%E5%9E%8B%E9%8F%88-15543787efb)
- [該來理解 JavaScript 的原型鍊了](https://blog.huli.tw/2017/08/27/the-javascripts-prototype-chain/)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10251902)_
