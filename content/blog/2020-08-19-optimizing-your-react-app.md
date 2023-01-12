---
title: 'Optimizing a monolithic React App - I'
slug: 'optimizing-your-react-app'
date_published: 2020-08-20T05:57:51.000Z
date_updated: 2020-08-20T16:55:57.000Z
tags: React, Performance, enhancements, Reactjs, Apps, Typescript
---

At a large retail company in BC, Canada, we were faced with a monolithic problem of an underperforming and over-bloated Storefront web app, built using React. Thus to address this growing concern over performance, scalability and security a team was built. Performance as a subject is an ocean, and to be tasked with solving for it is like searching for the needle in the ocean.

## The metrics

The first obvious place to look would be to look at some metrics. But what metrics should we be looking at? The key metrics we identified were LCP (Largest Contentful Paint), TTI (Time To Interactive) & CLS (Cumulative Layout Shift). Of course, these weren't the only metrics that we focused on, apart from the above we also kept an eye on our speed-index, bundle sizes, which were, like I mentioned earlier, extremely bloated.

#### Why these metrics?

Though many other metrics play into performance, these metrics address key components that are detrimental to performance.

**LCP** - Tracks how long it takes to load the largest content on the page. This is usually the "above the fold" content.

**TTI** - Tracks how long it takes before the page is interactable.

**CLS** - Tracks visual stability.

_Also, note that these metrics are vital to obtaining a good Lighthouse score._[read more](https://web.dev/vitals/).

#### How to track these metrics

We identified Lighthouse as the main tool to track the above metrics. [Lighthouse](https://developers.google.com/web/tools/lighthouse) is an open-source tool provided by Google.

This tool is available in 3 different forms -

1. It is available in the Chrome browser under the dev-tools.
2. It is available as an npm package that can be run on the [CLI](https://www.npmjs.com/package/lighthouse).
3. It is available on the [web](https://web.dev/measure/).

Google also provides a [web-vitals](https://github.com/GoogleChrome/web-vitals) library that enables you to use in your React-App to collect the above metrics as Real User Metrics (RUM).

We observed that each of these tools gave different metric results for a given page. So it'll be a good idea to decide early on which tool works best for you.

At the time of writing this article, we decided to use the Chrome dev-tool version of Lighthouse in the interest of time, with plans for an automated/triggered pipeline for Lighthouse tests.

We also monitored our results on [WebPageTest.org](https://webpagetest.org/) to track other vital metrics, like file size, Time To First, performance on subsequent requests, etc.

## How to improve performance?

While the metrics discussed above give some insight into areas that need improvement, to identify possible opportunities within a React App, [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) is just the tool for the task.

![image-2020-08-05-09-30-59-120-1](/content/images/2020/08/image-2020-08-05-09-30-59-120-1.png)

As you can see our internal library (bbyca) was duplicated multiple times.

There were two reasons for this behaviour -

- For one we started using strict versions (not following semantic versioning standards), i.e instead of using `<package-name>: "^x.x.x"` we started removing the "^" from a maintainability standpoint. _(not that I particularly agree with the idea, but that's a discussion for another time)_.
- And to make matters worse each internal package used a different version of bbyca.

These two points together made it impossible for npm and/or Webpack to deduplicate these internal packages. Thus bloating our vendor file(s).

Now there are multiple ways to solve this. In most cases avoiding the above mentioned bad practices would usually steer you clear of these issues. What we chose to do was to slowly move our internal packages into a mono-repo to enable package version synchronization across our internal packages (and apps in the future).

This greatly reduced our vendor file size (by about 50%). And of course, that intern did yield some performance gains.

metricsbeforeAfterLighthouse performance3249First Contentful Paint0.9s0.8sTime to Interactive5.0s4.3sSpeed Index2.9s2.7sLargest Contentful Paint3.5s1.5s
Stay tuned for more on how to reduce the bundle size in part II (coming soon).

> If you like what you have read so far please like, share & subscribe. If you have questions feel free to leave a comment and I'll try my best to respond at the earliest. ✌️
