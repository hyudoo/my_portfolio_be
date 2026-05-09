import { join } from "path";
import { options } from "./orm.config";

const seederOptions: any = {
  ...options,
  seeds: [join(__dirname, "/seeders/*{.ts,.js}")],
  factories: [join(__dirname, "/factories/*{.ts,.js}")],
};

export default seederOptions;
