<template>
  <div class="main">
    <!-- 新增卡商 -->
    <p id="BasicInformation" class="title">关联员工</p>
    <div class="move">
      <!-- 员工昵称： -->
      <div class="station">
        <p><i style="color:red">*</i>角色名称：</p>
        <el-input
          v-model.trim="roleName"
          autocomplete="off"
          disabled
          :placeholder="'员工昵称'"
          class="management_input"
          :maxlength="20"
        />
      </div>
    </div>
    <!-- 备注 -->
    <div style="width: 100%;padding:0 60px;">
        <p style="font-size: 12px;">角色描述：</p>
        <el-input
          v-model.trim="remark"
          autocomplete="off"
          disabled
          type="textarea"
          :rows="2" 
          placeholder="备注"
          @input="remark=remark"
        />
    </div>
    <!-- 选择角色穿梭框 -->
    <div style="width: 100%;padding:20px 60px;">
      <el-transfer
        :titles="['可选员工','已选员工']"
        v-model="value"
        :data="datatree"
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
import { get_roleUser,updateRoleUser} from '@/api/user'
import { arraysHaveSameElements } from '@/filters'
export default {
  name: 'addMerchant',
  data() {
    return {
      id:'',
      roleName:'',//商户名称
      remark:'',//e-mail 
      datatree: [],
      value: [],
      startIds:[],
      props:{
        key:'id',
        label:'username'
      },
      allIds:[],
    }
  },
  computed: {

  },
  watch: {
   
  },
  activated() {
  
  },
  created () {
    this.id = this.$route.query.id
    this.roleName = this.$route.query.roleName
    this.remark = this.$route.query.remark
    if(this.id){
      this.getRolusUser()
    }
  },
  methods: {
    // 获取角色相关用户
   async getRolusUser() {
      const res = await get_roleUser(this.id)
      console.log(res,'======获取角色相关用户====')
      if(!res.data.users){
        res.data.users = []
      }
      if(!res.data.unusedUsers){
        res.data.unusedUsers = []
      }
      this.datatree = [...res.data.users,...res.data.unusedUsers]
      this.datatree.forEach(item => {
        this.allIds.push(item.id)
      })
      res.data.users.forEach(item => {
        if(this.allIds.includes(item.id)){
          this.value.push(item.id)
        }
        this.startIds = [...this.value]
      })
    },
    // 保存 更新角色对应用户
    save(){
      let res = ''
      this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if(!arraysHaveSameElements(this.value,this.startIds)){
          res = await updateRoleUser({
            id:this.id,
            userIds:this.value
          })
        }
      
        if(res.code == '021-000-S-999' || !res) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          setTimeout(() => {
            this.$router.push({
              path:'/systemManage/roleManage'
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
