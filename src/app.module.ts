import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './features/blogs/blogs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppSettings } from './settings/appSettings';

@Module({
  imports: [
    BlogsModule,
    MongooseModule.forRoot(AppSettings.MONGO_URI, {
      dbName: AppSettings.DB_NAME,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
