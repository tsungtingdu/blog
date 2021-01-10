---
slug: 2020-09-21-css-sticky-position
title: CSS sticky position
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [CSS, ironman]
---

<!--truncate-->

先前做專案的時候有個很長的 table，遇到一個問題是，要如何在使用者往下滑動畫面的時候，讓 table head 能維持在畫面上方？

當我找著找著，就發現 CSS 的 position 在 `static`, `relative`, `absolute`, `fixed` 之外，還有一個 `sticky` 的值！

今天就來快速的回顧一下 CSS position 屬性，然後也看一下新朋友 `sticky`

## 原廠設定 static

```css
position: static;
```

如果沒有做任何 position 的設定，那麼該 element 的 postion 就是 static，意思就是會依照原本、正常的方式排列。在 static 的情況下，`top`,`right`, `bottom`, `left`, `z-index` 都是無效的。

## relative

```css
position: relative;
```

relative 和 static 其實非常像，但在 relative 的情況下可以使用 `top`,`right`, `bottom`, `left`, `z-index` 且不影響其他 elements 的排列。也就是像下面這個樣子：

![Imgur](https://i.imgur.com/dWxoD8b.png)

藍色的方塊還以為綠色的方塊還在原本的位置上，但實際上綠色的方塊已經透過 `top`,`right`, `bottom`, `left` 屬性偏移原本的位置了。另一方面，你也會注意到，在 HTML 結構上先出現的綠色方塊，這時候覆蓋在藍色方塊上，這是因為當我們設定 `position: relative` 時，會創造出一個新的 "stacking context"，這個新的 stacking context 出現在原本的 stacking context 之後，所以在 z-index 層級上會變得比較高。

關於 stacking context 的介紹，可以參考我的[上一篇文章](https://ithelp.ithome.com.tw/articles/10239796)。

## absolute

```css
position: absolute;
```

對比於 relative 的相對定位，absolute 指的就是絕對定位，意思是該 element 不會跟隨著一般的排列規則，出現在相對的位置上，而是會跳脫原本的排列規則，出現在某個參考點的絕對位置上。

那麼這個參考點是什麼呢？該 element 會不斷的往父層找，找到最近一個有設定 `position` 屬性的 element。其實也就是找到上一層創造出 stacking context 的 element。

以下圖為例，白色方塊設定了 `position: relative` ，當綠色方塊設定了 `position: absolute` 要往父層找參考點的時候，就會找到白色方塊，然後因為此時設定 `top: 0; left: 0`，所以就會直接黏在白色方塊的左上角。

同時你也會發現，因為綠色方塊脫離了原本的排版，所以藍色方塊就當綠色方塊不存在，直接排在紅色方塊後面，跟`position: relative` 的狀況不一樣。

![Imgur](https://i.imgur.com/jzCmqfV.png)

```html
<!-- HTML -->
<div class="box white">
  <div class="box red"></div>
  <div class="box green"></div>
  <div class="box blue"></div>
</div>
```

```css
/* CSS */
.box {
  width: 100px;
  height: 100px;
}

.white {
  position: relative;
  border: 1px solid black;
  margin: 10px;
  padding: 50px;
  height: 200px;
}

.red {
  background-color: red;
}

.green {
  position: absolute;
  background-color: green;
  top: 0px;
  left: 0px;
}

.blue {
  background-color: blue;
}
```

但如果我們忘記在白色方塊設定 `position: relative` 的時候，會發生什麼事情呢？這時候綠色方塊就會一路往上找，找到上一個創造出 stacking context 的 element，也就是 html 上囉

![Imgur](https://i.imgur.com/UZ1u5j9.png)

最後一提的是，不是只能找到 `position: relative` 的 element 才能當作參考點，`position: absolute`, `position: fixed` 也都可以喔。

## fixed

```css
position: fixed;
```

如果弄清楚了 `position: abosolute` 的特性，那麼要理解 `position: fixed` 就相對簡單多了。不同於 `absolute`，`fixed` 的參考點在 viewport 上，也就是說，它是以使用者可以看到的畫面做為參考點，常見的應用就是，讓一個 element 固定在畫面的某個地方，不會因為畫面滾動而有所改變。

另一個有趣的事情是，如果我們要將網頁印成文件，那麼這個 `fixed` 的 element 會出現在每一頁的同一個位置上。

## sticky

```css
position: sticky;
```

最後，終於要來看今天真正想討論的 `position: sticky`! 根據 MDN 上的說明，`sticky` element 不會脫離原本的排版流，跟 `relative` 有點像，但是會黏在最近的 "scrolling ancestor" 上。

什麼是 "scrolling ancestor" 呢？可以想像創造出可滾動的父層元素，像是有設定 overflow 的 elements，或者是，整個 html 文件本身。

知道什麼是 scrolling ancestor 之後，`sticky` element 的行為就是：

- 在還沒有碰到 scrolling ancestor，就像是 `position: relative` 一樣
- 在碰到 scrolling ancestor 後，就像是 `position: absolute` 一樣，位置會固定在相對於參考點的絕對位置上，而這個參考點就是 scrolling ancestor。

舉下面的例子，container 當中的 elements 高度遠大於 container 的高度，因為有設定 `overflow` 因此產生滾動效果。對於有設定 `position: sticky` 的綠色方塊來說，使用者一路往下滑、綠色方塊往上跑的時，當綠色方塊碰到 scrolling ancestor，也就是 container 的時候，就會「黏在」他上面。當然「黏的」的位置，可以透過 `top`, `right`, `bottom`, `left` 來決定。

```html
<!-- html -->
<div class="container">
  <div class="box red">red</div>
  <div class="box green">green</div>
  <div class="box blue">blue</div>
</div>
```

```css
/* css */
.container {
  overflow: scroll;
  margin: 50px;
  width: 200px;
  height: 300px;
  border: 1px solid black;
}

.box {
  padding: 10px;
  margin: 0 auto;
  text-align: center;
  width: 80%;
  height: 100px;
}

.red {
  background-color: red;
}

.blue {
  background-color: blue;
  height: 300px;
}

.green {
  background-color: green;
  position: sticky;
  top: 0;
  left: 0;
}
```

## Reference

- [position (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/position)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10241079)_
