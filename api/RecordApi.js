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
  },
  // 根据一系列的查询条件,查询出符合条件的单词本日期数量实例类
  /* query : {
    "end": "",
    "number": 0,
    "start": "",
    "typeId": ""
  }*/
  dateCount(query) {
    return request({
      url: `${BASE_URL}/dateCount`,
      method: "post",
      data: query
    })
  },
  // 查询符合条件的答题记录vo类
  searchVo(query, current, size) {
    return request({
      url: `${BASE_URL}/vo/${current}/${size}`,
      method: "post",
      data: query
    })
  }
}
