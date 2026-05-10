export const REDIS_CLIENT = "REDIS_CLIENT";
export const USER_CACHE_TTL = 300;
export const ROLE_PERMISSIONS_CACHE_TTL = 300;

export const userCacheKey = (id: number) => `auth:user:${id}`;
export const userRolesCacheKey = (id: number) => `auth:user:roles:${id}`;
export const roleCacheKey = (id: number) => `auth:role:permissions:${id}`;
