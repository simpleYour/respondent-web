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

      <div class="end">欢迎您:{{ user.name }}
        <el-avatar
          src="https://guli-student.oss-cn-hangzhou.aliyuncs.com/2021/03/23/a92482c0-7ff8-43a0-b29e-e730e044156a1616506526908.jpeg"
          size="small"></el-avatar>
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
      user: {}
    }
  },
  methods: {
    // 窗口大小发生变化时,执行的方法
    windowResize() {
      let element = document.getElementById("container")

      // 内容容器应该向左边偏移的值   用窗口的宽度-容器的宽度除以2
      let leftOffset = (window.innerWidth - element.clientWidth) / 2

      // 如果窗口宽度小于 1000px 那么偏移值就设置为0,并且容器的width设置为100%
      if (window.innerWidth < 1000) {
        leftOffset = 0
        element.style.width = "100%"
      } else {
        element.style.width = "80%"
      }
      element.style.left = leftOffset + "px"
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

.end {
  position: absolute;
  right: 5px;
  display: flex;
  align-items: center;
}

.end > * {
  margin-left: 5px;
}

.main {
  position: absolute;
  background-color: rgb(242,246,252);
  width: 100%;
  /* .height的高度 */
  top: 40px;
  /*height: 800px;*/
  bottom: 0;
}

</style>
