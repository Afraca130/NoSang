import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import appConfig from './app.config';
import { getTypeOrmConfig } from './database.config';

/**
 * 애플리케이션 설정과 데이터베이스 설정을 통합한 모듈
 */
@Module({
  imports: [
    // 전역 설정 모듈
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    // 데이터베이스 모듈
    TypeOrmModule.forRootAsync({
      imports: [NestConfigModule.forFeature(appConfig)],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
  ],
})
export class AppConfigModule {}
