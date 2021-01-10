---
slug: 2020-09-14-what-is-doctype
title: What is DOCTYPE?
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [HTML, ironman]
---

<!--truncate-->

在建立 HTML 檔案的時候，大部分的人都知道要在檔案的最開頭加上這行

```htmlmixed=
<!DOCTYPE html>
```

不過這行不會出現在畫面上，那麼加上這行的作用究竟是什麼呢？

如果我們來看 [W3C](https://www.w3.org/html/wg/spec/syntax.html#doctype-legacy-string) 的說明，第一句話寫道

> A DOCTYPE is a required preamble.

也就是說，DOCTYPE 是一個「必須」的文件起頭。接著又寫道

> _Note: DOCTYPEs are required for legacy reasons. When omitted, browsers tend to use a different rendering mode that is incompatible with some specifications. Including the DOCTYPE in a document ensures that the browser makes a best-effort attempt at following the relevant specifications._

所以可以知道，DOCTYPE 的目的在於讓瀏覽器知道如何將這份文件渲染到畫面上。不過從這段話當中也延伸出了兩個問題：

1. DOCTYPEs 是 "legacy reasons"，那麼現在跟以前的差異在哪裡呢？
2. 看來存在著各種不同的渲染模式 (rendering mode)，那麼有哪些呢？

## A little bit of history

在回答剛剛兩個問題之前，先來談談 HTML 相關的歷史。

### SGML

HTML 的歷史可以追溯到 1969 年（人類登月那年），由 IBM 所開發出的 GML (Generalized Markup Language) 定義了電子文件與內容描述的方法，後來在 1986 年通過 ISO 認證成為國際標準，並稱之為 SGML (Standard Generalized Markup Language)，是為 ISO 8879 A.1。

### HTML

而 HTML 誕生於 1980 年，由歐洲核子研究中心 (CERN) 的科學家 Tim Berners-Lee 所建立，目的也是為了要讓研究人員能夠有一個使用與共享文件的標準。這個標準符合 SGML 的規範，因此 Tim 認為 HTML 是 SGML 的一種應用，隨後在 1993 年，這個標準被 IETF (Internet Engineering Task Force) 正式定義並發布草案。

1994 年 W3C (World Wide Web Consortium) 成立，接手 IEFT 負責推動網路應用的標準規範。1995 年 HTML 2.0 正式發表，特別的事情是，當 HTML 正式推出的時候，已經是 2.0 版本了，因此沒有 HTML 1.0 版本。之後， W3C 就持續推動著 HTML 的成長，並在 1999 年時推出了 HTML 4.01。

### XML

W3C 覺得 HTML 不夠嚴謹，希望能夠根據 SGML 的規範，建立另外一種應用標準，因此大家常聽到的 XML 在 1998 年誕生，並成為 W3C 的標準之一。相較於 HTML 著重在畫面呈現，XML 著重在文件的資料內容與邏輯，因此 XML 不僅可以讓人們閱讀，也能夠讓機器閱讀，成為資訊傳遞的格式之一。

### XHTML

而 W3C 的雄心壯志更那希望新的標準，能夠取代掉鬆散的 HTML，因此在 2000 年推出了基於 XML 所發展出來的 XHTML 1.0，並擁有更嚴謹的語法。

但，事情的發展總是沒有想象中那麼簡單。當 W3C 如火如荼的推動新標記語言的發展，世界另外一端的[瀏覽器大戰](https://en.wikipedia.org/wiki/Browser_wars)也正打得火熱，卯盡全力搶奪市占。W3C 沒有想到的是，如果瀏覽器不支援新標記語言，那麼其實新標記語言也就毫無用武之地。

果然在 2004 年，Apple, Opera, Mozilla 的代表就發表反對聲音，後續成立新組織 WHATWG (Web Hypertext Application Technology Working Group) 不理會 W3C 自行推動 HTML5 的發展。

### HTML5

2006 年 W3C 主席 Tim (沒錯就是剛剛那個 Tim) 發現這世界無法快速的從 HTML 轉換到 XML(XHTML)，需要循序漸進的改變，同時維持 HTML 所帶來的成果，因此接受了 WHATWG 所建立的 HTML5 基礎，原本要發表的 XHTML 2.0 也在 2009 年被放棄。2014 年，HTML5 成為正式標準。另一方面，新登場的 HTML5 本身不再完全遵循 SGML 的規範發展。

---

## Before HTML5

前面的歷史好像說得有點太長了，這裡幫大家小小總結一下

1. 過去 HTML 遵循 SGML 發展，但 HTML5 不是
2. 除了 HTML 之外，還有 XML, XHTML 等標記語言能夠被使用

接著，我們回頭來談談這篇文章所要關注的 DOCTYPE。一個符合 SGML 規範文件，主要由三個部分構成：

1. SGML 宣告
2. 文件類型宣告，包含 DOCTYPE 以及各種 DTD (Document Type Definition) 的宣告
3. 文件實例

由於有不同的標記語言，同時又有不同的 DTD，也就是不同的元素屬性、佈局、內容等定義。以 HTML4.01 來說，就有三種不同的 DTD。因此若要讓瀏覽器知道該如何渲染文件並避免錯誤，就需讓瀏覽器明確知道文件類型。在這樣的情況下，DOCTYPE 的宣告就變得非常重要。舉例來說像是

```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
```

或是

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

_(examples from [W3C wiki](https://www.w3.org/wiki/Doctypes_and_markup_styles#The_HTML5_doctype))_

## Now with HTML5

HTML5 從 2004 開始開發、2014 年成為正式標準至今，已經有相當高的普及率，因此當現今在討論前端開發所使用的標記語言時，基本上可以預設就是在談 HTML5。因此這裡我就站在 HTML5 的角度，來回答最一開始提出的兩個問題

1. DOCTYPEs 是 "legacy reasons"，那麼現在跟以前的差異在哪裡呢？
2. 看來存在著各種不同的渲染模式 (rendering mode)，那麼有哪些呢？

首先，在 HTML5 只有一種宣告，那就是

```html
<!DOCTYPE html>
```

很簡單，不需要像以前一樣去管其他東西（像是文件類型或 DTD）。只要寫下這一行，瀏覽器就知道要用 HTML5 的 `standard mode` 來處理這份文件。所謂的 `standard mode` 就是依照現今 HTML 與 CSS 規範來渲染網頁。

但是如果沒有寫這一行，HTML 文件還是可以被瀏覽器開啟，只是這時候瀏覽器就會以 `quirks mode` 來開啟。`quirks mode` 的存在基本上就是要維持「向後相容」的能力，因為當初有些瀏覽器是在 HTML 與 CSS 的標準被定義出來之前，就已開發上市，因此渲染方式會與後來遵循「標準」的瀏覽器有些差異。

在 HTML5 之前，有許多不同的渲染模式，不過在 HTML5 的時代，就剩下上述兩種了。

要知道目前是哪個 mode，可以在網頁開啟之後，在 Chrome Dev Tool 當中的 console 輸入

```javascript
document.compatMode;
```

如果得到的結果是 `BackCompat`，那麼代表現在是 `quirks mode`；如果得到結果是 `CSS1Compat`，那麼就是 `standard mode`。

## Reference

- [The DOCTYPE - W3C](https://www.w3.org/html/wg/spec/syntax.html#the-doctype)
- [HTML5 Differences from HTML4 - W3C](https://www.w3.org/TR/html5-diff/#doctype)
- [Standard Generalized Markup Language - wiki](https://en.wikipedia.org/wiki/Standard_Generalized_Markup_Language#Standard_versions)
- [XML - wiki](https://en.wikipedia.org/wiki/XML)
- [HTML - wiki](https://en.wikipedia.org/wiki/HTML)
- [Revising HTML](https://www.joedolson.com/2006/10/revising-html/)
- [Doctypes and markup styles - W3C](https://www.w3.org/wiki/Doctypes_and_markup_styles#The_HTML5_doctype)
- [Quirks mode - wiki](https://en.wikipedia.org/wiki/Quirks_mode)
- [Document.compatMode - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/compatMode)
- [Document type declaration - wiki](https://en.wikipedia.org/wiki/Document_type_declaration)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10236447)_
