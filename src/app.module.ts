import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './common/modules/file/file.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    // 통합된 설정 및 데이터베이스 모듈
    AppConfigModule,
    // 정적 파일 제공 모듈
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    // 기능 모듈
    UsersModule,
    AuthModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 모든 경로에 로거 미들웨어 적용
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
