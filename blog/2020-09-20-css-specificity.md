---
slug: 2020-09-20-css-specificity
title: CSS Specificity
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [CSS, ironman]
---

<!--truncate-->

## Specificity

今天想來聊聊關於 CSS 權重的一些事。雖然中文講「權重」，不過英文卻是 "Specificity"，也就是特異性的意思。[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) 的解釋如下：

> Specificity is the means by which browsers decide which CSS property values are the most relevant to an element and, therefore, will be applied. Specificity is based on the matching rules which are composed of different sorts of CSS selectors.

意思是

> 「特異性」是讓瀏覽器決定哪個 CSS 屬性與某個 HTML element 最有關係，然後可以套用該屬性。特異性的配對（計算）方式，是由不同的 CSS selector 組合而成。
>
> 也就是說，不同的 CSS selector ，會展現出不同的「遠近關係」，瀏覽器會根據最後計算出來的遠近關係，來判斷該使用哪個 CSS 屬性。關係越接近，代表特殊性越高。

而中文提到的「權重」，指的就是在 match rules 當中，給予不同的 CSS selector 的權重，用來計算和比較最後的「特異性」。

## Matching rules

[W3C](https://drafts.csswg.org/selectors-3/#specificity) 當中提到關於計算 selector 特異性的規則如下：

> A selector's specificity is calculated as follows:
>
> - count the number of ID selectors in the selector (= a)
> - count the number of class selectors, attributes > selectors, and pseudo-classes in the selector (= b)
> - count the number of type selectors and pseudo-elements in the selector (= c)
> - ignore the universal selector

看到這裡應該是有看沒有懂，所以要接著來看它提供的範例：

Examples:

```
*               /* a=0 b=0 c=0 -> specificity =   0 */
LI              /* a=0 b=0 c=1 -> specificity =   1 */
UL LI           /* a=0 b=0 c=2 -> specificity =   2 */
UL OL+LI        /* a=0 b=0 c=3 -> specificity =   3 */
H1 + *[REL=up]  /* a=0 b=1 c=1 -> specificity =  11 */
UL OL LI.red    /* a=0 b=1 c=3 -> specificity =  13 */
LI.red.level    /* a=0 b=2 c=1 -> specificity =  21 */
#x34y           /* a=1 b=0 c=0 -> specificity = 100 */
#s12:not(FOO)   /* a=1 b=0 c=1 -> specificity = 101 */
```

所以可以看到，剛剛文中提到的 a, b, c 是三種等級的權重。如果按照範例順序來解釋的話就是

- universal selector: 直接忽略，也就是三個等級都是 0，也就是 `000`
- 一個 type selector: c 等級加 1，也就是 `001`
- 兩個 type selectors: c 等級加 2，也就是 `002`
- 使用了 `+` ，當成三個 type selectors: c 等級加 3，也就是 `003`
- 一個 type selector，一個 attribute selector，所以 b, c 各加 1，為 `011`
- 三個 type selectors，但有使用一個 class selector，所以 b 為 1， c 為 3，為 `013`
- 一個 type selector 跟兩個 clas selector，b 為 2， c 為 1，也就是 `021`
- 使用 id selector，a 等級加 1，也就是 `100`
- 使用一個 id selector，以及一個 pseudo-element，a 為 1，c 為 1，也就是 `101`

所以如果有不同的 selectors 組合，都同時指向一個 HTML elements 的話，那麼計算出來的 specificity 的「等級」越大，就會被套用。如果算出來的值相同，就會以後出現 selectors 組合為主。

## 不同的等級可以超越嗎？

從上面的例子看起來，好像根據規則進行數學計算之後，就可以很快算出 specificity 的「值」，然後進行比較。所以如果 b 等級累積 11 個之後，是否就可以進位，變成 `110`，超越一個 a 等級的 `100` 呢？

舉個在實際開發中應該不會出現的例子：

```html
<!-- html -->
<div class="one">
  <div class="two">
    <div class="three">
      <div class="four">
        <div class="five">
          <div class="six">
            <div class="seven">
              <div class="eight">
                <div class="nine">
                  <div class="ten">
                    <p class="eleven" id="text">Hello world!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
/* css */
#text {
  color: green;
}

.one .two .three .four .five .six .seven .eight .nine .ten .eleven {
  color: red;
}
```

第一個 selector 組合只有 1 個 id selector，所以就是 a 等級為 1，結果是 `100`。

第二個 selector 組合有 11 個 class selector，所以 b 等級為 11，結果會是 `110`。

所以看起來 Hello world 的顏色應該是紅色。但結果，Hello world 卻是綠色！因為實際上兩者的 specificity 不是 `100` 和 `110`，正確來說，是 `1-0-0` 和 `0-11-0`。這也是為什麼我先前說的都是「等級」而不是「數值」。等級較低的 selector，即便累積再多，也無法超越等級更高的 selector

## 關於 inline style 和 !important

同樣在剛剛的 MDN 文件當中可以看到關於這兩者的說明：

**inline style**

> Inline styles added to an element (e.g., style="font-weight: bold;") always overwrite any styles in external stylesheets, and thus can be thought of as having the highest specificity.

inline style 會永遠覆寫 stylesheets 當中的樣式，所以可以「想像」他有更高等級的 specificity。

**important**

> When an important rule is used on a style declaration, this declaration overrides any other declarations. Although technically !important has nothing to do with specificity, it interacts directly with it.

!important 其實根本不會參與 specificity 的計算，瀏覽器連算都不算，直接套用有 !important 註記的樣式。所以可以「想像」他有比 inline style 更高等級的 specificity

雖然我們可以「想像」以上兩者的等級是 `0-1-0-0-0` 和 `1-0-0-0-0` ，但實際上 W3C 並沒有這樣的設計。

---

看完上面的介紹，我想就可以好好品嚐下面這張圖了

![image](https://i.pinimg.com/originals/de/01/f1/de01f16d1b38522b808ab94c4ccfba9d.png)
_[source](https://i.pinimg.com/originals/de/01/f1/de01f16d1b38522b808ab94c4ccfba9d.png)_

## Reference

- [Specificity (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- [Calculating a selector's specificity (W3C)](https://drafts.csswg.org/selectors-3/#specificity)
- https://cssspecificity.com/

---

_First published at 2020 iT 邦幫忙鐵人賽. [Link](https://ithelp.ithome.com.tw/articles/10238323)_
