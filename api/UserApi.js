import request from "~/utils/request";
import auth from "~/utils/auth";
import {Message, MessageBox} from 'element-ui'

const BASE_URL = "/user";

export default {
  login(user) {
    return request({
      url: `${BASE_URL}`,
      method: "post",
      data: user
    }).then(res => {
      // 如果登录成功,返回的这个信息不为null,则将登录的用户信息保存进cookie中
      if (res.data) {
        Message({
          message: "登录成功",
          type: 'success',
          duration: 2 * 1000
        })

        auth.setToken(res.data)
        // 将已经登录的userInfo信息保存进cookie中
        this.getInfo().then(response => {
          auth.setUserInfo(response.data)
        })
      }
    })
  },
  existName(name) {
    return request({
      url: `${BASE_URL}/exist/${name}`,
      method: "get"
    })
  },
  getInfo() {
    return request({
      url: `${BASE_URL}/info`,
      method: "get"
    })
  },
  modify(user) {
    return request({
      url: `${BASE_URL}/modify`,
      method: "put",
      data: user
    })
  },
  updatePassword(old, current) {
    return request({
      url: `${BASE_URL}/password/${old}/${current}`,
      method: "post"
    })
  },
  register(user) {
    return request({
      url: `${BASE_URL}/register`,
      method: "post",
      data: user
    })
  }
}
