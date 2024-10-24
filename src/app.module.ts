import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BlogsModule } from './features/blogs/blogs.module'
import { MongooseModule } from '@nestjs/mongoose'
import { PostsModule } from './features/posts/posts.module'
import { UsersModule } from './features/users/users.module'
import { CommentsModule } from './features/comments'
import { AuthModule } from './features/auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration, { ConfigurationType, validate } from './settings/configuration'
import { Environments } from './settings/env.settings'
import { ThrottlerModule } from '@nestjs/throttler'
import { LikesModule } from './features/likes/likes.module'
import { JwtMiddleware } from './base/middlewares'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    AuthModule,
    BlogsModule,
    PostsModule,
    UsersModule,
    CommentsModule,
    LikesModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 10000,
        limit: 5,
      },
    ]),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigurationType>) => {
        const databaseSettings = configService.get('databaseSettings', {
          infer: true,
        })!

        const uri = databaseSettings.MONGO_CONNECTION_URI
        const dbName = databaseSettings.DB_NAME

        return {
          uri,
          dbName,
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      ignoreEnvFile: process.env.ENV !== Environments.DEVELOPMENT && process.env.ENV !== Environments.TEST,
      envFilePath: ['.env.local', '.env.development', '.env'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtMiddleware, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({ path: '*', method: RequestMethod.GET })
  }
}
