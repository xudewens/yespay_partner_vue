<template>
  <!-- 订单操作 -->
  <div class="main">
    <!-- 基本信息 -->
    <p id="BasicInformation" class="title">{{ id ? '编辑' : '新增' }}卡商</p>
    <div class="move">
      <!-- 卡商ID： -->
      <div class="station">
        <p>卡商ID：</p>
        <p>{{ id }}</p>
      </div>
      <!-- 卡商名称： -->
      <div class="station">
        <p><i style="color:red">*</i>卡商名称：</p>
        <el-input
          v-model.trim="dealerName"
          autocomplete="off"
          :placeholder="'卡商名称'"
          class="management_input"
          :maxlength="20"
          @input="dealerName=dealerName.replace(/[^-a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
        />
      </div>
      <!-- 卡商编号： -->
      <div class="station">
        <p><i style="color:red">*</i>卡商编号：</p>
        <el-input
          v-model.trim="dealerNo"
          autocomplete="off"
          :maxlength="20"
          :disabled="!!id"
          :placeholder="'卡商编号'"
          class="management_input"
          @input="dealerNo=dealerNo.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
        />
      </div>
      <!-- 状态： -->
      <div class="station" style="position:relative">
        <p><i style="color:red">*</i>状态：</p>
        <el-radio-group v-model="status" @change="changeStatus">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </div>
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
import Cookies from 'js-cookie'
import { update_dealerInfo , add_dealerInfo} from '@/api/card'
export default {
  name: 'AddcardMerchant',
  data() {
    return {
      id:'',
      company:'',//归属企业
      dealerName:'',//卡商名称
      dealerNo:'',//卡商编号
      email:'',//e-mail 
      linkedName:'',//联系人姓名
      phone:'',//手机号码
      remark:'',//备注
      status:'1',//卡商状态
      type:'',//卡商类型
      statusOption: [
        {
          label : '启用',
          value: '1'
        },{
          label : '禁用',
          value: '0'
        },
      ]
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
      this.status = ''+this.$route.query.status
      this.dealerName = this.$route.query.dealerName
      this.dealerNo = this.$route.query.dealerNo
    }
  },
  methods: {
    // 保存
    save(){
      if(this.dealerName.length < 2 || this.dealerName.length > 20 ){
        return this.$message.warning('请填写正确的卡商名称2-20位')
      }
      if(this.dealerNo.length < 2 || this.dealerNo.length > 20 ){
        return this.$message.warning('请填写正确的卡商编号2-20位')
      }
      let res = ''
      this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if(this.id) {
        res = await update_dealerInfo({
          id:this.id,
          status: this.status,
          dealerName:this.dealerName,
          dealerNo:this.dealerNo
        })
        if(res.code == '021-000-S-999') {
          console.log('success=======')
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$router.push({
            path:' /merchantManage'
          })
      }
      }else {
        res =await add_dealerInfo({
          status: this.status,
          dealerName:this.dealerName,
          dealerNo:this.dealerNo
        })
      }
      if(res.code == '021-000-S-999') {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.$router.push({
            path:' /merchantManage'
          })
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
        this.$confirm('是否要禁用卡商，禁用后卡商所有操作账号无法登录卡商端', '提示', {
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
      this.$confirm('是否要取消编辑?', '提示', {
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
    }
  }
   
}
</script>

<style scoped lang='scss'>
.main {
  background: #FFFFFF;
  padding: 20px;
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
