---
slug: 2020-09-16-what-is-metadata
title: What is metadata?
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [HTML, ironman]
---

<!--truncate-->

根據 [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Metadata) 的說明：

> Metadata is — in its very simplest definition — data that describes data.

Metadata 是用來描述資料的資料，聽起來有點在繞圈子的感覺，更仔細來說，就是用來描述「這份 HTML 文件」的資料。

不過 metadata 並不會直接呈現在畫面上。Metadata 主要是給瀏覽器和搜尋引擎看的，如果想要讓自己的網站更容易被特定的關鍵字搜尋到，能夠被正確的渲染，或是希望呈現預期的預覽資訊時，就需要好好設定一下 metadata。

舉個例子來說，如果我在 facebook 上面分享我自己的個人頁面，在預覽的畫面當中（見下圖），可以看到我所設定的 **圖片**、**網站名稱**，與**網站描述**

![Imgur](https://i.imgur.com/tv3pP9A.png)

當然 metadata 不只可以做到這些事情，接下來就仔細來看我們能在 metadata 當中做些什麼吧！

## Basic info in metadata

首先，所有的 metadata 基本上會被放在 `<head>` 當中

```html
<html>
  <head>
    <!--   metadata       -->
  </head>
  <body>
    <!--  content    -->
  </body>
</html>
```

一些基本的資訊如下：

### name (author, description, image)

```html
<meta name="author" content="Tim" />
<meta name="description" content="This is my page" />
<meta name="image" content="xxx.jpg" />
```

基本上就是呈現作者名稱，網站的敘述，以及圖片。這些資訊都可以讓搜索引擎進行查詢。

### name (~~keywords~~)

另外，你可能會看過 `keywords` 的設定，像是

```html
<meta name="keywords" content="html, css, javascript" />
```

不過這個目前會被搜尋引擎給**直接忽略**，因為過去被太多人給濫用了。所以現在設定 `keywords` 其實是「沒有任何作用」。

## Functional info

Functional info 其實是我自己取名字，因為只是想在這一堆 metadata 當中做些分類。這裡有一些跟瀏覽功能比較相關的資訊如下：

### charset

```html
<meta charset="UTF-8" />
```

`charset` 說明這份 HTML 如何被 encode，最常見的就是 UTF-8，HTML5 的 chartset 也預設為 UTF-8。其他 charset 的選擇可以參考[這裡](http://www.iana.org/assignments/character-sets/character-sets.xhtml)。

### viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

`viewport` 說明這份文件的可視範圍，譬如這裡的設定是

- 寬度等同於 device 寬度
- 預設縮放比例為 1

除了這兩個之外，也可以做不同的設定，像是

- width=600 (寬度等於 600px)
- height=device-height (高度等於 device 高度，不過通常不會有人這樣用)
- maximum-scale=2.0
- minimum-scale=0.8
- user-scalable=no

在手機上的瀏覽器，可能會因為畫面方向 (orientation) 的不同，會自動將頁面 "zoom in"，如果要避免瀏覽器自發的行為，就需要額外設定 maximum-scale 和 minimum-scale 來限制。設定 user-scalable 為 no 代表使用者無法自己放大或縮小網頁。

### http-equiv

接下來這個 `http-equiv` 就有點讓人難以理解了，[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) 的解釋是

> If the http-equiv attribute is set, the meta element is a pragma directive, providing information equivalent to what can be given by a similarly-named HTTP header.

翻譯成中文（其實發現還是有一半是英文），就是

> 如果有設定 http-equiv 的屬性，那麼這裡的 meta element 就是 "pragma directive"，提供的資訊就等同於類似名稱的 HTTP header

"pragma directive" 的意思是，這裡的資訊將會告訴 compliler 或是 translator 如何處理這份文件。也就是說，http-equiv 當中的資訊會告訴瀏覽器該如何處理這份文件，而且這裡的資訊會類似於 HTTP header 的資訊。因此也會看到有人說 http-equiv 是 "Equivalent to http response header"，這也就是 equiv 的由來。

不過這時候我們可能會想：不是所有 HTTP response 都會有 headers 資訊嗎，為什麼要多此一舉在 HTML 文件放入類似的資訊呢？但的確在有些特殊的情況下，使用者無法直接獲得 HTTP response headers，所以就需要靠 http-equiv 的資訊了。

那麼就讓我們來看看 http-equiv 裡面可以放哪些東西吧。比較常見的像是

```html
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
```

這裡說明文件的類型與 charset。要注意的是，如果要設定 charset 的話，一定要同時設定 content-type。不過在 HTML5 當中如果要設定 charset，建議直接使用

```html
<meta charset="UTF-8" />
```

另外還可以設定 content-security-policy (細節可以參考 [MDN](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#:~:text=The%20HTTP%20Content%2DSecurity%2DPolicy,site%20scripting%20attacks%20(XSS).>))

```html
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self'; object-src 'none'"
/>
```

還有一些像是

- set-cookie
- x-ua-compatible

不過 MDN 以及 WHATWG 上的文件都說 `"User agents are required to ignore this pragma."` 。

最後，來看個比較有趣的 http-equiv 屬性 refresh，他可以告訴瀏覽器在指定的時間內 "refresh" 這個頁面，並同時將頁面轉向到其他地方去。舉幾個例子像是：

**3 秒後 refresh 頁面**

```html
<meta http-equiv="Refresh" content="3" />
```

**5 秒後導向 Mozilla 網站**

```html
<meta http-equiv="refresh" content="5; url=https://www.mozilla.org" />
```

## Info for social media

現今大家常常會在社群平台上分享網站連結，當我們貼上連結準備要發文的時，社群平台就會嘗試解讀這個連結當中的內容，並幫我們建立預覽圖與相關資訊。這是一個自動化的過程，不過如果我們想要自己掌握顯示的資訊，那麼就可以在 metadata 中做設定。

每一個平台要的東西都有點不一樣，好在現在有 [Meta Tags](https://metatags.io/) 或是 [Mega Tags](https://megatags.co/#generate-tags) 這樣的服務，來幫我們快速產生需要的 tags。

下面就是我透過 Mega Tags 所產生的 metadata

```html
<!-- Schema.org for Google -->
<meta itemprop="name" content="Tim's Page" />
<meta itemprop="description" content="Software Developer, Learner, Canopus" />
<meta
  itemprop="image"
  content="https://tsungtingdu.github.io/profile/src/pic/fly.jpg"
/>
<!-- Open Graph general (Facebook, Pinterest & Google+) -->
<meta property="og:title" content="Tim's Page" />
<meta
  property="og:description"
  content="Software Developer, Learner, Canopus"
/>
<meta
  property="og:image"
  content="https://tsungtingdu.github.io/profile/src/pic/fly.jpg"
/>
<meta property="og:url" content="https://tsungtingdu.github.io/profile/" />
<meta property="og:site_name" content="Tim's Page" />
<meta property="og:type" content="website" />
```

將上面的資訊放入 HTML 的 `<head>` 當中，就可以產生出期待的預覽圖片與文字囉。如果社群平台沒有正確呈現該有的資訊，那麼我們可以下面各家的 debugger 網站去調整：

- [Facebook](https://developers.facebook.com/tools/debug/)
- [Twitter](https://cards-dev.twitter.com/validator)
- [LinkedIn](https://www.linkedin.com/post-inspector/inspect/)

## Reference

- [HTTP-Equiv: What Is It Used For?](https://www.keycdn.com/support/http-equiv)
- [The Document-level Metadata element - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv)
- [The meta element - WHATWG](https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10237545)_
