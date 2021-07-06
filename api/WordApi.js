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
  },
  delete(id) {
    return request({
      url: `${BASE_URL}/${id}`,
      method: "delete"
    })
  },
  // 下载批量添加单词的模板
  downloadTemplate() {
    // 直接打开这个下载连接
    window.open(`${request.baseURL}${BASE_URL}/template`)
  },
  // 上传excel解析文件地址
  uploadURL(typeId) {
    return `${request.baseURL}${BASE_URL}/upload/${typeId}`
  },
  // 上传单词图片地址
  uploadImageUrl: `${request.baseURL}/oss/file/upload`
}
