---
slug: 20200226-coffee-chat-with-cto
title: Coffee chat with CTO
author: Tim
author_title: Software Engineer
author_url: https://github.com/tsungtingdu
author_image_url: https://avatars1.githubusercontent.com/u/10878489?s=460&u=94b5471d7c4938dc1277db1ddfed2b6aa09cc0b9&v=4
tags: [ideas, people]
---

昨天有機會和一位前輩喝咖啡，他目前是一間新加坡軟體開發公司的 CTO，和我分享了許多工作、學習上的想法與經驗。

<!--truncate-->

在見面之前，我嘗試上網搜尋該公司的相關資料，發現幾乎找不到，而公司的網站首頁是個 console，應該說，長得像 console 的頁面，想要看到任何資料都需要下 command line 的指令，非常 geek（這裡我想表達的是稱讚的意味）。

以下是我的筆記，當中包含我自己的想法與詮釋，所以不是前輩的逐字稿喔。

---

## About Pair Programming

該公司在客戶經費充足的情況下，基本上都會有 Pair Programming 的安排。對他來說，Pair Programming 能夠大大提升開發品質與速度。但不是每一個客戶都能夠了解其價值，這裡他用了一個譬喻

> ## _你會想要搭上一架沒有經過測試，而且「只有一位」機師的飛機嗎？_

他提到，不管在訓練還是飛行的時候，一定會配置兩位機師，除了能夠互相協助之外，更重要的是讓 senior 有機會將經驗傳承給 junior，junior 可以在低風險的情況下學習。

一般來說，一位 junior developer 進入一間公司，可能有三種狀況：

1. 有 senior developer 帶，而且會先帶著你一起做，讓你看過 best practice 之後再放手讓你做（也是該公司的做法）
2. 有 senior developer 帶，但是不會先帶著你做，直到你做完之後，再給你回饋與建議
3. 沒有 senior developer 帶，自己搞定所有任務

有 2 其實就很不錯了，不過 1 所能夠帶來的價值更高。除了能夠讓 junior developer 在低風險的狀況下學習之外，當他成為 senior developer 後，也會知道如何傳承經驗。這樣的作法基本上就是將工作與培訓結合在一起。

這讓我想到 [Apprenticeship Patterns: Guidance for the Aspiring Software Craftsman](https://www.amazon.com/Apprenticeship-Patterns-Guidance-Aspiring-Craftsman-ebook/dp/B002RMSZ7E/ref=sr_1_7?keywords=Apprenticeship&qid=1582699799&s=digital-text&sr=1-7) 這本書，當中重點提到要在 software development 這條路上持續成長，就要像學徒一般的學習。

那麼，學徒是怎麼學習的呢？簡單來說，就是跟著前輩邊看邊學、邊做邊學。這件在以前看起很理所當然的事情，為什麼現在又被特別提出來了呢？因為現代人大部分都在學校裡面受教育，認為只要把書本上的東西念完，就可以應付未來在職場上的挑戰，工作之後就停止學習（或者是變得不懂怎麼學習），但這世界變化快速、挑戰也永無止盡，只能抱持著「學徒的心態」持續學習才能夠生存。

## Product Company or Dev House?

兩種公司都各有各的 pros and cons，但重要的是這間公司的開發文化如何。這裡他沒有著墨太多，但我認為重要的是哪裡有好的環境可以讓自己快速成長，而不只是完成一堆工作而已。

## Build up your first forte

現在技術這麼多，到底從哪裡開始學呢？他說，先選一條 full stack 的路來學，至於是什麼語言或框架不重要，因為在沒有建立第一個 baseline 之前，其實無從「真正」去判斷哪個技術語言或框架比較好。

我好奇問，為什麼一定要 full stack？對他來說，能打造出 end-to-end 的解決方案，才算是真正的工程師。前端、後端、資料庫甚至到 DevOps 其實都息息相關，如果只懂後端而不懂前端，那麼就會不知道為什麼後端 api 要這樣設計、為什麼這裡要做 A 而不是做 B。

另外，也唯有走過一次 full stack，才會知道想要打造出 end-to-end 解決方案時，會遇到什麼樣的問題。

## Then, build “T-shaped skills”

當精通一條 full stack 後，接著你就可以挑選 full stack 當中你有興趣的一段，做橫向的發展，去了解同樣的一個問題，可以如何被不同的工具、方法給解決，不同工具和方法的 pros and cons 分別是什麼。之所以能夠這麼做，是因為你已經有了一條 baseline、有足夠的知識可以去做比較。

## Next, build your second forte

T-shaped skills 完成到一定程度之後，接下來，就可以選擇建立另外一條 forte。這裡他其實也不知道要如何選擇，但他說在你所擁有的 forte，至少有一個是目前是市場的熱門需求（至少要能夠生存），另外一個可以是自己的興趣。重點是，要學「解決問題的方法」而非工具（技術）本身。

## “The Tech Cycle”

他提到了「技術循環」的概念，這也是整段對話中我覺得最有趣的地方。他說，當有新的問題需要被解決的時候，人們總是會先回頭看看過去的技術，有哪些技術、解決方案是可以被用在新問題上。

他舉例兩個例子，一個是 cable modem（就是上網的時候會唧唧叫的機器）& 3G 網路傳輸，都有用到類比訊號與數位訊號的轉換技術。根據他的說法，當年因為 DSL 出現而失落的工程師們，到了 3G 網路時代又再度找到了舞台，而年輕一輩的工程師完全不懂為什麼這些人懂這種東西。另外一個例子是購物時常看的購物明細單（或收據），與 Kindle 的畫面呈現技術，其實背後的解決方案也是類似。

所以如果行有餘力，可以開發自己的第二個 forte，除了拓展自己的知識與能力之外，未來也有可能在某個時候，成為世界上最熱門的解決方案之一。

## Understand “user story”

但很妙的是，他對於 junior developer 的期待，並不是精通 full stack 中所有的技術細節，而先是要「看懂 user story」
他說，他期待當 junior developer 看到一個 user story 的時候：

- 能夠理解這裡要解決的問題是什麼，能夠為客戶帶來的價值是什麼？
- 能夠知道如何為這個 user story 打造 end-to-end 的解決方案，或是創造 deliverable value
- 能夠問出關鍵問題
- 能夠點出問題，並找到解決方案，或建立假設

看起來跟技術比較沒有關係，但要達到這樣的期待，需要對於技術能夠解決的問題、能夠帶來的價值有深度的瞭解。

## Problem behind tools

在學習新工具與技術的時候，也別忘記去瞭解其底層的運作，在我們遇到問題的時候，使用這些工具可以幫助我們解決「我們看得見的問題」，但很多時候這些工具的底層，默默的幫我們處理很多「我們看不見的問題」。

工具日新月異，但問題會一直存在，只會在不同的時間點，被人們用不同的工具所解決。所以真正重要的是，要學習到「我們在解決什麼問題」。

## Readable & Testable Code

他認為程式碼（或程式語言）最重要的是「可讀性」與「可測試」，如果別人很難理解你寫的程式碼，那麼未來將會很難維護或改進。若以程式語言來說，他提到 Ruby 是一個非常易讀的語言，

但有人詬病它的效能不夠好，他說放心，只要是易讀、方便進行測試的程式語言，只要有人持續使用，有一天效能問題將會被解決。

---

就這樣一路聊了將近兩個小時，很感謝他和我分享這麼多想法和經驗。聊完後覺得自己和真正的 software developer 還有一大段距離，但對於未來的學習方向也更加明確了點。
