---
slug: 2020-09-17-css-display
title: More about CSS display
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [CSS, ironman]
---

<!--truncate-->

如果有接觸過 CSS，那麼一定對於 display 這個屬性不陌生。display 定義了 HTML 當中的內容該如何在畫面上排列，也因此出現（被使用）的頻率非常的高。常見 display 的值有

- none
- block
- inline
- inline-block
- flex
- grid

雖然平常使用起來非常習慣，不過越是習慣的東西，越有可能忽略了一些小細節，於是我就打開了 MDN 查看文件，發現了許多以前沒有看過的東西。雖然不知道這些東西可能也不會影響到專案的開發，但就少了一些樂趣。

這篇文章不會深入介紹 flex 或是 grid 的使用，相信大家在網路上可以找到許多資料。這裡也不會提到太多實務上的操作方式。所以就請大家帶著輕鬆愉快的心情一起跟我讀文件吧！

## Syntax

打開 [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/display) 當中介紹 CSS deisplay 的文件，看到 Syntax 的這個段落，如下：

```css
.container {
  display: [ <display-outside> || <display-inside> ] | <display-listitem> |
    <display-internal> | <display-box> | <display-legacy>;
}
```

會發現這個屬性當中的值，不是只有「一種」分類，而是有以下「六種」分類：

- display-outside
- display-inside
- display-listitem
- display-internal
- display-box
- display-legacy

也就是說，我們平常在寫的 display，其實是上述六種分類的 "shorthand" 寫法。當我們在 display 屬性放入一個或多個值（e.g., flex）之後，它會自動將這個值找到對應的分類，並根據 syntax 的規則，最後呈現出正確的畫面。

在正式進入 display 當中不同的分類之前，先來介紹一下 CSS 當中 syntax 的意義

#### Single bar |

首先可以很明顯看到，大部分的分類是被 `|` 給隔開。在定義上，代表著`|` 前後的值，只能出現一個，如果放入超過一個的選項，那麼這個屬性可能就會失效。舉例來說，如果我們寫了一下的設定：

```css
display: flex none;
```

其中 `flex` 是屬於 display-inside，而 `none` 是屬於 display-box 分類，因此就會發現瀏覽器會直接跳過 CSS 當中這個設定，讓 display 維持在瀏覽器的預設值。

#### Brackets []

不過不是所有的 display 分類都被 `|` 給隔開，其中 display-outside 和 display-inside 是被 `[]` 包起來。這個和一般寫程式當中的 `()` 一樣，負責將運算子分組 (grouping) 並提高 () 內部的運算優先級。

#### Double bars ||

最後，讓我們來看長得很像 OR、把 display-outside 和 display-inside 給隔開的 `||` ，它代表的是，其前後的值必須至少出現一個，可以以任意順序出現。至少出現一個的意思是，代表著其實 display-outside 和 display-inside 可以同時存在！

所以，如果用白話的方式來解釋以下的 display syntax

```css
.container {
  display: [ <display-outside> || <display-inside> ] | <display-listitem> |
    <display-internal> | <display-box> | <display-legacy>;
}
```

那麼就會是

> display 屬性的值有六種，六種分類只能擇一存在，若有兩個或以上的值，這個屬性的設定就會被跳過。但唯一的特例是，display-outside 可以和 display-inside 同時存在。

不過雖然 syntax 如此定義，但是目前能夠支援 "Multi-keyword values" 也只有 Firefox 70。若要同時設定 `display-outside` 和 `display-inside` 的值，目前大部分的做法還是會使用單一值，對應關係像下面這樣：

```css
inline-block     #等於 inline flow-root
flex             #等於 block flex，預設 display-outside 為 block
inline-flex      #等於 inline flex
grid             #等於 block grid，預設 display-outside 為 block
inline-grid      #等於 inline grid
```

左邊是單一值，右邊是相對應的 `display-outside` 和 `display-inside` 值。

接下來，就讓我們一起分別看看這六種分類的內容吧！

## display-outside

`display-outside` 定義了該 element 外部該如何呈現，也就是關係到這個 element 跟其他 element 之間的排列關係。常見的值有

- block
- inline

`block` 會讓該 element 獨自佔有一行的空間，也就是產生換行的效果，並且可以透過 `height`, `width` 來定義該 element 的寬和高。

而 `inline` 則是會允許和身邊其他的 element 共處一行，前提是螢幕寬度夠，且身邊的 elements 也是 `inline` 。也因為要讓不同的 elements 可以共處一行，所以這裡並不會允許使用者自定義 elements 的寬和高，其大小會由 element 當中的內容來決定。另一方面，`margin-top` 和 `margin-bottom` 會失效。

## display-inside

`display-inside` 定義了該 element 內部的 elements 該如何呈現。可以選擇的值包含

- flow-root
- table
- flex
- grid

`flow-root` 在 MDN 上的定義為

> The element generates a block element box that establishes a new block formatting context, defining where the formatting root lies.

它會使 element 內部建立類似 block 的空間。舉例來說，當我們使用 `inline-block` 時，其實等同於 `display-outside` 為 `inline` 而 `display-inside` 為 `flow-root`，該 element 會像一般的 `inline` element 一樣，和身邊的其他的 `inline` element 共處一行，但又同時可以像 `block` element 一樣設定高度（但仍然無法自定義寬度，寬度由該 element 當中的內容而定）。

`table` 會使 element 表現得像是 HTML 當中的擁有 table 標籤的 element 一樣

`flex` 和 `grid` 兩者目前被廣泛使用，這裡我就不多做介紹。通常使用的時候，我們只會寫

```css
display: flex;
display: grid;
```

在只能處理單一值的瀏覽器當中，雖然我們只放入了 `display-inside` 的值，不過同時默認 `display-outside` 為預設值 `block`。

## display-listitem

這個分類下只有一個值，就是 `list-item`。它會產生 block box，且內部的內容會變成 list item。譬如

```html
<!-- html -->
<div class="list">123</div>
```

```css
/* css */
.list {
  display: list-item;
}
```

畫面上就會看到 div 裡面的內容成為了 list item。

## display-internal

在 `display-inside` 為 `table` （或是不常見的 `ruby`) 的情況下，其實 element 內部會有較為複雜的結構，因此若父層設定 `display: table`，則子層就可以利用 `display-internal` 的值來做排版上的設定。這裡舉一些例子：

- table-row-gruop (類似 HTML 當中的 `<tbody>`)
- table-header-group (類似 HTML 當中的 `<thead>`)
- table-footer-group (類似 HTML 當中的 `<tfoot>`)
- table-row (類似 HTML 當中的 `<tr>`)
- table-cell (類似 HTML 當中的 `<td>`)
- table-column-group (類似 HTML 當中的 `<colgroup>`)
- table-column (類似 HTML 當中的 `<col>`)
- table-caption (類似 HTML 當中的 `<caption>`)

## display-box

這裡主要值為 `none`，也就是我們很常用的

```css
display: none;
```

可以讓 element 不會被呈現在畫面上的方式。

另外，要讓 element 從畫面上消失（不被看見），有以下幾種做法

```css
display: none;
visibility: hidden;
opacity: 0;
```

但只有 `display: none` 是真正把該 element 從畫面上移除，並不佔據位置。而另外兩個，雖然使用者看不到，但是該 element 還是會佔據原本的位置。

## display-legacy

這個分類主要是處理在 CSS 2 當中使用單一值的設定方式，像是剛剛提到的

- inline-block
- inline-flex
- inline-grid

等。而因為目前 "multi-keyword values" 還沒有普遍被支援，因此這個分類我想將還會使用一段時間。

## Reference

- [display (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [Adapting to the new two-value syntax of display (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/display/two-value_syntax_of_display)

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10238323)_
