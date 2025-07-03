---
UUID: 20250407084504
Created: '2025-04-07 08:45'
Modified: '2025-04-07 08:45'
Version: 1
tags: []
PublishDate: 2014-06-19T00:00:00.000Z
Pages: 256
Author:
  - '[[Dan Harris]]'
Genre: 'Body, Mind & Spirit'
Fiction: false
Stored: kindle
Purchased: true
Cover: >-
  http://books.google.com/books/content?id=Yc2ZAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api
URL: 'https://www.goodreads.com/book/show/18505796-10-happier'
ReadingStatus: Avoid
FinishDate: null
Rate: 2
draft: true
SiteProcssed: true
---

# 10 percent Happier


## ✒️ Note-Making

### 🔗Connect

⬆️Topic::

### 💡Clarify
🔈 *Summary of main ideas* 

### 🗒️Relate

⛓ *by following this method, what will happen? What is the goal of this book?*

### 🔍Critique

✅ *relevant research, metaphors or examples that helps to convey the argument*


❌ *the logical jumps, holes or simply cases where it is wrong...*


🧱 *Implementations and limitations of it are...*

### 🗨️Review

💭 *my opinions on the book, the writers style...*

### 🖼️Outline


## 📒 Notes

### air hunger

How he got so stressed at work that he started doing drugs and it went out of control

### unchurched 

with success, comes even more pressure 

### genius or lunatic 

He started realizing the error of his ways, either living in the past or future, never the present. Buried in [Future disillusionment](/notes/future-disillusionment.md).

Yet he still found it difficult to quite his mind and focus on the now

### happiness inc

After meeting several self help gurus, he saw that he just can't click with them, as if they think like aliens to him.

### the jew-bus

He found a more down to earth mentor that opened him to the world of Buddhism, how everything is suffering due to our attachments, and that we would be better off letting go of the wanting mind, of the self, and just being.

### the power of negative thinking 

He started getting into the meditation habit 


## Cleanup
- [ ] fill note making
- [ ] add highlights
- [ ] add drawing
- [ ] review notes
- [ ] remove duplicate links (see query)
- [ ] mark to publish
- [ ] lint document

```dataviewjs
const links = dv.current().file.outlinks.values;
const linkCounts = {};

for (let link of links) {
    const target = link.path;
    linkCounts[target] = (linkCounts[target] || 0) + 1;
}

const filteredLinks = Object.entries(linkCounts)
    .filter(([_, count]) => count >= 2)
    .map(([link, count]) => [dv.fileLink(link), count]);

dv.table(["Link", "Count"],
    filteredLinks);

```
