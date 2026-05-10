import { AppSemaphore } from "./semaphore/app-semaphore.util";

export enum RateLimitMode {
  AtRequest = 1,
  AtCompletion = 2,
}

export type RateLimiterOptions = {
  key: string;
  quota: number;
  perMilliseconds: number;
  mode?: RateLimitMode;
};

export type ExecuteOptions = {
  cost?: number;
};

export class RateLimiter {
  private semaphore;
  private perMilliseconds;
  private mode;
  private signal = 0;

  constructor({ key, quota, perMilliseconds, mode = RateLimitMode.AtCompletion }: RateLimiterOptions) {
    this.semaphore = new AppSemaphore(key, quota);
    this.perMilliseconds = perMilliseconds;
    this.mode = mode;
  }

  async execute<R>(action: () => Promise<R>, options: ExecuteOptions = {}) {
    const { cost = 1 } = options;
    const signal = this.signal;

    const release = await this.semaphore.acquire(cost);
    if (signal < this.signal) {
      release();
      throw new Error("Execution cancelled");
    }

    const endTime = Date.now() + this.perMilliseconds;
    let ans;
    let err;
    try {
      ans = await action();
    } catch (e) {
      err = e;
    }

    if (this.mode === RateLimitMode.AtRequest) {
      const rest = endTime - Date.now();
      if (rest > 0) {
        setTimeout(release, rest);
      } else {
        release();
      }
    } else {
      setTimeout(release, this.perMilliseconds);
    }

    if (err) {
      throw err;
    }
    return ans as Awaited<R>;
  }

  async cancelAll() {
    this.signal++;
  }
}
