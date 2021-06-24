import Cookies from 'js-cookie'
import userApi from "@/api/UserApi";

const TokenKey = 'front-token';
const userInfoKey = 'user-info-key'

export default {
  // 保存token数据
  setToken(token) {

    // 往本地储存中也放一份
    localStorage.setItem(TokenKey, token)

    return Cookies.set(TokenKey, token)
  },
  getToken() {
    // 查看本地存储中是否有相应的数据
    let token = Cookies.get(TokenKey)

    // 如果cookie中没有token数据,则取本地储存中查看一下是否有缓存
    if (!token) {
      token = localStorage.getItem(TokenKey)
      // 如果本地存储有,而cookie没有,则放置一份到cookie中
      if (token) {
        this.setToken(token)
      }
    }
    return token
  },
  removeToken() {
    localStorage.removeItem(TokenKey)
    return Cookies.remove(TokenKey)
  },
  setUserInfo(userInfo) {
    return Cookies.set(userInfoKey, userInfo)
  },
  getUserInfo() {
    if (!Cookies.get(userInfoKey)) {
      // 这里判断是否有token信息,尝试使用token信息,去请求后端,以此获取用户信息
      if (this.getToken()) {
        userApi.getInfo().then(res => {
          this.setUserInfo(res.data)
        })
      } else {
        return ''
      }
    }
    // cookie 进行存放的时候是字符串格式,所以这里需要进行转化为对象
    return JSON.parse(Cookies.get(userInfoKey))
  },
  removeUserInfo() {
    return Cookies.remove(userInfoKey)
  }

}
