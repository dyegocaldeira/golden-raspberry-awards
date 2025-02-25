import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { producerProviders } from './producer.providers';
import { DatabaseModule } from '../core/database/database.module';
import { ProducerController } from './producers.controller';

@Module({
  imports: [DatabaseModule],
  providers: [ProducerService, ...producerProviders],
  exports: [ProducerService, ...producerProviders],
  controllers: [ProducerController],
})
export class ProducerModule {}
