import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { dbConfig } from './settings/config/db.config'

config()

const migrationOptions: DataSourceOptions = {
  ...dbConfig,
  migrations: [__dirname + '/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
} as DataSourceOptions

export default new DataSource(migrationOptions)
