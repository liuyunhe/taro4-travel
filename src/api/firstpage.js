import { request } from "../common/utils";
import { API_PRE } from "../common/constant";

export default {
  // banner接口
  adsBannerImg(params) {
    return request({
      url: `${API_PRE}/ads/advertising`,
      method: "GET",
      params,
    });
  },
  // 城市机场列表
  airportCityListReq(params) {
    return request({
      url: `${API_PRE}/city/airportList`,
      method: "GET",
      params,
    });
  },
  // 机场航班信息列表
  airFlightListReq(params) {
    return request({
      url: `${API_PRE}/airList/singleList`,
      method: "GET",
      params,
    });
  },
};
