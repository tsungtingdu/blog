---
slug: 2020-10-07-caret-position
title: Set caret position
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [JavaScript, DOM, Browser, ironman]
---

<!--truncate-->

今天想要來討論一個比較有趣的問題，通常我們在網頁上輸入文字的時候，都會看到一個閃動的垂直線，我們都知道那叫做游標，會隨著我們輸入的位置而變動。

雖然中文稱之為游標，不過在英文當中，有分為 cursor 和 caret 兩種東西，跟著滑鼠位置跑的叫做 cursor，黏在最新的輸入位置上的叫做 caret，雖然在畫面上，可能有時候兩個會長得一模一樣

![](https://www.cowirrie.com/blog/wp-content/uploads/2015/08/word-processor-mode-caret-and-cursor.gif)

我們今天要討論的，就是那個黏在最新輸入位置上的 caret。通常我們不會太在意 caret 的位置，因為他就很自然而然地根據我們輸入內容的位置而移動。但是，如果今天因為某些特殊需求，我們需要讓這個 caret 固定在特定的位置上，該怎麼做呢？

有人可能會問，在什麼情況下會遇到這種需求呢？

如果有使用過任何的共筆應用程式，譬如 Google Doc 或是 HackMD，你會發現在多人共筆的情況下，自己畫面上的 caret 是「固定」在自己最新的輸入位置。

你可能會覺得，這不是很正常嗎？

其實不是，在共筆的情況下，我們畫面上的 textarea 其實一直在接收來自 server 最新的 input，也就是一直有 input 一直在寫入的意思。如果根據 HTML 與 Browser 的預設行為，這時候畫面上的 caret，應該要「跑到」最新訊息的位置，也就是新寫入的 input 上，而不是停在自己原本的編輯位置上。

如果每次訊息進來，我自己的 caret 就會到處跑，那麼就無法順利的編輯自己想要編輯的訊息。

要能夠把 caret 固定在我們自己想要的地方，需要做到兩件事情：

1. 要知道目前自己編輯的位置在哪裡
2. 把 caret 設定在自己想要的位置

## 1. Get caret position

在 input 或 textarea 這兩種 HTML element 當中，Web API 有提供 `selectionStart` 和 `selectionEnd` 的 API，主要可以抓出「cursor 選擇區間」的開始位置與結束位置。

關於位置的計算，可以想像 textarea 當中的內容是一個很長的 "string"，所以位置代表的就是當前在整個 string 當中的 index 值。空白字元也會被算入，長度加一，換行也是長度加一。

如果沒有「cursor 選擇區間」，那麼代表其實開始位置和結束位置在同一個地方，所以也就是 caret 所在的位置。

舉例來說：

```html
<!-- html -->
<textarea>Hello world!</textarea>
```

可以透過下面的方式，抓出開始位置和起始位置

```javascript
// javascript
const el = document.querySelector("textarea");
const startPosition = el.selectionStart;
const endPosition = el.selectionEnd;
```

如果我將 `Hello world!` 整個字串用滑鼠選擇起來，就會得到

```javascript
// javascript
console.log(startPosition, endPosition); // 0 11
```

如果只是將 cursor / caret 停在 `Hello` 的正後方，就會得到

```javascript
// javascript
console.log(startPosition, endPosition); // 5 5
```

所以，我們只要在 `click`, `keypress` event 當中放入上面的程式碼，就可以追蹤到使用者最新的動作，以及 caret 的最新位置。像是

```javascript
// javascript
const el = document.querySelector("text");

el.addEventListener("click", (e) => {
  const target = e.target;
  const startPosition = target.selectionStart;
  const endPosition = target.selectionEnd;
  // do something else
});
```

## 2. Set caret position

同樣的，在 `input` 和 `textarea` 當中，Web API 有提供 `setSelectionRange(start, end)` 方法，可以設定 cursor 的選擇區間。

以這個例子來說

```html
<!-- html -->
<textarea>Hello world!</textarea>
```

```javascript
// javascript
const el = document.querySelector("text");
el.focus();
el.setSelectionRange(0, 5);
```

就可以看到畫面上，自動會把 `Hello` 這五個字給選擇起來，並看得到反白。

這裡要注意的是，實際上使用者在 textarea 選擇內容的時候，其實會先 `focus` 然後才會選擇。所以如果我們要用程式碼來選擇的話，記得要先 `focus()` 才會看到文字被選擇且反白。

如果像下面這樣

```javascript
// javascript
const el = document.querySelector("text");
el.focus();
el.setSelectionRange(5, 5);
```

開始位置和結束位置一樣，就等同於我們把 caret 的位置設定在 `Hello` 的正後方。這時候看不到任何反白的字。

## Solve the problem

回到最一開始的問題，所以在一個線上共筆的系統當中，我們可以透過監聽 `click`, `keypress` 等 events，並透過 `selectionStart` 與 `selectionEnd` 來找到 caret 的位置，並儲存起來。

當有外來的 input 進來時，我們就可以取出剛剛儲存的位置，然後透過 `setSelectionRange()` 方法來重新設定 caret 的位置。

另外要注意的是，由於在 textarea 當中位置是一維的，所以如果 input 的位置在使用者 caret 位置的前方，那麼就會造成 "位移"，因此需要記得回算原本的位置。

以剛剛同樣的例子來說

```html
<!-- html -->
<textarea>Hello world!</textarea>
```

假設現在使用者的 caret 是停在 `world!` 的後面，也就是 12 的位置。這時候有一個新的 input 進來，讓字串變成

```html
<!-- html -->
<textarea>Hello new world!</textarea>
```

如果要讓使用者的 caret 還是同樣停在 `world!` 的後面，這時候位置就會變成 16 而不是原本的 12，因為中間插入了 `new` 三個字，以及一個空白。

這裡我做了一個簡單的[範例](https://codepen.io/tsungtingdu/pen/pobzadG?editors=0010)，有興趣的話可以參考這裡的程式碼，並自己動手試試看喔！

## Reference

- [Selection and Range](https://javascript.info/selection-range)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10250119)_
