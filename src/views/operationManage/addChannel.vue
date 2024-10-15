<template>
  <!-- 新增通道 -->
  <div style="background: #f2f2f2;min-height: calc(100vh - 85px);padding: 20px;overflow: hidden;">
    <div class="header">
      <h2>{{cardID? '编辑' : '新增'}}通道</h2>
      <!-- <el-steps v-if="cardID" :active="active" align-center process-status="finish" style="width: 90%;cursor: pointer;">
        <el-step :title="'基本信息'" @click.native="handleStepClick(0)" />
        <el-step v-if="cardID" :title="'商户信息'" @click.native="handleStepClick(1)" />
        <el-step v-if="cardID" :title="'配卡策略'" @click.native="handleStepClick(2)" />
      </el-steps> -->
    </div>
    <div style="padding: 10px;position: relative; background-color: #fff;" v-if="cardID">
    <el-tabs v-model="activeName" class="records" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="0">
       
      </el-tab-pane>
      <el-tab-pane label="商户信息" name="1">
 
      </el-tab-pane>
      <el-tab-pane label="配卡策略" name="2">
      </el-tab-pane>
    </el-tabs>
  </div>
    <div class="content">
      <keep-alive>
        <BasicInformation
          v-if="active === 0"
          ref="basic"
          @nextClick="submitInfo"
          :dataInfo="basicInfo"
        />
        <Merchant
          v-if="active === 1"
          ref="merchant"
          @nextClick="submitChannel"
          :dataInfo="legalInfo"
        />
        <LimitsAlarms
          v-if="active === 2"
          ref="legal"
          @submitCL="submitCL"
          :dataInfo="legalInfo"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import BasicInformation from './shopList/basicInformation'
import LimitsAlarms from './shopList/limitsAlarms'
import Merchant from './shopList/merchant'
import { add_card } from '@/api/card'
import { addChannel,mchChannelUpdate,channelCardUpdate,updateChannel} from '@/api/channel'
// import { merchants_list } from '@/api/essential'
export default {
  name: 'addChannel',
  components: {
    BasicInformation,
    LimitsAlarms,
    Merchant
  },
  data() {
    return {
      active: 0, // 当前活动页
      cardID:'',
      channelId:'',
      maxStep: 3,
      basicInfo:{},
      legalInfo:{},
      auditInfo: {}, // 全部参数
      activeName:'0'
    }
  },
  mounted() {
    // this.searchAllMchList()
  },
  created () {
    this.cardID = this.$route.query.id
  },
  methods: {
    // 点击步骤条切换
    handleStepClick(index) {
      this.active = index
      console.log(this.active)
      if (index !== this.active) {
        if (this.active === 0) {
          this.$refs.basic.nextClick()
        } else if (this.active === 2) {
          this.$refs.legal.nextClick()
          this.active = index
        }else if (this.active === 1) {
       
        }
        if (index <= this.maxStep) {
          this.active = index
        }
      }
    },
    handleClick(tab){
      this.active = +tab.name
    },
    // 上一步-当前页改变
    backClick(val) {
      this.active = val
    },

    // 商户信息提交
    async submitChannel(value){
        value.forEach(item => {
          item.channelId = this.channelId || this.cardID
        });
        const res = await mchChannelUpdate({
          list:value
        })
        if(res.code==='021-000-S-999'){
          this.$message.success('提交成功')
          this.$router.go(-1)
        }
    },

    // 基本信息提交
    async submitInfo(value){
      value.state = value.state == '1' ? true : false
      if(value.type === 'COMMON') {
        value.designatedMchId = ''
      }
      if(this.cardID){
        const data = {}
        data.id = this.cardID
        data.mchId = value.designatedMchId
        data.remark = value.remark
        data.type = value.type
        data.state = value.state == '1' ? true :false
        const res = await updateChannel(data)
          console.log(res,'====基本信息=====')
          if(res.code==='021-000-S-999'){
            this.$message.success('提交成功')
            this.channelId = res.data
            this.$router.go(-1)
        }
      }else{
          const res = await addChannel(value)
          console.log(res,'====基本信息=====')
          if(res.code==='021-000-S-999'){
            this.$message.success('提交成功')
            this.channelId = res.data
            this.$router.go(-1)
        }
      }
    
    },
    // 策略信息提交
    async submitCL(value){
      const list = []
      value.forEach(item => {
        if(!value.weights) {
          item.weights = 1
        }
        list.push({
          cardId:item.cardId,
          channelId: this.channelId || this.cardID,
          status:item.status,
          weights:item.weights
        })
      })
      const res = await channelCardUpdate({
        list,
      })
      console.log(res,'====策略信息=====')
      if(res.code==='021-000-S-999'){
        this.$message.success('操作成功')
        // this.channelId = res.data
        // this.$router.push({
        //   path:'/operationManage/channelConfig'
        // })
      }
    },
    // 点击下一步 - 缓存数据
    nextClick(val) {
      if (val.active === 1) {
        this.basicInfo = val
        this.active = val.active
      } else if (!val.active) {
        this.legalInfo = val
        this.submit()
      }
      this.maxStep = Math.max(this.maxStep, this.active)
    },
    // 新增提交
   async submit(){
    this.legalInfo.data = JSON.stringify(this.legalInfo.data)
    this.basicInfo.expands = JSON.stringify(this.legalInfo.expands)
    delete  this.basicInfo.id
    delete  this.basicInfo.active
     const res = await add_card({
      ...this.basicInfo,
      cardRule:{
        ...this.legalInfo
      }
     })
     console.log(res,'=======')
     if(res.code === "021-000-S-999") {
      this.$router.push({
        path:'/cardMerchant/cardMerchantCard'
      })
     }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}
h2 {
  margin: 0 20px 0 0;
  min-width: 100px;
}
.content {
  background: #FFFFFF;
  padding: 20px;
  width: 100%;
  height: 75vh;
  overflow: auto;
}
::v-deep .no-asterisk .el-form-item__label:before {
  display: none;
}
</style>
