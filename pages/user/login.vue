<template>
  <div class="container">
    <div class="header">
      <div>登录</div>
    </div>
    <el-form ref="form" :model="user" label-width="80px" label-position="left" :rules="rules">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="user.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="user.password" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UserApi from "~/api/UserApi";

export default {
  name: "login",
  layout: "empty",
  data() {
    return {
      user: {
        "name": "",
        "password": "",
      },
      // 表单效验器
      rules: {
        name: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login() {
      // 登录成功则跳转到index首页
      UserApi.login(this.user).then(res => {
        this.$router.push({path: "/"})
      })
    }
  }
}
</script>

<style scoped>

.container {
  width: 50%;
  margin: 0 auto;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}


.container > * {
  width: 100%;
}

.header {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-bottom: 5px;
}

.header * {
  /*font-family: "华文行楷",Georgia,Serif; ;*/
  font-size: x-large;
}

</style>
