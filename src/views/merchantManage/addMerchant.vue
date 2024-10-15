<template>
  <div class="main">
    <!-- 新增卡商 -->
    <p id="BasicInformation" class="title">{{id ? '编辑' : '新增'}}商户</p>
    <p class="title" style="font-size: 14px; margin-top: 20px;">基础信息</p>
    <div class="move">
      <!-- 商户ID： -->
      <div class="station">
        <p>商户ID：</p>
        <p>{{ id }}</p>
      </div>
      <!-- 商户名称： -->
      <div class="station">
        <p><i style="color:red">*</i>商户名称：</p>
        <el-input
          v-model.trim="mchName"
          autocomplete="off"
          :placeholder="'卡商名称'"
          class="management_input"
          :maxlength="20"
          @input="mchName=mchName.replace(/[^-a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
        />
      </div>
      <!-- 商户编号： -->
      <div class="station">
        <p><i style="color:red">*</i>商户编号：</p>
        <el-input
          v-model.trim="mchNo"
          autocomplete="off"
          :maxlength="20"
          :disabled="!!id"
          :placeholder="'商户编号'"
          class="management_input"
          @input="mchNo=mchNo.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
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
    <p class="title" style="font-size: 14px; margin-top: 20px;">服务信息</p>
    <div class="move">
      <!-- 商户编号： -->
      <div class="station">
        <p>TG群ID：</p>
        <el-input
          v-model.trim="tgNotificationId"
          autocomplete="off"
          :maxlength="50"
          class="management_input"
        />
      </div>
      <!-- 商户编号： -->
      <div class="station">
        <p>联系人：</p>
        <el-input
          v-model.trim="linkedName"
          autocomplete="off"
          :maxlength="20"
          class="management_input"
          @input="linkedName=linkedName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
        />
      </div>
      <!-- 商户编号： -->
      <div class="station">
        <p>联系邮箱：</p>
        <el-input
          v-model.trim="email"
          autocomplete="off"
          :maxlength="50"
          class="management_input"
          @input="email=email"
        />
      </div>
      <!-- 商户编号： -->
      <div class="station">
        <p>联系电话：</p>
        <el-input
          v-model.trim="phone"
          autocomplete="off"
          :maxlength="20"
          class="management_input"
          @input="phone=phone.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
        />
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
import { mchInfo_updateMch , mchInfo_addMch} from '@/api/merchant'
export default {
  name: 'addMerchant',
  data() {
    return {
      id:'',
      company:'',//归属企业
      mchName:'',//商户名称
      mchNo:'',//商户
      email:'',//e-mail 
      linkedName:'',//联系人姓名
      tgNotificationId:'',//TG群ID
      phone:'',//手机号码
      remark:'',//备注
      status:'1',//商户状态
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
      this.mchName = this.$route.query.mchName
      this.mchNo = this.$route.query.mchNo
      this.phone = this.$route.query.phone
      this.linkedName = this.$route.query.linkedName
      this.email = this.$route.query.email
      this.tgNotificationId = this.$route.query.tgNotificationId
    }
  },
  methods: {
    // 保存
    save(){
      const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
      if(this.email && !regEmail.test(this.email)) {
        return this.$message.warning('请输入正确的邮箱格式')
      }
      if(this.mchName.length < 2 || this.mchName.length > 20 ){
        return this.$message.warning('请填写正确的商户名称2-20位')
      }
      if(this.mchNo.length < 2 || this.mchNo.length > 20 ){
        return this.$message.warning('请填写正确的商户编号2-20位')
      }
      let res = ''
      this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if(this.id) {
        res = await mchInfo_updateMch({
          id:this.id,
          status: this.status,
          mchName:this.mchName,
          mchNo:this.mchNo,
          phone:this.phone,
          linkedName:this.linkedName,
          email:this.email,
          tgNotificationId:this.tgNotificationId,
        })
        if(res.code == '021-000-S-999') {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.$router.push({
          path:'/merchantManage/list'
        })
      }
      }else {
        res =await mchInfo_addMch({
          status: this.status,
          mchName:this.mchName,
          mchNo:this.mchNo,
          phone:this.phone,
          linkedName:this.linkedName,
          email:this.email,
          tgNotificationId:this.tgNotificationId,
        })
      }
      if(res.code == '021-000-S-999') {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.$router.push({
          path:'/merchantManage/list'
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
        this.$confirm('是否要禁用商户，禁用后商户所有账号无法登录商户端，所有收款，出款交易无法创建', '提示', {
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
