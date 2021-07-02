import request from "~/utils/request";

const BASE_URL = "/processor";

export default {
  init(typeId, mode, num, dateScope) {
    return request({
      url: `${BASE_URL}/init/${typeId}/${mode}/${num}/${dateScope}`,
      method: "get"
    })
  },
  isRight(answer) {
    return request({
      url: `${BASE_URL}/isRight/${answer}`,
      method: "get"
    })
  },
  end() {
    return request({
      url: `${BASE_URL}/end`,
      method: "get"
    })
  },
  // 答题结束后,获取本地答题的一个答题信息对象
  endOne() {
    return request({
      url: `${BASE_URL}/endOne`,
      method: "get"
    })
  },
  downloadExcel(typeId, mode, num, dateScope) {
    // 直接打开这个下载连接
    window.open(`${request.baseURL}${BASE_URL}/download/${typeId}/${mode}/${num}/${dateScope}`)
    /*  return request({
        url: `${BASE_URL}/download/${typeId}/${mode}/${num}/${dateScope}`,
        method: "get"
      })*/
  },
  // 颠倒模式对应的字符串
  invertMode: "modeInvert"
}
