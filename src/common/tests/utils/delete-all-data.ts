import { Connection } from 'mongoose'
import { DataSource } from 'typeorm'

export const deleteAllData = async (databaseConnection: Connection | null, dataSource: DataSource | null) => {
  if (databaseConnection) {
    await databaseConnection.collection('users').deleteMany({})
    await databaseConnection.collection('blogs').deleteMany({})
    await databaseConnection.collection('posts').deleteMany({})
    await databaseConnection.collection('comments').deleteMany({})
    await databaseConnection.collection('likes').deleteMany({})
  }

  if (dataSource) {
    await dataSource.query(`
    DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
          DELETE FROM public.users;
        END IF;
    END $$;
  `)
    await dataSource.query(`
    DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'devices') 
        THEN
          DELETE FROM public.devices;
        END IF;
    END $$;
  `)
    await dataSource.query(`
    DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') 
        THEN
          DELETE FROM public.posts;
        END IF;
    END $$;
  `)
    await dataSource.query(`
    DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blogs') 
        THEN
          DELETE FROM public.blogs;
        END IF;
    END $$;
  `)
  }
}
