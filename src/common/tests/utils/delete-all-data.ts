import { Connection } from 'mongoose'
import { DataSource } from 'typeorm'

export const deleteAllData = async (databaseConnection: Connection, dataSource: DataSource) => {
  await databaseConnection.collection('users').deleteMany({})
  await databaseConnection.collection('blogs').deleteMany({})
  await databaseConnection.collection('posts').deleteMany({})
  await databaseConnection.collection('comments').deleteMany({})
  await databaseConnection.collection('likes').deleteMany({})

  await dataSource.query(`
    DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
          DELETE FROM public.users;
        END IF;
    END $$;
  `)
}
