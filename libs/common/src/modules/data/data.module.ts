import { Module } from '@nestjs/common';
import { DataResolver } from './data.resolvers';
import { DataService } from './data.service';

@Module({
  imports: [
    // forwardRef(() => CommonModule),
  ],
  providers: [DataResolver, DataService],
  exports: [DataService],
})
export class DataModule {}
