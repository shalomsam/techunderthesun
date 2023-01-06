/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Highlight, { defaultProps } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/nightOwl"

const Code: React.FC<any> = props => {
  const className = props.children.props.className || ""
  const code = props.children.props.children.trim()
  const language = className.replace(/language-/, "")
  const file = props.children.props.file

  const highlights = (lineIx: number) => {
    if (props.children.props.highlights) {
      return props.children.props.highlights.includes(lineIx)
    }
    return false
  }

  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={language}
      theme={theme as any}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            ...{
              borderRadius: "8px",
              padding: "0 15px 15px",
              whiteSpace: "pre-wrap",
            },
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                padding: "5px 10px 5px",
                backgroundColor: "#C792EA",
                color: "#fff",
                borderRadius: "0 0 8px 8px",
                marginRight: "10px",
              }}
            >
              {language && language.toUpperCase()}
            </div>
            <div
              style={{
                fontStyle: "italic",
                padding: "5px",
              }}
            >
              {file && file}
            </div>
          </div>
          {tokens.map((line, i) => (
            <div
              {...getLineProps({ line, key: i })}
              style={{
                background: highlights(i) ? "#00f5c426" : "transparent",
                display: "block",
              }}
            >
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

const components = {
  pre: props => <Code {...props} />,
  wrapper: ({ children }) => <>{children}</>,
}

export const wrapRootElement = ({ element }) => {
  return <MDXProvider components={components}>{element}</MDXProvider>
}
