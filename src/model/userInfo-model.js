// 登录用户信息的 持久化信息
import { useState } from "react";
import { createGlobalStore } from "hox";
import { getStorageWithCache } from "@/common/utils";

export const [useUserInfoModel] = createGlobalStore(() => {
  // // 拿到本地的存储信息 判断是否登录
  // 拿到本地的存储信息 判断是否登录
  const localStorageInfo = getStorageWithCache("userInfo");

  const [userInfoState, setUserInfoState] = useState({
    isLogin: !!localStorageInfo?.userPhone,
    userPhone: localStorageInfo?.userPhone,
    nickName: localStorageInfo?.nickName,
  });

  const changeUserInfoState = (data) => {
    setUserInfoState({ ...userInfoState, ...data });
  };

  return {
    userInfoState,
    changeUserInfoState,
  };
});
