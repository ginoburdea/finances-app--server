/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const errorLoggerMiddleware = function (req, res, next) {
    const oldWrite = res.write
    const oldEnd = res.end

    const chunks = []

    res.write = function (chunk) {
        chunks.push(Buffer.from(chunk))
        return oldWrite.apply(res, arguments)
    }

    res.end = function (chunk) {
        if (chunk) chunks.push(Buffer.from(chunk))

        try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))

            const graphqlQuery = req.body.query
                .replaceAll('\n', '')
                .replaceAll('\r', '')
                .replaceAll(' ', '')

            const matcher =
                /(?<=(?<operationType>mutation|query).*{)(?<operation>[^\({]+)/

            const parsed = matcher.exec(graphqlQuery)

            if (body?.errors) {
                const error = body.errors
                req.log.warn({
                    msg: 'graphql error',
                    context: 'graphql',
                    err: error?.extensions?.code || error.message,
                    ...parsed.groups,
                })
            } else if (body?.data) {
                req.log.info({
                    msg: 'graphql success',
                    context: 'graphql',
                    ...parsed.groups,
                })
            }
        } catch (err) {}

        oldEnd.apply(res, arguments)
    }

    next()
}
