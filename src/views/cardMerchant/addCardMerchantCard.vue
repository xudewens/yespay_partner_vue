<template>
  <!-- 新增商户 -->
  <div style="background: #f2f2f2;min-height: calc(100vh - 85px);padding: 20px;overflow: hidden;">
    <div class="header">
      <h2>{{ cardID ? '编辑' : '新增' }}卡商卡</h2>
      <el-steps v-if="!cardID" :active="active" align-center process-status="finish" style="width: 90%;cursor: pointer;">
        <el-step :title="'基本信息'" @click.native="handleStepClick(0)" />
        <el-step :title="'限额及报警'" @click.native="handleStepClick(1)" />
      </el-steps>
    </div>
    <div style="padding: 10px;position: relative; background-color: #fff;" v-if="cardID">
    <el-tabs v-model="activeName" class="records" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="0">
       
      </el-tab-pane>
      <el-tab-pane label="限额及报警" name="1">
      </el-tab-pane>
    </el-tabs>
  </div>
    <div class="content">
      <keep-alive>
        <BasicInformation
          v-if="active === 0"
          ref="basic"
          @nextClick="nextClick"
          @submitInfo="submitInfo"
          :mchData="basicInfo"
          :cardID="cardID"
        />
        <LimitsAlarms
          v-if="active === 1"
          ref="legal"
          @nextClick="nextClick"
          @submitRules="submitRules"
          :mchData="legalInfo"
          :cardID="cardID"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import BasicInformation from './shopList/basicInformation'
import LimitsAlarms from './shopList/limitsAlarms'
import { add_card,get_cardInfo,update_card,update_cardRule} from '@/api/card'
// import { merchants_list } from '@/api/essential'
export default {
  name: 'addCardMerchantCard',
  components: {
    BasicInformation,
    LimitsAlarms,
  },
  data() {
    return {
      active: 0, // 当前活动页
      cardID:'',
      maxStep: 0,
      activeName:'0',
      basicInfo:{},
      legalInfo:{},
      auditInfo: {}, // 全部参数
    }
  },
  mounted() {
    // this.searchAllMchList()
  },
  created () {
    this.cardID = this.$route.query.typeId
    if(this.$route.query.typeId) {
      console.log(this.$route.query.typeId,'========')
      // this.getCardInfo()
    }
  },
  methods: {
    // 点击步骤条切换
    handleStepClick(index) {
      if(!this.cardID) return
      this.active = index
      if (index !== this.active) {
        if (this.active === 0) {
          this.$refs.basic.nextClick()
        } else if (this.active === 1) {
          this.$refs.legal.nextClick()
          this.active = index
        }
        if (index <= this.maxStep) {
          this.active = index
        }
      }
    },
    // 上一步-当前页改变
    backClick(val) {
      this.active = val
    },
    handleClick(tab){
      this.active = +tab.name
    },
    // 点击下一步 - 缓存数据
    nextClick(val,active) {
      if (active === 1) {
        this.basicInfo = val
        this.active = active
      } else if (!val.active) {
        this.legalInfo = val
        this.submit()
      }
      this.maxStep = Math.max(this.maxStep, this.active)
    },
    // 新增提交
    async submit(){
      if(!this.basicInfo.weights) {
        this.basicInfo.weights = 1
      }
      this.legalInfo.data = JSON.stringify(this.legalInfo.data)
      this.basicInfo.expands = JSON.stringify(this.basicInfo.expands)
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
    },
    // 基础信息修改
  async submitInfo(value){
    this.basicInfo = value
    if(!this.basicInfo.weights) {
        this.basicInfo.weights = 1
      }
    this.basicInfo.expands = JSON.stringify(this.basicInfo.expands)
    // 提交接口
    const res = await update_card( this.basicInfo)
    if(res.code === '021-000-S-999') {
      this.$message.success('操作成功')
      console.log(res,'====更新银行卡信息====')
      this.$router.go(-1)
    }
  },
  //规则信息保存
  async submitRules(value){
    this.legalInfo = value
    console.log(this.legalInfo,'======this.legalInfo====')
    this.legalInfo.data = JSON.stringify(value.data)
    // 提交接口
    const res = await update_cardRule(this.legalInfo)
    console.log(this.legalInfo,'====更新银行卡规则信息=====')
    if(res.code === '021-000-S-999') {
      this.$message.success('操作成功')
      console.log(res,'====更新银行卡信息====')
      this.$router.go(-1)
    }
  },

  async getCardInfo(){
    const res = await get_cardInfo(this.cardID)
    this.basicInfo = res.data
    console.log(res,'==============')
    },
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
