import request from "~/utils/request";

const BASE_URL = "/root";

export default {
  // 查询符合条件的词根词缀信息
  search(current, size, type, search) {
    return request({
      url: `${BASE_URL}/${current}/${size}/${type}/${search}`,
      method: "get"
    })
  }
}
