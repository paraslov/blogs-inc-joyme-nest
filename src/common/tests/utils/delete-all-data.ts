import { DataSource } from 'typeorm'

export const deleteAllData = async (dataSource: DataSource | null) => {
  if (dataSource) {
    await dataSource.query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE devices RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE posts RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE blogs RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE comments RESTART IDENTITY CASCADE`)
    await dataSource.query(`TRUNCATE TABLE likes RESTART IDENTITY CASCADE`)
  //   await dataSource.query(`
  //   DO $$
  //     BEGIN
  //       IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
  //         DELETE FROM public.users;
  //       END IF;
  //   END $$;
  // `)
  //   await dataSource.query(`
  //   DO $$
  //     BEGIN
  //       IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'devices')
  //       THEN
  //         DELETE FROM public.devices;
  //       END IF;
  //   END $$;
  // `)
  //   await dataSource.query(`
  //   DO $$
  //     BEGIN
  //       IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts')
  //       THEN
  //         DELETE FROM public.posts;
  //       END IF;
  //   END $$;
  // `)
  //   await dataSource.query(`
  //   DO $$
  //     BEGIN
  //       IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blogs')
  //       THEN
  //         DELETE FROM public.blogs;
  //       END IF;
  //   END $$;
  // `)
  //   await dataSource.query(`
  //   DO $$
  //     BEGIN
  //       IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comments')
  //       THEN
  //         DELETE FROM public.comments;
  //       END IF;
  //   END $$;
  // `)
  //   await dataSource.query(`
  //   DO $$
  //     BEGIN
  //       IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'likes')
  //       THEN
  //         DELETE FROM public.likes;
  //       END IF;
  //   END $$;
  // `)
  }
}
