import * as React from 'react'
import { Link } from 'gatsby'

declare const __PATH_PREFIX__: string

type LayoutProps = {
  title: string
  location: {
    pathname: string
  }
  children: JSX.Element | JSX.Element[]
}

const Layout: React.FunctionComponent<LayoutProps> = ({
  location,
  title,
  children,
}) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const siteTitle = title || `TechUnderTheSun`
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{siteTitle}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {siteTitle}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer className="footer">
        <span style={{ verticalAlign: 'text-top' }}>&copy;</span>{' '}
        {new Date().getFullYear()} {siteTitle}
      </footer>
    </div>
  )
}

export default Layout
