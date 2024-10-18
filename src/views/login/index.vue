<template>
  <div class="login-container" style="width:100%;height:100%;">
    <div class="center">
      <!-- <div class="left" /> -->
      <!-- 表单 -->
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        label-position="left"
        auto-complete="off"
        @submit.native.prevent
      >
        <div style="text-align: center;padding: 10px 0; display: flex;flex-wrap: wrap;" class="logoBox">
          <img src="../../assets/YesPayLogo.png" class="sidebar-logo" height="80px">
          <div class="title_desc">
            Partner
          </div>
        </div>
        <!-- <p class="title1">YesPay</p> -->
        <!-- 登录名 -->
        <el-form-item :label="isMobile?'登录帐号':''" prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" v-if="!isMobile"/>
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="off"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item :label="isMobile?'登录密码':''" prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" v-if="!isMobile"/>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="off"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%;height: 40px;margin: 30px 0 0 0;font-size: 12px;"
          @click.native.prevent="handleLogin"
        >登 录</el-button>
      </el-form>
    </div>
    <!-- 锁定的弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="35%"
      top="35vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialogAddgsVisible"
    >
      <span style="font-size: 24px;vertical-align: middle;margin-right: 5px;">
        <svg-icon icon-class="warn" />
      </span>
      <span v-if="status === 1002">当前账号/密码已连续错误 {{ fcount }} 次，达到10次后锁定账号</span><!-- 账号密码 -->
      <span v-if="status === 1033">当前验证码已连续错误  {{ fcount }} 次，达到10次后锁定账号</span><!-- 验证码 -->
      <span v-if="status === 1001 || status === 1032"> 当前账号已锁定, {{ hh }}:{{ mm }}:{{ ss }} 后自动解锁，如有疑问，请联系客服</span>
      <span v-if="status === 1050">当前账号已被关闭，如有疑问，请联系客服</span><!--账号关闭-->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <!-- 输入谷歌验证码的弹窗 -->
    <el-dialog
      title="请输入谷歌验证码"
      :visible.sync="dialogFormVisible"
      width="60%"
      top="35vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialogFormVisible"
    >
      <el-form v-model="loginForm" label-position="top" @submit.native.prevent>
        <el-form-item>
          <el-input
            ref="googleCode"
            v-model="loginForm.googleCode"
            style="width: 100%;"
            placeholder="谷歌验证码"
            autocomplete="off"
            prefix-icon="el-icon-key"
            onkeyup="value = value.replace(/[^\d]/g,'')"
            @blur="loginForm.googleCode = $event.target.value"
            @keyup.enter.native="handleLogin"
          />
          <p style="margin:0;font-size:12px;color:#808080">请输入"Authenticator"APP中的谷歌验证码以验证您的身份</p>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="googleLoading" @click="handleLogin()">确定</el-button>
      </span>
    </el-dialog>
    <!-- 绑定谷歌验证码的弹窗 -->
    <el-dialog
      title="绑定谷歌验证器"
      :visible.sync="dialogGoogleAuthenticator"
      width="80%"
      top="14vh"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialogGoogleAuthenticator"
    >
      <div>
        <p class="download">iOS用户登录AppStore搜索 "Authenticator" 下载</p>
        <p class="download">安卓用户登录应用商店或利用浏览器搜索 "谷歌身份验证器" 下载</p>
        <p class="tips">1. 使用 "Authenticator" APP, 扫描下方二维码添加</p>
        <div class="safeone">
          <div class="qrcode">
            <i id="load" class="el-icon-loading load" />
            <img :src="qrURL" style="width:200px;">
          </div>
        </div>
        <p class="tips">2. 将获得的谷歌验证码填入下方输入框中，点击“确认绑定”</p>
        <div class="safeone" style="margin-top: 20px;">
          <div class="stations">
            <el-input
              v-model="googleCode"
              class="headerInputs"
              placeholder="谷歌验证码"
              prefix-icon="el-icon-key"
            />
            <el-button
              type="primary"
              style="width: 600px;margin-top: 20px;"
              :loading="loading"
              @click="bundling()"
            >确认绑定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { user_googleAuthenticator, googleAuthenticator_bind } from '@/api/cardMch'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        googleCode: ''
      },
      status: '',
      fcount: '', // 输错的次数
      hh: '00',
      mm: '00',
      ss: '00',
      second: '', // 倒计时剩余秒数
      timer: '',
      dialogVisible: false, // 锁定的弹窗
      dialogFormVisible: false, // 谷歌验证码的弹窗
      dialogGoogleAuthenticator: false, // 绑定谷歌验证器的弹窗
      token: '', // 暂存token
      qrURL: '', // 二维码
      googleCode: '', // 谷歌验证码
      googleLoading: false,
      loginRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  computed: {
    ...mapGetters(['isMobile'])
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          // this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    console.log('%c [  ]-217', 'font-size:13px; background:pink; color:#bf2c9f;', this.isMobile)
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    } else {
      this.$refs.password.focus()
    }

    console.log('%c [  ]-227', 'font-size:13px; background:pink; color:#bf2c9f;', this.isMobile)
  },
  methods: {
    ...mapActions({ add_Routes: 'add_routes' }),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录
    handleLogin() {
      this.googleCode = this.loginForm.googleCode ? this.loginForm.googleCode : undefined
      if (this.dialogFormVisible === true) { // 如果谷歌弹窗打开
        if (!this.loginForm.googleCode || this.loginForm.googleCode.length !== 6) {
          this.$message.warning('请输入6位数字的谷歌验证码')
          return
        }
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.googleLoading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then((res) => {
              this.loading = false
              this.googleLoading = false
              console.log(res, '======021-000-P-009')
              if (res === undefined) {
                this.$router.push('/')
                return
              } else {
                if (res.data && !res.data.bindGoogle) { // 未绑定谷歌验证器
                  this.token = res.data.token
                  this.getGoogleQrcode()
                  this.dialogGoogleAuthenticator = true
                } else
                if (res.code === '021-000-P-009') { // 已绑定谷歌验证码
                  this.loginForm.googleCode = ''
                  this.dialogFormVisible = true
                  this.$nextTick(() => {
                    this.$refs.googleCode.focus()
                  })
                } else { // 谷歌验证码校验失败,账号/密码错误,登录锁定,谷歌验证码锁定,账号已关闭
                  this.loading = false
                  this.googleLoading = false
                  this.$message.error(res.msg)
                }
              }
            })
            .catch(() => {
              this.loading = false
              this.googleLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取谷歌验证器的二维码
    getGoogleQrcode() {
      user_googleAuthenticator({
        token: this.token
      }).then((res) => {
        const blob = new Blob([res])
        const url = URL.createObjectURL(blob)
        this.qrURL = url
        document.getElementById('load').style.display = 'none'
      }).catch(() => {
        return
      })
    },
    // 绑定验证码
    bundling() {
      this.loading = true
      googleAuthenticator_bind({
        token: this.token,
        googleCode: this.googleCode
      }).then((res) => {
        this.loading = false
        this.dialogGoogleAuthenticator = false
        this.$message.success('绑定成功')
      }).catch(() => {
        this.googleCode = ''
        this.loading = false
      })
    },
    // 关闭绑定弹窗
    closeDialogGoogleAuthenticator() {
      this.googleCode = ''
    },
    // 关闭弹窗
    closeDialogAddgsVisible() {
      this.second = ''
      this.fcount = ''
      clearInterval(this.timer)
    },
    closeDialogFormVisible() {
      this.loginForm.googleCode = ''
    },
    // 倒计时
    TimeDown() {
      if (this.second <= 0) {
        this.hh = '00'
        this.mm = '00'
        this.ss = '00'
        return
      } else {
        var totalSeconds = parseInt(this.second) // 相差的总秒数
        var modulo = totalSeconds % (60 * 60) // 取模（余数）
        this.hh = Math.floor(totalSeconds / (60 * 60)) >= 10 ? Math.floor(totalSeconds / (60 * 60)) : '0' + Math.floor(totalSeconds / (60 * 60)) // 小时数
        modulo = modulo % (60 * 60)
        this.mm = Math.floor(modulo / 60) >= 10 ? Math.floor(modulo / 60) : '0' + Math.floor(modulo / 60) // 分钟
        this.ss = modulo % 60 >= 10 ? modulo % 60 : '0' + (modulo % 60) // 秒
        this.let()
      }
    },
    /* eslint-disable */ 
    // 倒计时
    let() {
      this.timer = setInterval(() => {
        if (this.ss > 0) {
          this.ss = (this.ss - 1) >= 10 ? (this.ss - 1) : '0' + (this.ss - 1)
        }
        if (this.ss == 0) {
          if (this.mm > 0) {
            this.mm = (this.mm - 1) >= 10 ? (this.mm - 1) : '0' + (this.mm - 1)
            this.ss = 59
            return
          }
          if (this.mm == 0) {
            if (this.hh > 0) {
              this.hh = (this.hh - 1) >= 10 ? (this.hh - 1) : '0' + (this.hh - 1)
              this.mm = 59
              this.ss = 59
              return
            }
            if (this.hh == 0) {
              this.hh = '00'
              this.mm = '00'
              this.ss = '00'
              clearInterval(this.timer)
            }
          }
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .el-input input {
    color: #000;
  }
}

/* reset element-ui css */
.login-container {
  .center .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $bg;
      height: 47px;
      caret-color: #000;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: $bg !important;
      }
    }
  }

  .center .el-form-item {
    border-bottom: 1px solid #E9ECF1;
    color: #000;
  }
}
</style>

<style lang="scss" >
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.sidebar-logo {
      width: 200px;
      height: 50px;
      vertical-align: middle;
      margin-right: 12px;
    }
.login-container {
  background: url("./img/newBack.jpg") top center no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;

  .center {
    position: relative;
    min-width: 750px;
    width: 23%;
    min-height: 420px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    justify-content: center;
    top: 23%;
  }
  .left {
    background: url("./img/leftlogo.png") no-repeat;
    background-size: auto 100% ;
    width: 350px;
  }
  .login-form {
    background: rgb(255, 255, 255);
    border-radius: 14px;
    position: relative;
    min-width: 430px;
    max-width: 100%;
    padding: 49px 35px 50px;
    overflow: hidden;
  }
  .title1 {
    font-size: 38px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #19273b;
    margin: 10px 0 30px 0;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 14px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.download {
  padding-left: 20px;
  font-size: 12px;
  color: #97A8BE;
}
.tips {
  font-size: 20px;
  padding: 0;
  margin-bottom: 0;
  white-space: pre-wrap;
  position: relative;
}
.safeone {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-left: 0;
  .qrcode {
    margin: 20px;
    width: 200px;
    height: 200px;
    position: relative;
  }
  .message {
    display: flex;
    flex-direction: column;
    margin-left: 30px;
  }
}
.load {
  font-size: 40px;
  position: absolute;
  top: 40%;
  left: 40%;
  display: auto;
}
.station {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.station > p,
.stations > p {
  display: flex;
  width: 100px;
  font-size: 14px;
  padding-left: 10px;
}
.stations {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.title_desc{
  font-weight: 600;
    font-size: 40px;
    line-height: 50px;
}
.login-form .el-form-item__label{
  font-size: 22px;
}
</style>
<!-- 移动端样式 -->
<style  lang="scss" >
/* 当屏幕宽度小于等于 768px 时应用的样式 */
@media (max-width: 800px) {
  .logoBox {
    width: 100%;
    margin-bottom: 40px;
  }
  .login-container {
    .center{
      padding: 0 22px;
    }
    .login-form{
      width: 100%;
      max-width: unset;
    }
    .sidebar-logo{
      width: 300px;
      height: auto;
    }
    .title_desc{
      text-align: center;
      line-height: 100%;
      // width: 100%;
      margin-top: 10px;
      font-size: 50px;
    }
  }
  }
</style>