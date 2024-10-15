<template>
  <div class="main">
    <!-- 新增卡商 -->
    <p id="BasicInformation" class="title">{{id ? '编辑' : '新增'}}员工</p>
    <div class="move">
      <!-- 员工昵称： -->
      <div class="station">
        <p><i style="color:red">*</i>员工昵称：</p>
        <el-input
          v-model.trim="nickname"
          autocomplete="off"
          :placeholder="'员工昵称'"
          class="management_input"
          :maxlength="50"
        />
      </div>
      <!-- 登录账号： -->
      <div class="station">
        <p><i style="color:red">*</i>登录账号：</p>
        <el-input
          v-model.trim="username"
          autocomplete="off"
          :maxlength="20"
          :disabled="!!id"
          :placeholder="'登录账号'"
          class="management_input"
        />
      </div>
      <!-- 登陆密码： -->
      <div class="station"  v-if="!id">
        <p><i style="color:red">*</i>登陆密码：</p>
        <el-input
          v-model.trim="password"
          autocomplete="off"
          placeholder="登陆密码"
          :maxlength="20"
          :type="inputType"
          class="management_input"
          @input.native="password=password.replace(/[^a-zA-Z0-9`~·!@#$%^&*_+-=\\|;:?]/g, '')"
        >
        <i slot="suffix" class="el-icon-view" style="cursor:pointer;line-height: 40px;" @click="isPassword = !isPassword" />
      </el-input>
        <el-button type="text" style="margin-left: 8px;" @click="autoGeneral()">自动生成</el-button>
      </div>
      <!-- 状态： -->
      <div class="station" style="position:relative" v-if="id">
        <p><i style="color:red">*</i>状态：</p>
        <el-radio-group v-model="status" @change="changeStatus">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </div>
      <!-- 谷歌验证器 -->
      <div class="station" v-if="id">
        <p>谷歌验证器：</p>
          <div v-if="bindGoogle == 0" class="processing">未绑定</div><!-- 未绑定 -->
          <div v-if="bindGoogle == 1" class="success">已绑定</div><!-- 已绑定 -->
          <el-button
            v-if="bindGoogle == 1"
            type="text"
            style="margin-left:10px;padding-top: 6px;padding-bottom: 6px;"
            @click="untie()"
          >解绑</el-button>
      </div>
    </div>
    <!-- 备注 -->
    <div style="width: 100%;padding:0 60px;">
        <p style="font-size: 12px;">备注：</p>
        <el-input
          v-model.trim="remark"
          autocomplete="off"
          :maxlength="100"
          type="textarea"
          :rows="2" 
        />
    </div>
    <!-- 选择角色穿梭框 -->
    <div style="width: 100%;padding:20px 60px;">
      <p style="font-size: 12px;"><i style="color:red">*</i>选择角色:</p>
      <el-transfer
        :titles="['可选角色','已选角色']"
        v-model="roleIds"
        :data="dataTree"
        :props="props">
      </el-transfer>
    </div>
    <div class="head">
      <el-button
        style="margin-right: 60px;"
        @click="back()"
      >取消</el-button>
      <el-button type="primary" @click="save()">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { role_page,user_addUser,user_unbind,updateUser,updateUserRole} from '@/api/user'
import { arraysHaveSameElements } from '@/filters'
import MD5 from 'crypto-js/md5'
export default {
  name: 'addMerchant',
  data() {
    return {
      id:'',
      nickname:'',//员工昵称
      username:'',//登录账号：
      password:'',//登陆密码：
      bindGoogle:0,//谷歌验证器绑定状态
      remark:'',//备注
      status:'1',//员工状态
      isPassword: true, // 密码是否密文显示
      statusOption: [
        {
          label : '启用',
          value: '1'
        },{
          label : '禁用',
          value: '0'
        },
      ],
      dataTree:[],
      roleIds:[],//已选IDs
      allIds:[],
      roleName:[],
      startRoleIds:[],//编辑回显初始选中ID
      props:{
        key:'id',
        label:'roleName'
      },
    }
  },
  computed: {

  },
  watch: {
   
  },
  activated() {
  
  },
  created () {
    if(this.$route.query.id) { //有id表示编辑
      this.id = this.$route.query.id
      this.bindGoogle = this.$route.query.bindGoogle ? 1: 0
      this.status = !this.$route.query.status ? '1' : '0'
      this.nickname = this.$route.query.nickname
      this.remark = this.$route.query.remark
      this.username = this.$route.query.username
      this.roleIds = Array.isArray(this.$route.query.roleList) ? this.$route.query.roleList : [this.$route.query.roleList]
      this.startRoleIds = Array.isArray(this.$route.query.roleList) ? this.$route.query.roleList : [this.$route.query.roleList]
    }
    this.getTableData()
  },
  computed: {
    // 切换密码明文密文
    inputType() {
      return this.isPassword ? 'password' : 'text'
    }
  },
  methods: {
    // 读取全部列表
    getTableData() {
      role_page({
        size: 999,
        current: 1,
      }).then((res) => {
        this.dataTree = res.data.records
      })
    },
    // 保存
    save(){
      if(!this.nickname) {
        return this.$message.warning('请填写正确的员工昵称')
      }else if (!this.username) {
        return this.$message.warning('请填写正确的登录账号')
      }else if ((!this.password || this.password.length < 6) && !this.id) {
        return this.$message.warning('请填写正确的登录密码')
      }else if(this.roleIds.length < 1) {
        return this.$message.warning('请至少选择一个角色')
      }
      let res = ''
      let rolesRes = ''
      this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if(this.id) {
        let statusCopy  = !this.$route.query.status ? '1' : '0'
        let nickname = this.nickname === this.$route.query.nickname ? undefined : this.nickname
        let remark = this.remark === this.$route.query.remark ? undefined : this.remark
        let status = this.status === statusCopy ? undefined : this.status
        let statusVal = ''
        if(status === undefined) {
          statusVal = undefined
        }else if(status === '1') {
          statusVal = false
        }else {
          statusVal = true
        }

        if(!arraysHaveSameElements(this.roleIds,this.startRoleIds)){
           rolesRes = await updateUserRole({
            id:this.id,
            roleIds:this.roleIds,
          })
        }

        if(nickname || remark || status){
             res = await updateUser({
              id:this.id,
              nickname,
              remark,
              status:statusVal
          })
        }

        if(res.code == '021-000-S-999' || rolesRes.code == '021-000-S-999') {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          setTimeout(() => {
            this.$router.push({
              path:'/systemManage/userManage'
            })
        }, 500);
        }else if (!rolesRes && !res){
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          setTimeout(() => {
            this.$router.push({
              path:'/systemManage/userManage'
            })
        }, 500);
        }
      }else {
        res =await user_addUser({
          nickname:this.nickname,
          password:MD5(this.password).toString().toUpperCase(),
          remark:this.remark,
          roleIds:this.roleIds,
          username:this.username,
        })
      }
      if(res.code == '021-000-S-999') {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        setTimeout(() => {
            this.$router.push({
              path:'/systemManage/userManage'
            })
        }, 500);
      }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    //  切换状态
    changeStatus(val){
      console.log(val)
      val == '1' ? this.status = '0' : this.status = '1'
      if(val == '0'){
        this.$confirm('是否要禁用，禁用后改账号将不能登录', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.status = '0'
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });          
          });
        }else {
          this.status = '1'
        }
    },
    back(){
      this.$confirm('是否要取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    // 密码生成
    autoGeneral() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~·!@#$%^&*_+-=;:?';
        const passwordLength = Math.floor(Math.random() * 15) + 6; // 生成 6 到 20 之间的随机长度

        let password = '';
        for (let i = 0; i < passwordLength; i++) {
            const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
            password += randomChar;
        }
          this.password = password
    },
    // 解绑员工的谷歌验证器
    untie() {
      this.$confirm('是否确认解绑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        user_unbind({
          id:this.id
        }).then((res) => {
          this.$message.success('操作成功')
          this.bindGoogle = 0
        })
      }).catch((error) => {
        console.log(error)
        this.$message.info('取消操作')
      })
    },
  }
   
}
</script>

<style scoped lang='scss'>
.main {
  background: #FFFFFF;
  padding: 20px;
}
::v-deep .el-transfer-panel {
  width: 35%!important;
  // height: 400px;
}
.head {
  position: fixed;
  width: 100%;
  padding: 20px;
  bottom: 0;
  margin-top: 30px;
  text-align: center;
}
.title {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}
.move {
  margin-bottom: 30px;
}
.station {
  display: flex;
  align-items: center;
  margin: 25px 30px 0 0;
  width: 350px;
}
.station>p {
  text-align: right;
  width: 200px !important;
  font-size: 12px;
  margin: 0;
}
.management_input {
  width: 300px !important;
}
.title {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}
.titles {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  display: inline-block;
}
.update_but {
  font-size: 12px;
  margin-left: 20px;
}
</style>

<style>
.passwordInput .el-input__suffix {
  top: 12px !important;
}
</style>
