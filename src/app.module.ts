import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BlogsModule } from './features/blogs/blogs.module'
import { MongooseModule } from '@nestjs/mongoose'
import { appSettings } from './settings/app.settings'
import { PostsModule } from './features/posts/posts.module'
import { UsersModule } from './features/users/users.module'
import { CommentsModule } from './features/comments'
import { AuthModule } from './features/auth/auth.module'

@Module({
  imports: [
    AuthModule,
    BlogsModule,
    PostsModule,
    UsersModule,
    CommentsModule,
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI, {
      dbName: appSettings.api.DB_NAME,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
