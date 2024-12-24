import { DataSource } from 'typeorm'

export const deleteAllData = async (dataSource: DataSource | null) => {
  if (dataSource) {
    await dataSource.query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE devices RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE posts RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE blogs RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE comments RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE likes RESTART IDENTITY CASCADE`)
  }
}
