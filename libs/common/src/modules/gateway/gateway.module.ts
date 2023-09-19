import {Module} from '@nestjs/common';
import {ApiConfigModule} from '../api-config/api.config.module';

import {ApiModule} from '@multiversx/sdk-nestjs-http';
import {GatewayService} from './gateway.service';

@Module({
  imports: [
    ApiConfigModule,
    ApiModule,
  ],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
