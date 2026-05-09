import { isArray } from "lodash";

export function updateEntity<E, U>(entity: E, update: E | U): E | U {
  if (
    typeof update === "object" &&
    typeof entity === "object" &&
    !(update instanceof Date) &&
    !(entity instanceof Date) &&
    update !== null &&
    entity !== null
  ) {
    if (isArray(update)) {
      // @ts-ignore
      return update.map((each, i) => updateEntity(entity[i], each)) as E;
    }
    for (const key in update) {
      // @ts-ignore
      entity[key] = updateEntity(entity[key], update[key]);
    }
    return entity;
  }
  return update === undefined ? entity : update;
}
