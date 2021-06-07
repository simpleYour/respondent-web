import request from "~/utils/request";

const BASE_URL = "/word-type";

export default {
  // 获取某个单词的vo类信息
  getVoById(id) {
    return request({
      url: `${BASE_URL}/${id}`,
      method: "get"
    })
  }
}
