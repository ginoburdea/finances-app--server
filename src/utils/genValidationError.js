import { GraphQLError } from 'graphql'

export const genValidationError = (field, message) => {
    return new GraphQLError(message, {
        extensions: { code: 'GRAPHQL_VALIDATION_FAILED' },
        path: [field],
    })
}
