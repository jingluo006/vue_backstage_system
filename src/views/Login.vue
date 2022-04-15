<template>
  <div id="login">
    <div class="loginContainer">
      <!-- 头部区域 -->
      <div class="top-img">
        <img src="../assets/img/yoona.jpg" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" class="login_form" :rules="loginRules" @keyup.enter.native="login">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 登录重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入axios
import axios from '@/utils/requestLogin.js'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证用户名和密码字段
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginInput() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login() {
      // 先验证表单验证结果
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        // 验证通过
        const { data: res } = await axios.post('/login', this.loginForm)
        if (res.meta.status !== 200) {
          this.$message.error('用户名或密码错误')
          return false
        }

        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  background-color: #93b5cf;
  height: 100%;
}
.loginContainer {
  width: 480px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .top-img {
    position: absolute;
    left: 50%;
    width: 80px;
    height: 80px;
    border: 1px solid #ccc;
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 80px;
      height: 120px;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
