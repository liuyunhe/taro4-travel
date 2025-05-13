import dayjs from "dayjs";
import { isH5 } from "./utils";

export const ERR_NET_MESSAGE = "网络开小差";

// 日历日期 最大日期 当前多 60 天
export const MIN_DATE = dayjs().format("YYYY-MM-DD");
export const MAX_DATE = dayjs().add(60, "day").format("YYYY-MM-DD");
// h5 避免跨域问题
export const API_PRE = isH5 ? "" : "http://localhost:3000";
