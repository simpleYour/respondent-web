import request from "~/utils/request";

const BASE_URL = "/type";

export default {
  // 获取某个单词的vo类信息
  getVoById(id) {
    return request({
      url: `${BASE_URL}/${id}`,
      method: "get"
    })
  },
  // 获取当前登录用户的所有单词本列表
  listAll() {
    return request({
      url: `${BASE_URL}/list`,
      method: "get"
    })
  },
  removeById(id) {
    return request({
      url: `${BASE_URL}/${id}`,
      method: "delete"
    })
  },
  // 修改某个单词本的名称
  modifyTypeName(id, name) {
    return request({
      url: `${BASE_URL}/${id}/${name}`,
      method: "put"
    })
  },
  // 添加一单词本
  addType(wordType) {
    return request({
      url: `${BASE_URL}`,
      method: "post",
      data: wordType
    })
  }
}
