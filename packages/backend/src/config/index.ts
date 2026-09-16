import { readFileSync } from "fs";
import yaml from "js-yaml";
import { join } from "path";

const configFileNameObj = {
  development: "dev",
  test: "test",
  production: "prod",
  docker: "docker",
};

const env = process.env.NODE_ENV;

export default () => {
  const config = yaml.load(
    readFileSync(join(__dirname, `./${configFileNameObj[env]}.yml`), "utf8")
  ) as Record<string, any>;

  // docker / 生产环境支持通过环境变量覆盖关键配置
  if (env === "docker" || env === "production") {
    config.db.mysql.password =
      process.env.MYSQL_ROOT_PASSWORD || config.db.mysql.password;
    config.app.port = Number(process.env.APP_PORT) || config.app.port;
    config.app.file.location =
      process.env.UPLOAD_LOCATION || config.app.file.location;
  }

  return config;
};
