import { configDotenv } from 'dotenv'

export const loadEnvironment = () => {
    if (process.env.NODE_ENV === 'production') return
    configDotenv()
}
