require("dotenv").config()


let config
let environment = process.env.NODE_ENV || 'production'
if (environment === 'production') {
    config = {
        type: "postgres",
        url: process.env.DATABASE_URL,
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: true,
        cli: {
            migrationsDir: "src/migration"
        }
    }
} else if (environment === 'dev') {
    config = {
        type: "postgres",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: true,
        cli: {
            migrationsDir: "src/migration"
        }
    }
}

module.exports = config