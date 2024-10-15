<template>
  <!-- 限额及报警 -->
  <div>
    <div class="main">
      <!-- 每笔限制 -->
      <p class="title">每笔限制</p>
      <div class="move">
        <!-- 最低收款金额（Rp） -->
        <div class="station">
          <p>最低<span class="Collection">收款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.payMinLimit"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入最低收款金额"
            class="management_input"
            @input="dataInfo.payMinLimit=dataInfo.payMinLimit.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
        </div>
        <!-- 最高收款金额（Rp） -->
        <div class="station">
          <p>最高<span class="Collection">收款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.payMaxLimit"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入最高收款金额"
            class="management_input"
            @input="dataInfo.payMaxLimit=dataInfo.payMaxLimit.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
        </div>
        <!-- 最低出款金额（Rp） -->
        <div class="station">
          <p>最低<span class="Disbursement">出款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.loanMinLimit"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入最低出款金额"
            class="management_input"
            @input="dataInfo.loanMinLimit=dataInfo.loanMinLimit.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
        </div>
        <!-- 最高出款金额（Rp） -->
        <div class="station">
          <p>最高<span class="Disbursement">出款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.loanMaxLimit"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入最高出款金额"
            class="management_input"
            @input="dataInfo.loanMaxLimit=dataInfo.loanMaxLimit.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
        </div>
      </div>
      <!-- 每日限制及报警 -->
      <p class="title">每日限制及报警</p>
      <div class="move">
        <!-- 累计收款笔数 -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Collection">收款</span>笔数：</p>
          <el-input
            v-model.trim="dataInfo.data.daily.pay.totalCount"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入最低收款笔数"
            class="management_input"
            @input="dataInfo.data.daily.pay.totalCount = dataInfo.data.daily.pay.totalCount.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.daily.pay.totalCountSwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计收款金额（Rp） -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Collection">收款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.data.daily.pay.totalMoney"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计收款金额"
            class="management_input"
            @input="dataInfo.data.daily.pay.totalMoney=dataInfo.data.daily.pay.totalMoney.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.daily.pay.totalMoneySwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计出款笔数 -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Disbursement">出款</span>笔数：</p>
          <el-input
            v-model.trim="dataInfo.data.daily.loan.totalCount"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计出款笔数"
            class="management_input"
            @input="dataInfo.data.daily.loan.totalCount=dataInfo.data.daily.loan.totalCount.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.daily.loan.totalCountSwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计出款金额（Rp） -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Disbursement">出款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.data.daily.loan.totalMoney"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计出款金额"
            class="management_input"
            @input="dataInfo.data.daily.loan.totalMoney=dataInfo.data.daily.loan.totalMoney.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.daily.loan.totalMoneySwitch">开启报警</el-checkbox>
        </div>
      </div>
      <!-- 每周限制及报警 -->
      <p class="title">每周限制及报警</p>
      <div class="move">
        <!-- 累计收款笔数 -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Collection">收款</span>笔数：</p>
          <el-input
            v-model.trim="dataInfo.data.weekly.pay.totalCount"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计收款笔数"
            class="management_input"
            @input="dataInfo.data.weekly.pay.totalCount=dataInfo.data.weekly.pay.totalCount.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.weekly.pay.totalCountSwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计收款金额（Rp） -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Collection">收款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.data.weekly.pay.totalMoney"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计收款金额"
            class="management_input"
            @input="dataInfo.data.weekly.pay.totalMoney=dataInfo.data.weekly.pay.totalMoney.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.weekly.pay.totalMoneySwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计出款笔数 -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Disbursement">出款</span>笔数：</p>
          <el-input
            v-model.trim="dataInfo.data.weekly.loan.totalCount"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计出款笔数"
            class="management_input"
            @input="dataInfo.data.weekly.loan.totalCount=dataInfo.data.weekly.loan.totalCount.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.weekly.loan.totalCountSwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计出款金额（Rp） -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Disbursement">出款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.data.weekly.loan.totalMoney"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计出款金额"
            class="management_input"
            @input="dataInfo.data.weekly.loan.totalMoney=dataInfo.data.weekly.loan.totalMoney.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.weekly.loan.totalMoneySwitch">开启报警</el-checkbox>
        </div>
      </div>
      <!-- 每月限制及报警 -->
      <p class="title">每月限制及报警</p>
      <div class="move">
        <!-- 累计收款笔数 -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Collection">收款</span>笔数：</p>
          <el-input
            v-model.trim="dataInfo.data.monthly.pay.totalCount"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计收款笔数"
            class="management_input"
            @input="dataInfo.data.monthly.pay.totalCount=dataInfo.data.monthly.pay.totalCount.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.monthly.pay.totalCountSwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计收款金额（Rp） -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Collection">收款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.data.monthly.pay.totalMoney"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计收款金额"
            class="management_input"
            @input="dataInfo.data.monthly.pay.totalMoney=dataInfo.data.monthly.pay.totalMoney.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.monthly.pay.totalMoneySwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计出款笔数 -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Disbursement">出款</span>笔数：</p>
          <el-input
            v-model.trim="dataInfo.data.monthly.loan.totalCount"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计出款笔数"
            class="management_input"
            @input="dataInfo.data.monthly.loan.totalCount=dataInfo.data.monthly.loan.totalCount.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.monthly.loan.totalCountSwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计出款金额（Rp） -->
        <div class="station">
          <p><i style="color:red">*</i>累计<span class="Disbursement">出款</span>金额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.data.monthly.loan.totalMoney"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入累计出款金额"
            class="management_input"
            @input="dataInfo.data.monthly.loan.totalMoney=dataInfo.data.monthly.loan.totalMoney.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.monthly.loan.totalMoneySwitch">开启报警</el-checkbox>
        </div>
      </div>
      <p class="title">余额报警</p>
      <div class="move">
        <!-- 累计收款笔数 -->
        <div class="station">
          <p><i style="color:red">*</i>最低余额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.data.minimumBalance"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入最低余额"
            class="management_input"
            @input="dataInfo.data.minimumBalance=dataInfo.data.minimumBalance.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.minimumBalanceSwitch">开启报警</el-checkbox>
        </div>
        <!-- 累计收款金额（Rp） -->
        <div class="station">
          <p><i style="color:red">*</i>最高余额（Rp）：</p>
          <el-input
            v-model.trim="dataInfo.data.maximumBalance"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入最高余额"
            class="management_input"
            @input="dataInfo.data.maximumBalance=dataInfo.data.maximumBalance.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
          <el-checkbox v-model="dataInfo.data.maximumBalanceSwitch">开启报警</el-checkbox>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="head">
      <el-button style="margin-right: 30px;" @click="reback()">取消</el-button>
      <el-button  type="primary" @click="addMchInfos()">完成</el-button>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import {get_cardRule} from '@/api/card'
export default {
  name: 'limitsAlarmsCard',
  props: {
    mchData: { // 编辑回显的数据
      type: Object,
      default: () => {}
    },
    cardID:{
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
     dataInfo:{ 
      loanMaxLimit:10000000,//出款单笔最大限额
      loanMinLimit:10000,//出款单笔最小限额 
      payMaxLimit:10000000,//代收单笔最大限额 
      payMinLimit:10000,//代收单笔最小限额
      data:{
        "daily": {
          "pay": {
            "totalCount": 1000,
            "totalCountSwitch": true,
            "totalMoney": 100000,
            "totalMoneySwitch": true
              },
            "loan": {
              "totalCount": 5000,
              "totalCountSwitch": true,
              "totalMoney": 500000,
              "totalMoneySwitch": true
            }
          },
          "weekly": {
            "pay": {
              "totalCount": 5000,
              "totalCountSwitch": true,
              "totalMoney": 500000,
              "totalMoneySwitch": true
            },
            "loan": {
              "totalCount": 25000,
              "totalCountSwitch": true,
              "totalMoney": 2500000,
              "totalMoneySwitch": true
            }
          },
          "monthly": {
            "pay": {
              "totalCount": 2000,
              "totalCountSwitch": true,
              "totalMoney": 2000000,
              "totalMoneySwitch": true
            },
            "loan": {
              "totalCount": 1000,
              "totalCountSwitch": true,
              "totalMoney": 10000000,
              "totalMoneySwitch": true
            }
          },
          "minimumBalance": 10000,
          "minimumBalanceSwitch": true,
          "maximumBalance": 1000000,
          "maximumBalanceSwitch": true
          }
        },
    }
  },
  computed: {

  },
  mounted() {
    console.log(this.cardID,'=====cardId=====')
    if(this.cardID) {
      this.getCardRule()
    }
  },
  watch: {
    mchData: {
      deep: true,
      immediate: true,
      handler(val, oldval) {
        if (val !== oldval && val.length && this.type === 'edit') {
          this.getTableData(val)
        }
      }
    }
  },
  // activated() {
  //   if (this.type !== 'edit' && this.name === '') {
  //     this.chooseCountry(JSON.parse(localStorage.getItem(process.env.VUE_APP_PARAM + '_COUNTRY')))
  //   } 
  // },
  methods: {
    addMchInfos(){
      if(!+this.dataInfo.payMinLimit || +this.dataInfo.payMinLimit > 10000000000) {
        return this.$message.warning('最低收款金额请填写0-10,000,000,000之间的正整数')
      }else if(+this.dataInfo.payMinLimit > +this.dataInfo.payMaxLimit) {
        return this.$message.warning('每笔最低收款金额不能高于每笔最高收款金额')
      }else if(!+this.dataInfo.payMaxLimit || +this.dataInfo.payMaxLimit > 10000000000) {
        return this.$message.warning('最高收款金额请请填写0-10,000,000,000之间的正整数')
      }else if(+this.dataInfo.payMaxLimit < +this.dataInfo.payMinLimit) {
        console.log(this.dataInfo)
        return this.$message.warning('每笔最高收款金额不能小于每笔最低收款金额')
      }else if(!+this.dataInfo.loanMinLimit || +this.dataInfo.loanMinLimit > 10000000000) {
        return this.$message.warning('最低出款金额请填写0-10,000,000,000之间的正整数')
      }else if(+this.dataInfo.loanMinLimit > +this.dataInfo.loanMaxLimit) {
        return this.$message.warning('每笔最低出款金额不能高于每笔最高出款金额')
      }else if(!+this.dataInfo.loanMaxLimit || +this.dataInfo.loanMaxLimit > 10000000000) {
        return this.$message.warning('最高出款金额请填写0-10,000,000,000之间的正整数')
      }else if(+this.dataInfo.loanMaxLimit < +this.dataInfo.loanMinLimit) {
        return this.$message.warning('每笔最高出款金额不能小于每笔最低出款金额')
      }else if(!+this.dataInfo.data.daily.pay.totalCount || +this.dataInfo.data.daily.pay.totalCount > 1000000) {
        return this.$message.warning('每日报警累计收款笔数请填写0-1,000,000之间的正整数')
      }else if(!+this.dataInfo.data.daily.pay.totalMoney || +this.dataInfo.data.daily.pay.totalMoney > 1000000000000) {
        return this.$message.warning('每日报警累计收款金额请填写0-1,000,000,000,000之间的正整数')
      }else if(!+this.dataInfo.data.daily.loan.totalCount || +this.dataInfo.data.daily.loan.totalCount > 1000000) {
        return this.$message.warning('每日报警累计出款笔数请填写0-1,000,000之间的正整数')
      }else if(!+this.dataInfo.data.daily.loan.totalMoney || +this.dataInfo.data.daily.loan.totalMoney > 1000000000000) {
        return this.$message.warning('每日报警累计出款金额请填写0-1,000,000,000,000之间的正整数')
      }else if(!+this.dataInfo.data.weekly.pay.totalCount || +this.dataInfo.data.weekly.pay.totalCount > 1000000) {
        return this.$message.warning('每周报警累计收款笔数请填写0-1,000,000之间的正整数')
      }else if(!+this.dataInfo.data.weekly.pay.totalMoney || +this.dataInfo.data.weekly.pay.totalMoney > 1000000000000) {
        return this.$message.warning('每周报警累计收款金额请填写0-1,000,000,000,000之间的正整数')
      }else if(!+this.dataInfo.data.weekly.loan.totalCount || +this.dataInfo.data.weekly.loan.totalCount > 1000000) {
        return this.$message.warning('每周报警累计出款笔数请填写0-1,000,000之间的正整数')
      }else if(!+this.dataInfo.data.weekly.loan.totalMoney || +this.dataInfo.data.weekly.loan.totalMoney > 1000000000000) {
        return this.$message.warning('每周报警累计出款金额请填写0-1,000,000,000,000之间的正整数')
      }else if(!+this.dataInfo.data.monthly.pay.totalCount || +this.dataInfo.data.monthly.pay.totalCount > 1000000) {
        return this.$message.warning('每月报警累计收款笔数请填写0-1,000,000之间的正整数')
      }else if(!+this.dataInfo.data.monthly.pay.totalMoney || +this.dataInfo.data.monthly.pay.totalMoney > 1000000000000) {
        return this.$message.warning('每月报警累计收款金额请填写0-1,000,000,000,000之间的正整数')
      }else if(!+this.dataInfo.data.monthly.loan.totalCount || +this.dataInfo.data.monthly.loan.totalCount > 1000000) {
        return this.$message.warning('每月报警累计出款笔数请填写0-1,000,000之间的正整数')
      }else if(!+this.dataInfo.data.monthly.loan.totalMoney || +this.dataInfo.data.monthly.loan.totalMoney > 1000000000000) {
        return this.$message.warning('每月报警累计出款金额请填写0-1,000,000,000,000之间的正整数')
      }else if(!+this.dataInfo.data.minimumBalance || +this.dataInfo.data.minimumBalance > 10000000000) {
        return this.$message.warning('余额报警最低余额请填写0-10,000,000,000之间的正整数')
      }else if(!+this.dataInfo.data.maximumBalance || +this.dataInfo.data.maximumBalance > 1000000000000) {
        return this.$message.warning('余额报警最高余额请填写0-10,000,000,000之间的正整数')
      }else if(+this.dataInfo.data.maximumBalance < +this.dataInfo.data.minimumBalance ) {
        return this.$message.warning('最高余额报警值不能小于最低余额报警值')
      }else if(+this.dataInfo.data.minimumBalance > +this.dataInfo.data.maximumBalance) {
        return this.$message.warning('最低余额报警值不能大于最高余额报警值')
      }
      console.log(this.dataInfo,'====this.dataInfo=====')
      this.$confirm('是否要保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          if(this.cardID){
            this.$emit('submitRules', this.dataInfo)
          }else{
            this.$emit('nextClick', this.dataInfo)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
    },
    async getCardRule(){
      const res = await get_cardRule(this.cardID)
      this.dataInfo = res.data
      this.dataInfo.data = JSON.parse(this.dataInfo.data)
      console.log(res,'========111111111111======')
    },
    // 取消操作
    reback(){
      this.$confirm('是否取消所有保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$router.go(-1)
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      },
    },

}
</script>

<style scoped lang='scss'>
::v-deep .el-checkbox {
  padding-left: 20px;
}
.main {
  height: 64vh;
  overflow: auto;
}
.head {
  margin-top: 20px;
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
  width:  650px;
}
.station > p {
  text-align: right;
  width: 300px !important;
  font-size: 12px;
  margin: 0;
}
.management_input {
  width: 300px !important;
}
.moves {
  margin-bottom: 30px;
}
.stations {
  display: flex;
  align-items: center;
  margin: 25px 0 0 0;
}
.stations > p {
  text-align: right;
  width: 160px !important;
  font-size: 12px;
  margin: 0;
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
/* 滚动条整体部分 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #f5f6fa;
}
/* 滚动条的轨道 */
::-webkit-scrollbar-track {
  width: 8px;
  height: 8px;
}
/* 滚动条的滑块按钮 */
::-webkit-scrollbar-thumb {
  width: 6px;
  height: 6px;
  border-radius: 4px;
  background-color: #b6bece;
}
/* 表格头部的白块设置成与表头一样的颜色 */
.el-table__fixed-right-patch {
  background-color: #E9EBF0 !important;
}
/* 当没有滚动条时 */
.el-table__fixed-right {
  right: -1px !important;
}
/* 当有滚动条的时候 默认偏移距离 */
.el-table--scrollbar-y .el-table__fixed-right {
  right: 6px !important;
}

</style>

<style>
.passwordInput .el-input__suffix {
  top: 12px !important;
}
.Collection {
  color: #70b603;
}
.Disbursement {
  color: #f59a23;
}
</style>
