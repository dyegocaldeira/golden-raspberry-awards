import { Module } from '@nestjs/common';
import { StudioService } from './studio.service';
import { studioProviders } from './studio.providers';
import { DatabaseModule } from '../core/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [StudioService, ...studioProviders],
  exports: [StudioService, ...studioProviders],
})
export class StudioModule {}
