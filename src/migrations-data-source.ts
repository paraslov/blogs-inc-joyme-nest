import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { dbConfig } from './settings/config/db.config'
import * as path from 'path'

config()

console.log('@> dbVOnfig: ', dbConfig)
const entitiesPath = path.resolve(__dirname, '../**/*.entity.{ts,js}')

const migrationOptions: DataSourceOptions = {
  ...dbConfig,
  migrations: [__dirname + '/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
} as DataSourceOptions

console.log('@> migOpti: ', migrationOptions)

const dataSource = new DataSource(migrationOptions)

console.log('Entities loaded:', dataSource.options.entities)

export default dataSource
