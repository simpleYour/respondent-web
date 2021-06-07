import request from "~/utils/request";

const BASE_URL = "/record-detail";

export default {
  // 通过答题记录id,获取其对应的所有的答题详情记录信息
  list(recordId) {
    return request({
      url: `${BASE_URL}/list/${recordId}`,
      method: "get"
    })
  }
}
