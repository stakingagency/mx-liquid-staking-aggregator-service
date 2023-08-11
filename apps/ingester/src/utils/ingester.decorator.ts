import { Cron } from '@nestjs/schedule';
import { BaseIngester } from './base.ingester';
import { IngesterInterval } from '../entities';

export interface DataApiIngesterOptions {
  name: string;
  cron: string;
  interval: IngesterInterval;
}

interface Decorated {
  tick(): Promise<void>;
}

export function DataApiIngester(options: DataApiIngesterOptions) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
    class DecoratedBaseIngester extends constructor {
      @Cron(options.cron)
      async tick(): Promise<void> {
        const ingester = this as unknown as BaseIngester;
        await ingester.run(options);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unsafe-declaration-merging
    interface DecoratedBaseIngester extends Decorated { }

    return DecoratedBaseIngester;
  };
}
