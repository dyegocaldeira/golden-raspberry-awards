import { Inject, Injectable } from '@nestjs/common';
import { Studios } from './studio.entity';
import { Repository } from 'typeorm';
import { StudioEnum } from './studio.enum';

@Injectable()
export class StudioService {
  constructor(
    @Inject(StudioEnum.STUDIO_REPOSITORY)
    private readonly studioRepository: Repository<Studios>,
  ) { }

  public async upsertStudio(studio: Studios): Promise<Studios> {
    const databaseStudio = await this.studioRepository.findOne({
      where: {
        name: studio.name,
      },
    });

    return databaseStudio ?? this.studioRepository.save(studio);
  }
}
