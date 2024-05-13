const genErr = str => ({
    errors: [{ message: str }],
})

export const errors = {
    notFound: genErr('Route not found'),
    unknown: genErr('An unknown error appeared. Please try again later.'),
}
