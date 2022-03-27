import auth from './auth'

//每个用户的token和其对应的缓存childMap  具体的childMap存放具体用户的kv键值对
let map = new Map();

//设置缓存
function addCache(key, value) {
  let childMap = map.get(auth.getToken())
  if (!childMap) {
    childMap = new Map();
    map.set(auth.getToken(), childMap);
  }
  childMap.set(key, value)
}

//获取缓存
function getCache(key) {
  let childMap = map.get(auth.getToken())
  if (childMap) {
    return childMap.get(key)
  }
  return null
}

export default {
  addCache, getCache
}

