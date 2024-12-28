import { DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'
import * as process from 'process'
import { Environments } from '../env.settings'

config()

const isTesting = process.env.ENV === Environments.TEST
const isDevelopment = process.env.ENV === Environments.DEVELOPMENT
const ssl =
  process.env.ENV === Environments.PRODUCTION
    ? {
        rejectUnauthorized: false,
      }
    : undefined

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER_NAME,
  password: process.env.POSTGRES_USER_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  ssl,
  synchronize: isTesting, // process.env.DB_AUTOSYNC, // turn on for .env.testing,  но желательно
  // чтобы тестовый сервер (Gitlab CI, Jenkins чтобы он переопределяли эту настройку на false
  // и накатывал миграции
  logging: isTesting || isDevelopment,
}
