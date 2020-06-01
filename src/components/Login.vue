<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登陆表单区 -->
      <el-form label-width="0" :model="loginForm" :rules="rules" ref="loginForm" class="login_form">
        <el-form-item placeholder="用户名" prop="username">
          <el-input  prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item placeholder="密码" prop="password">
          <el-input type="password"  prefix-icon="el-icon-lock" v-model="loginForm.password" @keyup.enter.native="login('loginForm')"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login('loginForm')">登陆</el-button>
          <el-button type="info" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '../network/login'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 发起登陆请求
          await login(this.loginForm).then(res => {
            const data = res.data
            if (data.meta.status !== 200) return this.$message.error('用户名或密码错误')
            this.$message.success({
              message: '登录成功'
            })
            window.sessionStorage.setItem('token', data.data.token)
            this.$router.push('/home')
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: space-around;
}
</style>
