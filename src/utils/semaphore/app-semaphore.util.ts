import { MultiSemaphore } from "redis-semaphore";
import { redisClient } from "../../redis/redis.config";
import { AppMutexOptions, AppMutexWorker } from "./types";

export class AppSemaphore {
  protected options: AppMutexOptions;

  constructor(
    protected key: string,
    protected limit: number,
    options?: AppMutexOptions,
  ) {
    this.options = {
      acquireTimeout: 300_000,
      lockTimeout: 60_000,
      ...options,
    };
  }

  async tryAcquire(permits = 1) {
    const semaphore = new MultiSemaphore(redisClient, this.key, this.limit, permits, this.options);
    const acquired = await semaphore.tryAcquire();
    return [acquired, () => semaphore.release()];
  }

  async acquire(permits = 1) {
    const semaphore = new MultiSemaphore(redisClient, this.key, this.limit, permits, this.options);
    await semaphore.acquire();
    return () => semaphore.release();
  }

  async runExclusive<T>(callback: AppMutexWorker<T>, permits = 1) {
    const release = await this.acquire(permits);
    try {
      return await callback();
    } finally {
      release();
    }
  }
}
