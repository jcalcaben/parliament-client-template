const path = require("path")
const glob = require("fast-glob")
const SwaggerParser = require("@apidevtools/swagger-parser")

const createInfoNode = require("./src/createInfoNode")
const createPathNodes = require("./src/createPathNodes")
const createDefinitionNodes = require("./src/createDefinitionNodes")

/**
 * Taps into Gatsby's `sourceNodes` lifecycle to create nodes from a source.
 *
 * This plugin creates GraphQL nodes from swagger/openapi files in a project.
 *
 * @param {Object} nodeApiHelpers [Node API Helpers]{@link https://www.gatsbyjs.com/docs/node-api-helpers/}
 * @param {Object} pluginOptions Options for this plugin
 * @param {String} pluginOptions.contentRoot The root directory to begin the search for swagger/openapi files.
 * This files must be available as a Gatsby file source through a plugin such as `gatsby-source-filesystem`.
 * @param {String} pluginOptions.sourcePatterns A comma-separated string of glob patterns used for searching for swagger/openapi files.
 *
 * @see {@link https://www.gatsbyjs.com/docs/creating-a-source-plugin/}
 * @see {@link https://www.gatsbyjs.com/docs/node-apis/#sourceNodes}
 */
exports.sourceNodes = async (nodeApiHelpers, pluginOptions) => {
  const {
    actions,
    createContentDigest,
    createNodeId,
    getNodesByType,
  } = nodeApiHelpers

  const fileNodes = getNodesByType("File")

  const { createNode, createParentChildLink } = actions

  const gatsbyApi = {
    createNodeId,
    createContentDigest,
  }

  const { contentRoot, sourcePatterns } = pluginOptions

  const globOptions = {
    cwd: contentRoot,
    nodir: true,
  }

  const patternsArray = sourcePatterns.split(",")

  const swaggerFiles = glob.sync(patternsArray, globOptions)

  swaggerFiles.forEach(parentFile => {
    const parentFileInfo = path.parse(parentFile)

    const { dir, base } = parentFileInfo

    const parentFilePath = path.resolve(contentRoot, dir, base)

    const parentFileNode = fileNodes.find(
      fileNode => fileNode.absolutePath === parentFilePath
    )

    SwaggerParser.parse(parentFilePath).then(swaggerObject => {
      const infoNode = createInfoNode({
        swaggerObject,
        parentFile: parentFileNode,
        gatsbyApi,
      })
      const pathNodes = createPathNodes({
        swaggerObject,
        parentFile: parentFileNode,
        gatsbyApi,
      })
      const definitionNodes = createDefinitionNodes({
        swaggerObject,
        parentFile: parentFileNode,
        gatsbyApi,
      })

      const newNodes = [infoNode, ...pathNodes, ...definitionNodes]

      newNodes.forEach(newNode => {
        createNode(newNode)
        createParentChildLink({ parent: parentFileNode, child: newNode })
      })
    })
  })
}

/**
 * Taps into the Gatsby API for customizing the generated schema.
 *
 * This plugin tells Gatsby to interpret specific properties as JSON objects.
 * The value for these properties do not follow a specific
 * object shape, so it's best to interpret them as JSON objects
 * to make querying the data easier.
 *
 * @param {Object} nodeApiHelpers [Node API Helpers]{@link https://www.gatsbyjs.com/docs/node-api-helpers/}
 *
 * @see {@link https://www.gatsbyjs.com/docs/node-apis/#createSchemaCustomization}
 * @see {@link https://www.gatsbyjs.com/docs/schema-customization/}
 * @see {@link https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject}
 */
exports.createSchemaCustomization = nodeApiHelpers => {
  const { actions } = nodeApiHelpers

  const { createTypes } = actions

  const typeDefs = `
    type SwaggerOpenApiPathOperations {
        parameters: JSON
        responses: JSON
    }

    type SwaggerOpenApiDefinition implements Node {
        schema: JSON
    }
  `
  createTypes(typeDefs)
}
