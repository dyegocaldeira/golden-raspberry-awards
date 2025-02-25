import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { CsvService } from './core/csv-file/csv.service';
import { ImportCSVProvider } from './core/csv-file/import-csv.provider';
import { ProducerModule } from './producer/producer.module';
import { StudioModule } from './studio/studio.module';

@Module({
  imports: [
    MovieModule,
    ProducerModule,
    StudioModule
  ],
  controllers: [],
  providers: [
    AppService,
    CsvService,
    ImportCSVProvider
  ],
})
export class AppModule { }
