---
slug: 2020-10-12-macro-micro-task
title: Event loop, macro-task and micro-task
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [JavaScript, Browser, ironman]
---

<!--truncate-->

JavaScript 的運作環境是 single thread，也就是說，在同一個時間點，只能處理一件事情。

如果有一個 A 任務需要一些時間才能被完成，那麼執行到 A 任務的時候，整個 JavaScript 程式就會停在那邊，等到 A 任務完成之後，才能繼續往下執行。但在等待的過程中，無法處理其他任務，以及處理使用者的互動，因此，在 JavaScript 採用了非同步的方式來處理。

以下面的程式碼來解釋非同步：

```javascript
console.log("Hello world!");

setTimeout(() => {
  console.log("I am back");
}, 10000);

console.log("Hello world again!");
```

首先，JavaScript 會逐行執行程式碼，所以會先在 console 看到 `Hello world` 的字樣。

接著，會執行到 `setTimeout` function。`setTimeout` 是非同步的 function，負責等待一段時間之後，在執行當中的 callback function。因此這裡 JavaScript 會做的事情是，執行 `setTimeout` 然後將等待的任務交給瀏覽器來處理。之後 JavaScript 就不管了，繼續執行下面的程式碼，在 console 當中印出 `Hello world again!` 的字樣

當瀏覽器等待完 10 秒之後，就會把 callback function 丟回到 task queue 當中，等待適當時機，再被 JavaScript 執行，印出 `I am back` 的字樣。

想理解更多 JavaSrcipt 關於非同步的處理，可以參考 [前端三十｜ 11. [JS] 如何處理非同步事件？](https://medium.com/schaoss-blog/%E5%89%8D%E7%AB%AF%E4%B8%89%E5%8D%81-11-js-%E5%A6%82%E4%BD%95%E8%99%95%E7%90%86%E9%9D%9E%E5%90%8C%E6%AD%A5%E4%BA%8B%E4%BB%B6-136d3c398c5f) 這篇文章。

想更清楚知道 event loop 的運作，可以參考 [What the heck is the event loop anyway? | Philip Roberts | JSConf EU](https://youtu.be/8aGhZQkoFbQ) 這個演講。

## When to "call back"?

但是，JavaScript 要哪時候處理那些 callback functions 呢？

有一種想法是，當非同步的 functions 執行完畢後回傳的 callback function，就直接放進 call stack 裡面。

這樣也許看起來合理，也符合最後看到的現象。不過大部分的程式不會只有這樣短短三行的程式碼，也許有上百行、上千行的程式碼，那麼真的要把 callback 丟回來的話，也是要等那上千行的程式碼執行完畢之後，才能執行 callback。

為了要能夠更精準的執行 callback functions，因此在 JavaScript 的運作環境當中，多了一個 "microtask queue" 的設計，來專門處理 callback functions 的運作。

相對於 microtask，可以想像原本的程式碼任務都是 "macrotask"，也就是一行一行的執行下去。當非同步任務完成，需要執行 callback function 的時，這時就會把 callback function 丟進 microtask queue，等到當前的 macrotask 執行完畢之後，一口氣把 microtask queue 當中的任務清空，之後才會再執行下一個 macrotask。

所以完整的 event loop 會是：

1. 從 macrotask queue 當中取出最舊的任務，並執行
2. 檢查 microtask queue，並執行當中所有的任務，直到清空為止
3. 進行畫面渲染（有需要的話）
4. 檢查 macrotask queue 當中是否有下一個任務需要處理。若有，回到第一步 。若無，則等待。

WeB API 也提供了 `queueMicrotask` 的方法，能夠將 functions 直接放入 microtask queue。

另一方面，`setTimeout` 本身丟回來的 callback function 是一個 macrotaks，也就是說，我們透過 `setTimeout` 來規劃一個未來一定時間後會出現的 macrotasks

## Example

讓我們直接來看這個 case，執行之後結果會是什麼呢？

```javascript
console.log("Hello world");

setTimeout(() => {
  console.log("start of setTimout");
  queueMicrotask(() => {
    console.log("microtask in setTimout");
  });
  console.log("end of setTimeout");
}, 0);

Promise.resolve().then(() => console.log("promise"));

queueMicrotask(() => {
  console.log("start of microtask");
  queueMicrotask(() => {
    console.log("microtask in microtask");
  });
  console.log("end of microtask");
});

console.log("Hello world again!");
```

答案是

```
Hello world
Hello world again!
promise
start of microtaks
end of microtaks
microtask in microtask
start of setTimout
end of setTimeout
microtask in setTimout
```

1. 首先，會先執行第一行的 `console.log`，印出 "Hello world"
2. 接著遇到 `setTimeout`，這時候 JavaScript 就會把這個任務交給瀏覽器做計時，然後繼續往下執行
3. 執行 `Promise`，而由於實際上沒有等待任何執行，所以會直接執行 `.then`，這時候會把 `.then` 當中需要被執行的任務放入 "microtask queue"
4. 執行 `queueMicrotask`，也就是把當中所有的東西都丟入 "microtask queue"。但是，這時候當中的另外一個 `queueMicrotask` 還沒有被執行喔
5. 執行 `console.log` 印出 "Hello world again!"
6. 原本程式碼當中該當下被執行的內容都執行完了，這時候本來應該要來跑下一個 macrotask，也就是 `setTimeout` 當中的 callback function，不過不要忘記，microtask queue 當中有任務需要處理，因此需要清空 microtasks 才能執行下一個 macrotask
7. microtask queue 當中第一個出現的是 `console.log('promise')`
8. 接著，出現了
   ```javascript
   console.log("start of microtask");
   queueMicrotask(() => {
     console.log("microtask in microtask");
   });
   console.log("end of microtask");
   ```
   這時候會先印出 `start of microtask`，接著把 `console.log('microtask in microtask')` 丟進 "microtask queue" 當中，最後印出 `start of microtask`
9. 結束了嗎？還沒，因為 "microtask queue" 當中還有一個剛剛才丟進去的 `console.log('microtask in microtask')`，所以會印出 `microtask in microtask`
10. 最後，確認 "microtask queue" 當中都沒有東西之後，就來執行下一個 macrotask，也就是
    ```javascript
    console.log("start of setTimout");
    queueMicrotask(() => {
      console.log("microtask in setTimout");
    });
    console.log("end of setTimeout");
    ```
    我想到這裡，應該就對執行順序沒有問題了！

## End

透過 microtask queue 的方式，讓 callback function 有機會在 macrotask 一連串的執行之間，在最短的時間插隊並執行，完成非同步的任務。

## Reference

- [Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
- [前端三十｜ 11. [JS] 如何處理非同步事件？](https://medium.com/schaoss-blog/%E5%89%8D%E7%AB%AF%E4%B8%89%E5%8D%81-11-js-%E5%A6%82%E4%BD%95%E8%99%95%E7%90%86%E9%9D%9E%E5%90%8C%E6%AD%A5%E4%BA%8B%E4%BB%B6-136d3c398c5f)
- [In depth: Microtasks and the JavaScript runtime environment](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10252439)_
