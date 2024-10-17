<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="nav-list-container-left">
      <img src="@/assets/YesPayLogo.png" class="sidebar-logo_new">
      <div v-for="(item,index) in navList" :key="index" class="nav-item" :class="{'nav-item-active':$route.path===item.path}" @click="handleJump(item.path)">
        <i :class="item.iconName" class="navbar-icon" /><span>{{ item.text }}</span>
      </div>
    </div>

    <div v-if="this.device === 'mobile'" class="right-menu" @click="drawer = true">
      <i class="el-icon-s-fold icon-menu" />
    </div>
    <div v-else class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="./img/4.png" class="user-avatar">
          <span class="username">{{ username }}</span>
          <div><i class="el-icon-caret-bottom" /></div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="login_copy">
            <span style="display: block">修改登录密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码 -->
    <el-dialog
      title="修改登录密码"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialogFormVisible"
    >
      <el-form
        ref="passwordForm"
        :model="passwordForm"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="原密码：" prop="password">
          <el-input
            v-model.trim="passwordForm.password"
            show-password
            autocomplete="off"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input
            v-model.trim="passwordForm.newPassword"
            show-password
            autocomplete="off"
            maxlength="20"
            onkeyup="this.value = this.value.replace(/[^a-zA-Z0-9`~·!@#$%^&*_+-=\\|;:?]/g, '')"
            @blur="passwordForm.newPassword = $event.target.value"
            @input.native="checkFormat(passwordForm.newPassword)"
          />
          <p style="margin: 0;color: red;">提示：密码必须包含大小写字母、数字、特殊字符四种组合且位数10位以上。特殊字符仅包括：!@#%&*_+-=;:?</p>
        </el-form-item>
        <el-form-item label="密码强度:" prop="percentage">
          <el-progress
            :percentage="passwordForm.percentage"
            :color="customColorMethod"
            :format="format"
            style="width: 100%;margin: 13px 0;"
          />
        </el-form-item>
        <el-form-item label="确认新密码：" prop="truePassword">
          <el-input
            v-model.trim="passwordForm.truePassword"
            show-password
            autocomplete="off"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="谷歌验证码：" prop="googleCode">
          <el-input
            v-model.trim="passwordForm.googleCode"
            style="width: 100%"
          />
        </el-form-item>
        <!--  -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="user_true()">确 认</el-button>
      </div>
    </el-dialog>
    <DrawerNav :drawer="drawer" :username="username" />
  </div>
</template>

<script>
import { updateLoginPassword } from '@/api/essential'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import MD5 from 'crypto-js/md5'
import DrawerNav from './drawerNav.vue'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    DrawerNav
  },
  data() {
    return {
      drawer: false,
      username: '', // 用户名
      dialogFormVisible: false, // 修改密码的弹窗
      passwordForm: {
        password: '', // 原密码
        newPassword: '', // 新密码
        percentage: 0, // 密码强度
        truePassword: '', // 确认新密码
        googleCode: '' // 谷歌验证码
      },
      rules: { // 修改密码规则
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在10-20位之间', trigger: 'blur' }
        ],
        percentage: [
          {
            required: false,
            validator: (rule, value, callback) => {
              if (value && value !== 100) {
                callback(new Error('登录密码强度不足，请检查后重新输入'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        truePassword: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value && value !== this.passwordForm.newPassword) {
                callback(new Error('两次密码输入不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '谷歌验证码长度为6位', trigger: 'blur' }
        ]
      },
      navList: [
        {
          text: '首页',
          iconName: 'el-icon-s-marketing',
          path: '/homePage'

        },
        {
          text: '查单',
          iconName: 'el-icon-s-order',
          path: '/merchantManage/orderSearch'

        }
      ]
    }
  },
  computed: {
    device() {
      return this.$store.state.app.device
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  mounted() {
    this.username = localStorage.getItem(process.env.VUE_APP_PARAM + '_USERNAME')
  },
  methods: {

    handleJump(path) {
      this.$router.push(path)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 修改登录密码-打开弹窗
    login_copy() {
      this.dialogFormVisible = true
    },
    // 进度条颜色
    customColorMethod(percentage) {
      if (percentage <= 20) {
        return '#FF0000'
      } else if (percentage > 20 && percentage <= 40) {
        return '#FF8C00'
      } else if (percentage > 40 && percentage <= 60) {
        return '#EEC900'
      } else if (percentage > 60 && percentage <= 80) {
        return '#9ACD32'
      } else {
        return '#67C23A'
      }
    },
    // 进度条文字
    format(percentage) {
      if (percentage === 0) {
        return ''
      } else if (percentage > 0 && percentage <= 20) {
        return '弱'
      } else if (percentage > 20 && percentage <= 40) {
        return '较弱'
      } else if (percentage > 40 && percentage <= 60) {
        return '中等'
      } else if (percentage > 60 && percentage <= 80) {
        return '较强'
      } else {
        return '强'
      }
    },
    // 密码格式校验
    checkFormat(val) {
      this.passwordForm.percentage = this.$formatCheck(val)
    },
    // 确定-修改登录密码
    user_true() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          updateLoginPassword({
            password: MD5(this.passwordForm.password).toString().toUpperCase(),
            newPassword: MD5(this.passwordForm.newPassword).toString().toUpperCase(),
            googleCode: this.passwordForm.googleCode
          }).then(() => {
            this.$message.success('修改成功！')
            this.dialogFormVisible = false
          })
        } else {
          return false
        }
      })
    },
    // 关闭修改密码弹窗
    closeDialogFormVisible() {
      this.passwordForm.password = ''
      this.passwordForm.newPassword = ''
      this.passwordForm.truePassword = ''
      this.passwordForm.googleCode = ''
      this.percentage = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 58px;
  overflow: hidden;
  position: relative;
  background: #2e3046;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .navbar-icon {
    font-size: 20px;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    // float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    // float: left;
  }

  .imgage {
    width: 130px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    // float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      cursor: pointer;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }

    }

    .avatar-container {
      margin-right: 15px;

      .avatar-wrapper {
        // margin-top: 5px;
        // position: relative;

        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        // .el-icon-caret-bottom {
        //   cursor: pointer;
        //   position: absolute;
        //   right: -20px;
        //   top: 25px;
        //   font-size: 12px;
        // }

      }
    }
  }
  .icon-menu{
          cursor: pointer;
          font-size: 36px;
          color: #fff;
        }
}
.nav-list-container-left{
  display: flex;
  align-items: center;
}
.nav-item{
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100px;
  height: 36px;
  // background-color: #2e3046;
  border: 1px solid #fff;
  border-radius: 4px;
  padding: 6px 18px;
  text-align: center;
  margin-right: 20px;
  color: #fff;
  cursor: pointer;
}
.nav-item-active{
  background-color: #676cf6;
}
.username{
  font-size: 14px;
  margin-left:10px;
}
.sidebar-logo_new{
  width: 200px;
  height: auto;
  vertical-align: middle;
  margin-right: 12px;
}
</style>
<style lang="scss">
@media (max-width: 800px) {
.navbar{
  height: 90px !important;
}
.right-menu{
  display: flex;
  align-items: center;
}
}
</style>
