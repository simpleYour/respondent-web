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
  }
}
