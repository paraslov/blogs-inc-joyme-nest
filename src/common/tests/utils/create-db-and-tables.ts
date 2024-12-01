import { DataSource } from 'typeorm'
import { DatabaseSettings } from '../../../settings/date-base.settings'

export async function createDbAndTables(dataSource: DataSource, dataBaseSettings: DatabaseSettings) {
  try {
    await createUser(dataSource, dataBaseSettings)
    await createDb(dataSource, dataBaseSettings)
    await createTables(dataSource)
  } catch (err) {
    console.log('@> CREATE BD ERROR: ', err)
    throw 'CREATE BD ERROR (createDbAndTables)'
  }

  console.log('@> CREATE BD SUCCESS')
}

async function createUser(dataSource: DataSource, dataBaseSettings: DatabaseSettings) {
  await dataSource.query(
    `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_roles WHERE rolname = $1
      ) THEN
        CREATE ROLE $1 WITH
          LOGIN
          SUPERUSER
          CREATEDB
          CREATEROLE
          INHERIT
          REPLICATION
          BYPASSRLS
          CONNECTION LIMIT -1
          PASSWORD $2;
      END IF;
    END $$;
`,
    [dataBaseSettings.POSTGRES_USER_NAME, dataBaseSettings.POSTGRES_USER_PASSWORD],
  )
}

async function createDb(dataSource: DataSource, dataBaseSettings: DatabaseSettings) {
  await dataSource.query(
    `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_database WHERE datname = $1
      ) THEN
        CREATE DATABASE $1
        WITH
        OWNER = $2
        ENCODING = 'UTF8'
        LOCALE_PROVIDER = 'libc'
        CONNECTION LIMIT = -1
        IS_TEMPLATE = false;
      END IF;
    END $$;
  `,
    [dataBaseSettings.POSTGRES_DATABASE, dataBaseSettings.POSTGRES_USER_NAME],
  )
}

async function createTables(dataSource: DataSource) {
  await createUsersTable(dataSource)
  await createBlogsTable(dataSource)
  await createPostsTable(dataSource)
  await createDevicesTable(dataSource)
  await createCommentsTable(dataSource)
  await createLikesTable(dataSource)
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
            PRIMARY KEY (parent_id)
        );

      ALTER TABLE IF EXISTS public.likes
          OWNER to sa_sql_user;
    `)
}
