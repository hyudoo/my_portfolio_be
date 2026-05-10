import { Mutex } from "redis-semaphore";
import { redisClient } from "../../redis/redis.config";
import { AppMutexOptions, AppMutexWorker } from "./types";

export class AppMutex {
  protected options: AppMutexOptions;

  constructor(
    protected key: string,
    options?: AppMutexOptions,
  ) {
    this.options = {
      acquireTimeout: 300_000,
      lockTimeout: 60_000,
      ...options,
    };
  }

  async tryAcquire() {
    const mutex = new Mutex(redisClient, this.key, this.options);
    const acquired = await mutex.tryAcquire();
    return [acquired, () => mutex.release()];
  }

  async acquire() {
    const mutex = new Mutex(redisClient, this.key, this.options);
    await mutex.acquire();
    return () => mutex.release();
  }

  async runExclusive<T>(callback: AppMutexWorker<T>) {
    const release = await this.acquire();
    try {
      return await callback();
    } finally {
      release();
    }
  }
}
