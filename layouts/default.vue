<template>
  <div class="container" id="container">
    <div class="header">
      <nuxt-link to="/" tag="div">
        <i class="el-icon-house"></i>
        首页
      </nuxt-link>
      <nuxt-link to="/respondent" tag="div">
        <i class="el-icon-notebook-2"></i>
        答题
      </nuxt-link>
      <nuxt-link to="/query" tag="div">
        <i class="el-icon-search"></i>
        词缀查询
      </nuxt-link>
      <nuxt-link to="/record" tag="div">
        <i class="el-icon-info"></i>
        答题记录
      </nuxt-link>

      <div class="welcome">欢迎您!
        <div style="display: inline;">{{ user.name }}
          <ul id="user-option">
            <!--            <li>修改密码</li>-->
            <li>
              <nuxt-link to="/user/login" tag="div">
                切换用户
              </nuxt-link>
            </li>
            <li @click="logout">注销</li>
          </ul>
        </div>
      </div>

    </div>
    <div class="main">
      <Nuxt/>
    </div>
  </div>
</template>
<script>
import auth from "~/utils/auth";

export default {
  data() {
    return {
      user: {},
      // 用户相关的操作,是否进行展示
      userAbout: false
    }
  },
  methods: {
    // 窗口大小发生变化时,执行的方法
    windowResize() {
      let element = document.getElementById("container")

      // 内容容器应该向左边偏移的值   用窗口的宽度-容器的宽度除以2
      let leftOffset = (window.innerWidth - element.clientWidth) / 2

      // 如果窗口宽度小于 1600px 那么偏移值就设置为0,并且容器的width设置为100%
      if (window.innerWidth < 1600) {
        leftOffset = 0
        element.style.width = "100%"
      } else {
        element.style.width = "80%"
      }
      element.style.left = leftOffset + "px"
    },
    // 退出登录
    logout() {
      auth.removeUserInfo()
      auth.removeToken()
      window.location.href = '/user/login'
    }
  },
  created() {
    this.user = auth.getUserInfo()
  },
  mounted() {
    // 首先自行调整个一遍窗口大小
    this.windowResize()
    // 绑定当窗口发生变化的事件
    window.onresize = this.windowResize
  }
}

</script>
<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
<style scoped>

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: rgb(241, 241, 241);
  width: 80%;
  /*margin: -10px auto 0 auto;*/
  margin: 0 auto 0 auto;
  position: absolute;
  /*把这个容器给撑起来*/
  top: 0;
  bottom: 0;
}

.header {
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  background-color: #526488;
  padding-left: 5px;
  box-sizing: border-box;
}

.header > * {
  margin: 0 5px;
}

.header * {
  font-size: large;
  color: aliceblue;
}

.main {
  position: absolute;
  background-color: rgb(242, 246, 252);
  width: 100%;
  /* .height的高度 */
  top: 40px;
  /*height: 800px;*/
  bottom: 0;
}

/* 用户信息右侧浮动 */
.welcome {
  float: right;
  width: 20%;
  box-sizing: border-box;
  text-align: right;
  position: absolute;
  right: 5px;
  z-index: 9999;
}

#user-option {
  right: -10px;
  position: absolute;
  list-style: none;
  background-color: #526488;
  width: 100px;
  height: auto;
  padding-inline-start: 0;
  visibility: hidden;
  margin-top: 0;
  padding: 3px;
}

#user-option > li {
  padding: 3px;
  text-align: center;
}

#user-option > li:hover {
  background-color: #909399;
}

.welcome > div:hover #user-option {
  visibility: visible;
}

#user-option:hover #user-option {
  visibility: visible;
}


</style>
