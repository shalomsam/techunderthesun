import chalk from "chalk";

export function stringifyObject(object: Object) {
  const cache = new WeakSet();

  let str = JSON.stringify(
    object,
    (_key: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (cache.has(value)) {
          return "[Circular]";
        }
        cache.add(value);
      }
      return value;
    },
    2
  );

  return str;
}

export default class Logger {
  static client = console;

  public static init = (_client: Console | any) => (Logger.client = _client);

  public static log = (...args: any) => Logger.info(args);

  public static logIf = (condition: boolean, ...args: any) =>
    condition && Logger.info(args);

  public static debug = (...args: any) => {
    if (process.env.DEBUG) {
      Logger.client.log(
        chalk.blue(`[${Logger.now()}] [DEBUG] `),
        Logger.normalize(chalk.blue, args)
      );
    }
  };

  public static info = (...args: any) => {
    Logger.client.log(
      chalk.blue(`[${Logger.now()}] [INFO] `),
      Logger.normalize(chalk.blueBright, args)
    );
  };

  public static warn = (...args: any) => {
    Logger.client.log(
      chalk.yellow(`[${Logger.now()}] [WARN] `),
      Logger.normalize(chalk.yellowBright, args)
    );
  };

  public static error = (...args: any) => {
    Logger.client.log(
      chalk.red(`[${Logger.now()}] [ERROR] `),
      Logger.normalize(chalk.redBright, args)
    );
  };

  private static normalize = (color: Function, args: any[]) => {
    return args
      .map((arg: any): any => {
        if (arg === undefined) {
          return "undefined";
        } else if (typeof arg === "string") {
          return color(arg);
        } else if (typeof arg === "object" && !Array.isArray(arg)) {
          if (arg === null) {
            return "null";
          }
          return chalk.green(stringifyObject(arg));
        } else if (Array.isArray(arg)) {
          return Logger.normalize(color, arg);
        } else {
          return arg;
        }
      })
      .join("");
  };

  private static now = () => new Date().toISOString();
}
