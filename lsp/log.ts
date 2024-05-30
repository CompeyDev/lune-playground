import * as log from "https://deno.land/std@0.224.0/log/mod.ts";
import * as colors from "https://deno.land/std@0.224.0/fmt/colors.ts";

log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: (logRecord: log.LogRecord) => {
        const args = logRecord.args;
        const reqId = args[0] as string;
        delete args[0];

        const time = colors.dim(logRecord.datetime.toISOString());
        const level = log.getLevelName(logRecord.level as log.LogLevel);

        let applyFmt: (str: string) => string;

        switch (level) {
          case "INFO":
            applyFmt = colors.green;
            break;
          case "WARN":
            applyFmt = colors.yellow;
            break;
          case "DEBUG":
            applyFmt = colors.magenta;
            break;
          case "ERROR":
            applyFmt = colors.red;
            break;
          case "CRITICAL":
            applyFmt = colors.red;
            break;

          case "NOTSET":
          default:
            applyFmt = colors.white;
        }

        const fmtLevel = colors.bold(applyFmt(level));

        return `${time} ${fmtLevel} ${
          colors.italic(reqId ?? "unknown")
        } // ${logRecord.msg}${args.length > 0 && args.join() || ""}`;
      },
      useColors: false,
    }),
  },
});

export default log;
