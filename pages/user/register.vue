<template>
  <div style="height: 100%">
    <div class="container">
      <div class="card">
        <div class="header">
          <el-image src="/register.png" style="height: 50px" :fit="'contain'"></el-image>
          <div>注册</div>
        </div>
        <el-form ref="form" :model="user" label-width="80px" label-position="left" :rules="rules">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="user.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="user.password" clearable autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码确认" prop="checkPassword">
            <el-input type="password" v-model="user.checkPassword" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="footer">
          <div class="register">
            <nuxt-link to="/user/login" tag="div">
              登 录
            </nuxt-link>
          </div>
          <el-button type="success" @click="doRegister" style="flex-grow: 1">确 认 注 册</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from "~/api/UserApi";

export default {
  name: "login",
  layout: "user",
  data() {
    // 两次密码的一个效验器
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.user.checkPassword !== '') {
          this.$refs.form.validateField('checkPassword');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    // 向后端请求,判断用户名是否已存在
    let validateExistUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空!'));
      }
      userApi.existName(value).then(res => {
        if (res.data) {
          callback(new Error("该用户名已存在!"))
        } else {
          callback()
        }
      })
    }

    return {
      user: {
        "avatar": "",
        "name": "",
        "password": "",
        "checkPassword": "",
        "phone": "",
      },
      // 表单效验器
      rules: {
        name: [
          {validator: validateExistUserName, trigger: 'blur'}
        ],
        password: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        checkPassword: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    // 执行注册操作
    doRegister() {
      userApi.register(this.user).then(res => {
        if (res.data) {
          this.$confirm("注册成功!即将前往登录页面!", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            this.$router.push({path: "/user/login"})
          }).catch(() => {
            this.$message.info("已取消")
          })
        }
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
  width: 520px;
  height: 400px;
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
