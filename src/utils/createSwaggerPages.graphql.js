const GET_ALL_SWAGGER_INFO = `
query getAllSwaggerInfo {
    info: allSwaggerOpenApiInfo {
        nodes {
            name
            parent {
                id
            }
        }
    }
}
`
module.exports = {
    GET_ALL_SWAGGER_INFO
}