import { Module } from '@nestjs/common';
import { movieProviders } from './movie.providers';
import { MovieService } from './movie.service';
import { DatabaseModule } from '../core/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [MovieService, ...movieProviders],
  exports: [MovieService, ...movieProviders],
})
export class MovieModule {}
