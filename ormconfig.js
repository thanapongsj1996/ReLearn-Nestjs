require("dotenv").config()
const PostgressConnectionStringParser = require("pg-connection-string")


let config
let environment = process.env.NODE_ENV || 'production'
if (environment === 'production') {
    const databaseUrl = process.env.DATABASE_URL
    const connectionOptions = PostgressConnectionStringParser.parse(databaseUrl);

    config = {
        type: "postgres",
        host: connectionOptions.host,
        port: connectionOptions.port,
        username: connectionOptions.username,
        password: connectionOptions.password,
        database: connectionOptions.database,
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