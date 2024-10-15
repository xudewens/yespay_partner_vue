<template>
  <!-- top巴西新增用户 -->
  <div class="background">
    <h2>新增用户</h2>
    <div class="main">
      <el-form
        ref="userForm"
        :model="userForm"
        label-position="top"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input
            v-model="userForm.username"
            style="width:50%"
          />
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            v-model="userForm.password"
            style="width:50%"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            v-model="userForm.remark"
            style="width:50%"
            type="textarea"
            :autosize="{ minRows: 4 }"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="head">
      <el-button style="margin-right: 60px;" @click="goback()">取消</el-button>
      <el-button type="primary" @click="add()">提交</el-button>
    </div>
  </div>
</template>

<script>
import { addUser } from '@/api/essential'
import MD5 from 'crypto-js/md5'
export default {
  name: 'IDNEWaddUser',
  data() {
    return {
      userForm: {
        username: '', // 用户名
        password: '', // 密码
        remark: '' // 备注
      }
    }
  },
  methods: {
    // 新建商户
    add() {
      const loading = this.$loading({
        lock: true,
        text: '正在提交',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      addUser({
        username: this.userForm.username,
        password: MD5(this.userForm.password).toString().toUpperCase(),
        remark: this.userForm.remark
      }).then(() => {
        this.$message.success('添加成功')
      }).finally(() => {
        loading.close()
      })
    },
    // 取消提交
    goback() {
      this.userForm.username = ''
      this.userForm.password = ''
      this.userForm.remark = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  background: #F0F2F5;
  min-height:calc(100vh - 85px);
  padding:20px;
  overflow:hidden;
}
h2 {
  margin: 0 0 20px 0;
}
.main {
  padding: 20px 30px;
  background: #ffffff;
}
.head {
  margin-top: 30px;
  text-align: center;
}
</style>
