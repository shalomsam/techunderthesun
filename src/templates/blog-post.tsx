import * as React from "react"
import { Link, graphql, PageProps } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

type DataProps = {
  site: {
    siteMetadata: {
      title: string,
    }
  }
  markdownRemark: {
    id: string,
    excerpt: string,
    html: string,
    frontmatter: {
      title: string,
      date_published: string,
      description: string,
      slug: string,
    }
  }
  prev: {
    fields:{
      slug: string,
    },
    frontmatter: {
      title: string,
      slug: string,
    }
  }
  next: {
    fields: {
      slug: string,
    },
    frontmatter: {
      title: string,
      slug: string,
    }
  }
}

type Post = {
  id: string,
  fields: {
    slug: string,
  }
}

const BlogPostTemplate: React.FC<PageProps<DataProps>> = ({
  data,
  location,
}) => {
  const { prev, next, site, markdownRemark: post } = data;
  const siteTitle = site.siteMetadata?.title || `Title`;

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date_published}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
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

export const Head: React.FC<PageProps<DataProps>> = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
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
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date_published(formatString: "MMMM DD, YYYY")
        slug
      }
    }
    prev: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        slug
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
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
