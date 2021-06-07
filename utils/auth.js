import Cookies from 'js-cookie'

const TokenKey = 'front-token';
const userInfoKey = 'user-info-key'

export default {
  // 保存token数据
  setToken(token) {
    return Cookies.set(TokenKey, token)
  },
  getToken() {
    return Cookies.get(TokenKey)
  },
  removeToken() {
    return Cookies.remove(TokenKey)
  },

  setUserInfo(userInfo) {
    return Cookies.set(userInfoKey, userInfo)
  },
  getUserInfo() {
    if (!Cookies.get(userInfoKey)) {
      return ''
    }
    // cookie 进行存放的时候是字符串格式,所以这里需要进行转化为对象
    return JSON.parse(Cookies.get(userInfoKey))
  },
  removeUserInfo() {
    return Cookies.remove(userInfoKey)
  }

}
