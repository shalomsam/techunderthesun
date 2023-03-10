/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */
// import type { GatsbyConfig } from "gatsby"

const rehypeMetaAsAttributes = require(`./rehype-meta-as-attributes`)

const config = {
  siteMetadata: {
    title: `TechUnderTheSun`,
    author: {
      name: `Shalom Sam`,
      summary: `, a Software Engineer at heart and working as a Technology Manager based in Vancouver, building and learning new tech everyday.`,
    },
    description: `A personal blog to ink out my thoughts and observations of the tech space. Also a place to document tutorials as I play with new technology tools, frameworks, etc. from time to time.`,
    siteUrl: `https://techunderthesun.in/`,
    social: {
      twitter: ``,
      github: `shalomsam`,
      linkedin: `shalomsam`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sitemap`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/content/pages`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
        ],
        mdxOptions: {
          rehypePlugins: [rehypeMetaAsAttributes],
        },
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map((node) => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: `${site.siteMetadata.siteUrl}/${node.frontmatter.slug}`,
                  guid: Buffer.from(
                    `${site.siteMetadata.siteUrl}/${node.frontmatter.slug}`
                  ).toString('base64'),
                  custom_elements: [{ 'content:encoded': node.html }],
                })
              })
            },
            query: `{
              allMdx(filter: {internal: { contentFilePath: { regex: "/(/blog/)/" } }}, sort: {frontmatter: {date_published: DESC}}) {
                nodes {
                  excerpt
                  frontmatter {
                    title
                    date_published
                  }
                }
              }
            }`,
            output: '/rss.xml',
            title: 'Gatsby Starter Blog RSS Feed',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `Gatsby`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
          shortname: `techunderthesun-in`
      }
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ['G-8C58XHPTLZ']
      }
    }
  ],
}

module.exports = config
