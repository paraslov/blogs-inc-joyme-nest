import { DataSource } from 'typeorm'

export async function createTablesIfNeeded(dataSource: DataSource) {
  try {
    await createUsersTable(dataSource)
    await createBlogsTable(dataSource)
    await createPostsTable(dataSource)
    await createDevicesTable(dataSource)
    await createCommentsTable(dataSource)
    await createLikesTable(dataSource)
  } catch (err) {
    console.log('@> CREATE TABLES ERROR: ', err)
    throw 'CREATE TABLES ERROR (createDbAndTables)'
  }

  console.log('@> CREATE TABLES SUCCESS')
}

async function createUsersTable(dataSource: DataSource) {
  await dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.users
        (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            email character varying(255) NOT NULL,
            login character varying(10) NOT NULL,
            password_hash character varying(255) NOT NULL,
            created_at timestamp without time zone NOT NULL DEFAULT NOW(),
            CONSTRAINT login UNIQUE (login),
            CONSTRAINT email UNIQUE (email),
            PRIMARY KEY (id)
        );
  
      ALTER TABLE IF EXISTS public.users
          OWNER to sa_sql_user;
    `)

  await dataSource.query(`
        CREATE TABLE IF NOT EXISTS public.users_confirmation_info
          (
              user_id uuid NOT NULL,
              confirmation_code uuid NOT NULL,
              confirmation_code_expiration_date timestamp without time zone NOT NULL,
              is_confirmed boolean NOT NULL,
              password_recovery_code uuid,
              password_recovery_code_expiration_date timestamp without time zone,
              is_password_recovery_confirmed boolean,
              PRIMARY KEY (user_id),
              CONSTRAINT link_with_users FOREIGN KEY (user_id)
                  REFERENCES public.users (id) MATCH SIMPLE
                  ON UPDATE NO ACTION
                  ON DELETE CASCADE
                  NOT VALID
          );

        ALTER TABLE IF EXISTS public.users_confirmation_info
            OWNER to sa_sql_user;
    `)
}

async function createBlogsTable(dataSource: DataSource) {
  await dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.blogs
        (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            name character varying(15) NOT NULL,
            description character varying(500) NOT NULL,
            website_url character varying(100) NOT NULL,
            created_at timestamp without time zone,
            is_membership boolean DEFAULT false,
            PRIMARY KEY (id)
        );

      ALTER TABLE IF EXISTS public.blogs
          OWNER to sa_sql_user;
    `)
}

async function createPostsTable(dataSource: DataSource) {
  await dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.posts
        (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            title character varying(30) NOT NULL,
            short_description character varying(100) NOT NULL,
            content character varying(1000) NOT NULL,
            blog_id uuid NOT NULL,
            blog_name character varying(15) NOT NULL,
            created_at timestamp without time zone,
            likes_count integer,
            dislikes_count integer,
            PRIMARY KEY (id),
            CONSTRAINT link_with_blogs FOREIGN KEY (blog_id)
                REFERENCES public.blogs (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID
        );

      ALTER TABLE IF EXISTS public.posts
        OWNER to sa_sql_user;
    `)
}

async function createDevicesTable(dataSource: DataSource) {
  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS public.devices
      (
          device_id uuid NOT NULL,
          device_name character varying(255) NOT NULL,
          user_id uuid NOT NULL,
          ip character varying(255) NOT NULL,
          iat integer,
          exp integer,
          PRIMARY KEY (device_id)
      );

      ALTER TABLE IF EXISTS public.devices
          OWNER to sa_sql_user;
    `)
}

async function createCommentsTable(dataSource: DataSource) {
  await dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.comments
        (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            parent_id uuid NOT NULL,
            content character varying(300) NOT NULL,
            created_at timestamp without time zone NOT NULL,
            user_id uuid NOT NULL,
            user_login character varying(10) NOT NULL,
            likes_count integer,
            dislikes_count integer,
            PRIMARY KEY (id)
        );

      ALTER TABLE IF EXISTS public.comments
          OWNER to sa_sql_user;
    `)
}

async function createLikesTable(dataSource: DataSource) {
  await dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.likes
        (
            parent_id uuid NOT NULL,
            status character varying(30) NOT NULL,
            created_at timestamp without time zone NOT NULL,
            user_id uuid NOT NULL,
            user_login character varying(10) NOT NULL,
            PRIMARY KEY (parent_id, user_id)
        );

      ALTER TABLE IF EXISTS public.likes
          OWNER to sa_sql_user;
    `)
}
