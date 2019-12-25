/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        position: "absolute",
        top: 100,
        right: 0,
        left: 0,
        margin: `0 auto`,
        maxWidth: 960,
        padding: 15,
        fontWeight: "bold",
        letterSpacing: 0.2,
        lineHeight: 1.4,
      }}
    >
      <Header siteTitle={data.site.siteMetadata.title} />

      <main>{children}</main>
      <footer style={{ backgroundColor: "white" }}>
        Doug the type of guy to have a website footer.
      </footer>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
