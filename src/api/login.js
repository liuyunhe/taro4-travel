import { request } from "../common/utils";
import { API_PRE } from "../common/constant";

export default {
  // banner接口
  postLogin(params) {
    return request({
      url: `${API_PRE}/login`,
      method: "POST",
      params,
    });
  },
};
