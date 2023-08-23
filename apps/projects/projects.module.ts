import { Module } from '@nestjs/common';
import { DummyModule } from './dummy';

@Module({
  imports: [DummyModule],
  exports: [DummyModule],
})
export class ProjectsModule {}
