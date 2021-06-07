import request from "~/utils/request";

const BASE_URL = "/record";

export default {
  // 查询符合条件的答题记录
  search(query, current, size) {
    return request({
      url: `${BASE_URL}/${current}/${size}`,
      method: "post",
      data: query
    })
  }
}
