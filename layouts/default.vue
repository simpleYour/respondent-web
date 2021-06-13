<template>
  <div class="container">
    <div class="header">
      <nuxt-link to="/" tag="div">
        <i class="el-icon-house"></i>
        首页
      </nuxt-link>
      <nuxt-link to="/answer" tag="div">
        <i class="el-icon-notebook-2"></i>
        答题
      </nuxt-link>
      <nuxt-link to="/query" tag="div">
        <i class="el-icon-search"></i>
        词缀查询
      </nuxt-link>

      <div class="end">欢迎您:{{ user.name }}
        <el-avatar src="https://guli-student.oss-cn-hangzhou.aliyuncs.com/2021/03/23/a92482c0-7ff8-43a0-b29e-e730e044156a1616506526908.jpeg"
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
  created() {
    this.user = auth.getUserInfo()
  }
}

</script>
<style scoped>
* {
  padding: 0;
  border: 0;
  margin: 0;
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: rgb(241, 241, 241);
  width: 80%;
  margin: 0 auto;
  /*height: 1000px;*/
  position: relative;
  margin-top: -10px;
}

.header {
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  background-color: #526488;
  padding-left: 5px;
}

.header > * {
  margin: 2px 5px;
}

.header * {
  font-size: large;
  color: aliceblue;
}

.end {
  position: absolute;
  right: 5px;
}

.main{
  margin-top: 10px;
}

</style>
