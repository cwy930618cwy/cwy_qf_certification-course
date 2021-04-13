<template>
  <div class="login">
    <ul class="login_pop">
      <li class="left"></li>
      <li class="right">
        <h2 class="lgtitle">欢迎登录华为认证管理后台</h2>
        <p class="blxtitle">账号密码登录</p>
        <div class="inputgroup">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
            <el-form-item prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入用户名" maxlength="12" clearable>
                <i slot="prefix" class="el-input__icon el-icon-s-custom"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="pwd">
              <el-input v-model="ruleForm.pwd" placeholder="请输入密码" show-password maxlength="18" clearable>
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" class="codepars">
              <el-input v-model="ruleForm.code" placeholder="请输入验证码" maxlength="6" clearable style="width: 60%">
                <i slot="prefix" class="el-input__icon el-icon-s-opportunity"></i>
              </el-input>
              <img class="codeimgs" :src="codeImgs.img" @click="getImgCaptcha" />
            </el-form-item>
            <el-form-item>
              <el-button class="submit" type="primary" style="width: 100%" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getImgCaptcha, login } from '@/utils/httpServer'
export default {
  data() {
    return {
      codeImgs: {
        img: '',
        authCodeToken: ''
      },
      ruleForm: {
        name: '',
        pwd: '',
        code: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    userinfo() {
      return this.$store.state.userinfo
    }
  },
  methods: {
    //是否登录状态
    isloadingState() {
      if (this.userinfo) {
        this.$router.push({ name: 'home' })
      } else {
        this.getImgCaptcha()
      }
    },
    //确认登录
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //登录接口
    async login() {
      let d = await login({
        authCode: this.ruleForm.code,
        authCodeToken: this.codeImgs.authCodeToken,
        password: this.ruleForm.pwd,
        userName: this.ruleForm.name
      })
      if (d.code != 200) this.$message({ message: d.msg, type: 'error' })
      this.$store.dispatch('setSserinfo', d.data)
      this.$log.success('登录成功')
	  setTimeout(()=>{
		  this.$router.push({
			  name:'home'
		  })
	  },2000)
    },
    //获取图形验证码
    async getImgCaptcha() {
      let d = await getImgCaptcha()
      if (d.code != 200) this.$message({ message: d.msg, type: 'error' })
      this.codeImgs.img = d.data.img
      this.codeImgs.authCodeToken = d.data.authCodeToken
      console.log(this.codeImgs)
    }
  },
  mounted() {
    this.isloadingState()
  }
}
</script>

<style lang="less" scoped>
.login {
  background: url(~@/assets/images/bg1.png) no-repeat center center;
  background-size: cover;
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_pop {
    width: 660px;
    height: 420px;
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    .left {
      width: 260px;
      background: url(~@/assets/images/bg_left.png) no-repeat center center;
      background-size: cover;
    }
    .right {
      background: #fff;
      width: calc(100% - 260px);
      padding: 26px 36px;
      .lgtitle {
        text-align: center;
        margin: 0;
        font-size: 24px;
        color: #333333;
      }
      .blxtitle {
        color: #bbb;
        font-size: 14px;
        text-align: center;
        margin-bottom: 27px;
        padding: 12px 0;
      }
    }
  }
  .inputgroup {
  }
  .codepars {
    .codeimgs {
      vertical-align: middle;
      cursor: pointer;
      background-color: #bbb;
    }
  }
  .submit {
    width: 100%;
  }
}
</style>
