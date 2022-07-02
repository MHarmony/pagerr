import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environments/environment';
import { DatabaseLogger } from './logger/database.logger';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      logger: new DatabaseLogger(),
      host: environment.db.host,
      port: environment.db.port,
      username: environment.db.user,
      password: environment.db.pass,
      database: environment.db.database,
      autoLoadEntities: true,
      synchronize: !environment.production
    })
  ]
})
export class DatabaseModule {}
