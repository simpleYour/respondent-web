import request from "~/utils/request";

const BASE_URL = "/word";

export default {
  add(word) {
    return request({
      url: `${BASE_URL}`,
      method: "post",
      data: word
    })
  },
  // 查询符合条件的单词列表信息
  list(query, current, size) {
    return request({
      url: `${BASE_URL}/list/${current}/${size}`,
      method: "post",
      data: query
    })
  },
  getWebMean(word) {
    return request({
      url: `${BASE_URL}/${word}`,
      method: "get"
    })
  },
  modify(id, word) {
    return request({
      url: `${BASE_URL}/${id}`,
      method: "put",
      data: word
    })
  }


}
