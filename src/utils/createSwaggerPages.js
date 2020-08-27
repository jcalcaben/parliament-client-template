const { GET_ALL_SWAGGER_INFO } = require('./createSwaggerPages.graphql')
/**
 * Creates pages from the swagger files in the project
 * 
 * @param {Object} props 
 */
const createSwaggerPages = async props => {

    const { nodeApiHelpers, swaggerSourcePatterns } = props;

    const { actions, graphql } = nodeApiHelpers;

    // Don't do anything if source patterns are not defined
    if (!swaggerSourcePatterns) {
        return;
    }

    const { data } = await graphql(GET_ALL_SWAGGER_INFO);

    const swaggerFiles = data.info.nodes;

}

module.exports = createSwaggerPages;