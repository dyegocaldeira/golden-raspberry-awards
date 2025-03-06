import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { IResultsProducerAwards } from './producer.interface';

@Controller('api/producer')
export class ProducerController {
  constructor(
    private readonly producerService: ProducerService,
  ) { }

  @Get('range-awards')
  public async getRangeAwards(): Promise<IResultsProducerAwards> {
    return this.producerService.getProducerWithAwardRange();
  }
}
