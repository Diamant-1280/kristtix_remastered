declare global {
    namespace NodeJS {
        interface ProcessEnv {
            token: string
            TOTAL_SHARDS: string
            dataURL: string
            PORT: string
        }
    }
}

export {}