/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { graphql } from "gatsby"
import DocLayout from "../components/doclayout"
import { Footer } from "@parliament/parliament-ui-components"
import PageActions from "../components/PageActions"
import SiteNav from "../components/SiteNav"
import SEO from "../components/seo"
import renderAst from "../utils/AFMRehype"

import "../components/recipe.css"

import { Grid, GridContent, GridNav, GridFooter } from "../components/grid/Grid"

const MarkdownTemplate = props => {
  const { file } = props.data
  const { modifiedTime, relativePath, childMarkdownRemark } = file
  const { htmlAst, tableOfContents, timeToRead } = childMarkdownRemark

  const gitRemote = props.pageContext.gitRemote

  return (
    <DocLayout>
      <SEO title={props.pageContext.seo} />
      <Grid>
        <GridNav className="spectrum--light">
          <SiteNav
            currentPage={props.location.pathname}
            gitRemote={gitRemote}
          />
        </GridNav>
        <GridContent>
          <div class="recipeContent">{renderAst(htmlAst)}</div>
        </GridContent>
        <GridFooter>
          <Footer />
        </GridFooter>
      </Grid>
    </DocLayout>
  )
}

export default MarkdownTemplate

export const query = graphql`
  query MarkdownTemplateQuery2($id: String!) {
    file(id: { eq: $id }) {
      id
      modifiedTime(formatString: "YYYY-MM-DD")
      name
      relativePath
      childMarkdownRemark {
        htmlAst
        tableOfContents
        timeToRead
      }
    }
  }
`