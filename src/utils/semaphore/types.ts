import { LockOptions } from "redis-semaphore";

export type AppMutexWorker<T> = () => Promise<T> | T;

export type AppMutexOptions = Pick<LockOptions, "lockTimeout" | "acquireTimeout">;
