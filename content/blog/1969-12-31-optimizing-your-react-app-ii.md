---
title: Optimizing a monolithic React App - II
slug: optimizing-your-react-app-ii
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2020-08-20T17:41:56.000Z
draft: true
---

Previously I mentioned about the metrics we track to identify success, and some insight on how we reduced our vendor size by about 50%. You can read more about it in detail [in my previous article](https://techunderthesun.in/optimizing-your-react-app/).

## Tackling the bundle size

Again [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer), was a great tool in helping us identify why our bundle size was so large. Now our WebApp is a monolith and it was build as a web application, which means it contained code for all the pages and it's route and other complex page specific business logic all cramped into a bundle. Now some might argue that, though we suffer on the initial page load, this gives an advantage of all subsequent page navigations (since by this point all the code/logic needed to handle other pages are most likely already downloaded).
