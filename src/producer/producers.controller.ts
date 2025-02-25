import { Controller, Get, Inject } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('api/producer')
export class ProducerController {
  constructor(
    private readonly producerService: ProducerService,
  ) { }

  @Get('range-awards')
  public async getRangeAwards(): Promise<ResultsProducerAwards> {
    return this.producerService.getProducerWithAwardRange();
  }
}
