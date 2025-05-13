import Taro, {
  setStorageSync,
  getStorageSync,
  removeStorageSync,
} from "@tarojs/taro";
import loginPageAuth from "@/common/needloginpages";
import dayjs from "dayjs";

// 请求方法
export const request = ({
  url = "",
  params = {},
  method = "GET",
  ...other
}) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      method,
      mode: "cors",
      data: params,
      ...other,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const navigateTo = (uri, params) => {
  let itemArray = [];

  // 鉴权
  isLoginAuthHandler(uri);

  if (typeof params === "object" && Object.keys(params).length) {
    for (const o in params) {
      itemArray.push(`${o}=${params[o]}`);
    }
    params = itemArray.join("&");
  }

  if (!!params) {
    if (uri.indexOf("?") > -1) {
      uri = `${uri}&${params}`;
    } else {
      uri = `${uri}?${params}`;
    }
  }
  // 这里做个鉴权操作  没登录就跳转登录
  return Taro.navigateTo({
    url: uri,
  });
};

export const weekDay = (date = "") => {
  const day = dayjs(date).day();
  switch (day) {
    case 1:
      return "周一";
    case 2:
      return "周二";
    case 3:
      return "周三";
    case 4:
      return "周四";
    case 5:
      return "周五";
    case 6:
      return "周六";
    case 0:
      return "周日";
    default:
      return "";
  }
};

// 带时间的缓存 time s
export const setStorageWithCache = (key, value, time) => {
  const cacheTime = Date.now() + time * 1000;
  setStorageSync(key, {
    [key]: value,
    expireTime: cacheTime,
  });
};

// 查询缓存
export const getStorageWithCache = (key) => {
  try {
    const cache = getStorageSync(key);
    if (cache) {
      const { expireTime } = cache;
      if (Date.now() > expireTime) {
        removeStorageSync(key);
      } else {
        return cache[key];
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// 鉴权操作
export const isLoginAuthHandler = (uri) => {
  const loginInfo = getStorageWithCache("userInfo");
  // 没有登录 并且跳转的页面需要鉴权
  if (!loginInfo?.userPhone && loginPageAuth.indexOf(uri) > -1) {
    Taro.navigateTo({
      url: "/pages/login/login",
    });
  }
};

export const isAliPay = Taro.ENV_TYPE.ALIPAY === Taro.getEnv();
export const isBaiDu = Taro.ENV_TYPE.SWAN === Taro.getEnv();
export const isH5 = Taro.ENV_TYPE.WEB === Taro.getEnv();
