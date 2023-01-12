import * as React from 'react'
import { Link, graphql, PageProps } from 'gatsby'

import Bio from '../components/bio'
import Layout from '../components/layout'
import Seo from '../components/seo'

type DataProps = {
  site: {
    siteMetadata: {
      title: string
    }
  }
  mdx: {
    id: string
    excerpt: string
    html: string
    frontmatter: {
      title: string
      date_published: string
      date_updated: string
      description: string
      slug: string
      tags: string
    }
  }
  prev: {
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
      slug: string
    }
  }
  next: {
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
      slug: string
    }
  }
}

type Post = {
  id: string
  fields: {
    slug: string
  }
}

const BlogPostTemplate: React.FC<PageProps<DataProps>> = ({
  data,
  location,
  children,
}) => {
  const { prev, next, site, mdx: post } = data
  const siteTitle = site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>
            {post.frontmatter.date_published}
            {post.frontmatter?.date_updated && (<small style={{ fontStyle: 'italic', paddingLeft: '15px' }}>(last updated: {post.frontmatter?.date_updated})</small>)}
          </p>
        </header>
        <section itemProp="articleBody">{children}</section>
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {prev && (
              <Link to={`/post/${prev.frontmatter.slug}`} rel="prev">
                ← {prev.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`/post/${next.frontmatter.slug}`} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head: React.FC<PageProps<DataProps>> = ({
  data: { mdx: post },
}) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      tags={post.frontmatter?.tags}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    mdx(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      frontmatter {
        title
        date_published(formatString: "MMMM DD, YYYY")
        date_updated(formatString: "MMMM DD, YYYY")
        slug
        tags
      }
    }
    prev: mdx(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        slug
      }
    }
    next: mdx(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        slug
      }
    }
  }
`
