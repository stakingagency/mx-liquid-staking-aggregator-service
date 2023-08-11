// TODO add configs
import { ErdnestConfigService } from '@multiversx/sdk-nestjs-common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SdkNestJsConfigServiceImpl implements ErdnestConfigService {
  getSecurityAdmins(): string[] {
    return [];
    // return this.apiConfig.getNativeAuthAdmins().map((admin) => admin.address);
  }

  getJwtSecret(): string {
    return '';
  }

  getApiUrl(): string {
    return '';
    // return this.apiConfig.getMultiversXApiUrl();
  }

  getNativeAuthMaxExpirySeconds(): number {
    return 0;
    // return this.apiConfig.getNativeAuthMaxExpirySeconds();
  }

  getNativeAuthAcceptedOrigins(): string[] {
    return [];
    // return this.apiConfig.getNativeAuthAcceptedOrigins();
  }
}
