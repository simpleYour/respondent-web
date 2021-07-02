<template>
  <div style="height: 100%">
    <div class="container">
      <div class="card">
        <div class="header">
          <el-image src="/avatar.png" style="height: 50px" :fit="'contain'"></el-image>
          <div>登录</div>
        </div>
        <el-form ref="form" :model="user" label-width="80px" label-position="left" :rules="rules">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="user.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="user.password" clearable></el-input>
          </el-form-item>
        </el-form>
        <div class="footer">
          <div class="register">
            <nuxt-link to="/user/register" tag="div">
              注 册
            </nuxt-link>
          </div>
          <el-button type="success" @click="login" style="flex-grow: 1">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserApi from "~/api/UserApi";

export default {
  name: "login",
  layout: "user",
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
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
}


.container > * {
  width: 100%;
}

.header {
  display: flex;
  flex-direction: column;
  /*justify-content: center;*/
  align-content: center;
  margin-bottom: 25px;
}

.header * {
  /*font-family: "华文行楷",Georgia,Serif; ;*/
  font-size: x-large;
  margin: 5px auto;
}

/* 做出一个卡片框的样式 */
.card {
  width: 500px;
  height: 350px;
  background-color: wheat;
  border-radius: 8px;
  margin-top: 5%;
  padding: 15px;
}

.footer {
  display: flex;
}

.footer > * {
  margin: 0 10px;
}

.register {
  align-self: flex-end;
  margin-right: 30px;
  text-decoration: underline;
}

</style>
