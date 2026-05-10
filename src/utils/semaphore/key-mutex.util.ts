import { MutexInterface } from "async-mutex";
import { AppMutex } from "./app-mutex.util";
import { AppMutexOptions } from "./types";

export class KeyMutex {
  constructor(
    protected key: string,
    protected options?: AppMutexOptions,
  ) {}

  async tryAcquire(key: number | string) {
    const mutex = new AppMutex(`${this.key}/${key}`, this.options);
    return await mutex.tryAcquire();
  }

  async acquire(key: number | string) {
    const mutex = new AppMutex(`${this.key}/${key}`, this.options);
    return await mutex.acquire();
  }

  async runExclusive<T>(key: number | string, callback: MutexInterface.Worker<T>): Promise<T> {
    const mutex = new AppMutex(`${this.key}/${key}`, this.options);
    return await mutex.runExclusive(callback);
  }
}
