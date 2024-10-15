<template>
  <!-- 基础信息 -->
  <div>
    <div class="main">
      <!-- 基础信息 -->
      <p class="title">基础信息</p>
      <div class="move">
        <!-- 卡ID： -->
        <div class="station">
          <p>卡ID：</p>
          <div class="management_input">{{ dataInfo.id }}</div>
        </div>
        <!-- 所属： -->
        <div class="station">
          <p><i style="color:red">*</i>所属卡商：</p>
         <el-select
            ref="parName"
            v-model="dataInfo.dealerId"
            filterable
            clearable
            :disabled="!!cardID"
            placeholder="请选择所属卡商"
            class="management_input"
          >
            <el-option
              v-for="item in cardAllOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- 卡用途： -->
        <div class="station">
          <p><i style="color:red">*</i>卡用途：</p>
          <el-select
            ref="parName"
            v-model="dataInfo.bizType"
            filterable
            clearable
            placeholder="请选择卡用途"
            class="management_input"
          >
            <el-option
              v-for="item in bankCardBizOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- 电子钱包： -->
        <div class="station">
          <p><i style="color:red">*</i>银行/电子钱包：</p>
          <el-select
            ref="parName"
            v-model="dataInfo.bankName"
            filterable
            clearable
            :disabled="!!cardID"
            placeholder="请选择电子钱包"
            class="management_input"
          >
            <el-option
              v-for="item in bankEnumOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- 主体类型：  -->
        <div class="station">
          <p><i style="color:red">*</i>主体类型：</p>
          <el-select
            ref="parName"
            v-model="dataInfo.subjectType"
            filterable
            clearable
            :disabled="!!cardID"
            placeholder="请选择主体类型"
            class="management_input"
          >
            <el-option
              v-for="item in bankCardSubjectOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- 匹配规则： -->
        <div class="station">
          <p><i style="color:red">*</i>匹配规则：</p>
          <el-select
            ref="parName"
            v-model="dataInfo.matchingRule"
            filterable
            clearable
            placeholder="请选择匹配规则"
            class="management_input"
          >
            <el-option
              v-for="item in matchingRuleOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- 状态： -->
        <div class="station">
          <p><i style="color:red">*</i>状态：</p>
          <el-select
            ref="parName"
            v-model="dataInfo.bindChannel"
            filterable
            disabled
            clearable
            placeholder="请选择状态"
            class="management_input"
          >
            <el-option
              v-for="item in bankCardStateOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <!-- 账号信息 -->
      <p class="title">账号信息</p>
      <div class="move">
        <!-- 账户号： -->
        <div class="station">
          <p><i style="color:red">*</i>账户号：</p>
          <el-input
            v-model.trim="dataInfo.bankCard"
            autocomplete="off"
            :maxlength="50"
            placeholder="请输入账户号"
            class="management_input"
            :disabled="!!cardID"
            @input="dataInfo.bankCard=dataInfo.bankCard.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
        </div>
        <!-- 账户名： -->
        <div class="station">
          <p><i style="color:red">*</i>账户名：</p>
          <el-input
          style="width: 600px !important;"
            v-model="dataInfo.cardholderName"
            autocomplete="off"
            :maxlength="40"
            placeholder="请输入账户名"
            class="management_input"
          />
        </div>
        <!-- 卡权重： -->
        <div class="station">
          <p>卡权重：</p>
          <el-input
            v-model.trim="dataInfo.weights"
            autocomplete="off"
            placeholder="请输入卡权重，1-99"
            class="management_input"
            @input="validateWeight"
          />
        </div>
        <!-- 登录用户名 -->
        <!-- <div class="station" v-if="dataInfo.subjectType !== 'PUBLIC'">
          <p><i style="color:red">*</i>登录用户名</p>
          <div class="management_input" style="padding-left: 20px;">
            {{ username }}
          </div>
        </div> -->
        <!-- 登录密码 -->
        <!-- <div class="station" v-if="dataInfo.subjectType !== 'PUBLIC'">
          <p><i style="color:red">*</i>登录密码：</p>
          <el-input
            v-model.trim="dataInfo.expands.password"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入账户名"
            class="management_input"
            @input="dataInfo.expands.password=dataInfo.expands.password.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
        </div> -->
        <!-- 账户名： -->
        <!-- <div class="station" v-if="dataInfo.subjectType !== 'PUBLIC'">
          <p><i style="color:red">*</i>PIN码：</p>
          <el-input
            v-model.trim="dataInfo.expands.PIN"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入账户名"
            class="management_input"
            @input="dataInfo.expands.PIN=dataInfo.expands.PIN.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
        </div> -->
        <!-- 关联Email -->
        <div class="station">
          <p>关联Email：</p>
          <el-input
            v-model.trim="dataInfo.cardholderEmail"
            autocomplete="off"
            :maxlength="100"
            placeholder="请输入关联Email"
            class="management_input"
            @input="dataInfo.cardholderEmail=dataInfo.cardholderEmail"
          />
        </div>
        <!-- Email密码 -->
        <!-- <div class="station">
          <p>Email密码：</p>
          <el-input
            v-model.trim="dataInfo.expands.emailPassword"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入Email密码"
            class="management_input"
            @input="dataInfo.expands.emailPassword=dataInfo.expands.emailPassword.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
        </div> -->
        <!-- 关联手机号：  -->
        <div class="station">
          <p>关联手机号：</p>
          <el-input
            v-model.trim="dataInfo.cardholderMobile"
            autocomplete="off"
            :maxlength="20"
            placeholder="请输入关联手机号"
            class="management_input"
            @input="dataInfo.cardholderMobile=dataInfo.cardholderMobile.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')"
          />
        </div>
      </div>
      <p class="title">余额信息</p>
      <div class="move">
        <!-- 账户号： -->
        <div class="station">
          <p>当前余额：</p>
          <div class="management_input" style="color: red;">{{ (dataInfo.balance || '') | formatNumber }}</div>
        </div>
        <div class="station">
          <p>最近更新时间：</p>
          <!-- <div class="management_input" style="color: red;">{{ (dataInfo.balance || '') | formatNumber }}</div> -->
          <div class="management_input" style="font-size: 12px;">{{ dataInfo.updateTime }}</div>
        </div>
       </div>
       <p class="title">标记选择</p>
        <div class="move">
          <!-- 账户号： -->
          <div style="padding: 10px;">
            <el-checkbox-group v-model="dataInfo.expands.checkList">
              <el-checkbox label="一类直客"></el-checkbox>
              <el-checkbox label="一类四方"></el-checkbox>
              <el-checkbox label="二类直客"></el-checkbox>
              <el-checkbox label="二类四方"></el-checkbox>
              <el-checkbox label="三类直客"></el-checkbox>
              <el-checkbox label="三类四方"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
       <p class="title">备注</p>
        <div style="padding: 10px;">
          <el-input
            v-model.trim="dataInfo.remark"
            type="textarea"
            :maxlength="200"
            :rows="3"
            onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
            @blur="dataInfo.remark = $event.target.value"
          />
        </div>
    </div>
    <!-- 按钮 -->
    <div class="head">
      <el-button style="margin-right: 30px;" @click="reback">取消</el-button>
      <el-button  type="primary" @click="nextClick()" v-if="!cardID">下一步</el-button>
      <el-button  type="primary" @click="submitInfo()" v-else>完成</el-button>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { bankCardState, bankCardSubject, bankEnum,bankCardBiz,get_matchingRule,dealerInfo_table} from '@/api/card'
import { arrayOfObject } from '@/filters'
import {get_cardInfo} from '@/api/card'
export default {
  name: 'BasicInformationCaed',
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
      active:1,
      username:'',
      dataInfo:{
        id:null,//卡ID：
        bizType:'',//卡用途：
        bankName:null,//电子钱包：
        subjectType:'PUBLIC',//主体类型：
        dealerId:null,//todo 接口联调写死，后续要手动选择
        bindChannel:false,//状态：
        bankCard:null,//账户号
        cardholderName:null,//账户名
        cardholderMobile:null,//关联手机号
        cardholderEmail:null,//关联Email：
        matchingRule:null,
        weights:1,//卡权重
        remark:null,
        expands:{
          password:null,//登录密码
          PIN:null,// PIN 
          emailPassword:null,//Email密码
          checkList:[],
        }
      },
        bankCardBizOption:[],
        bankCardStateOption:[{
          value:true,
          label:'已关联通道'
        },{
          value:false,
          label:'未关联通道'
        }],
        bankCardSubjectOption:[],
        bankEnumOption:[],
        matchingRuleOption:[],
        cardAllOption:[],//卡商选择列表

    }
  },
  computed: {

  },
  mounted() {
    console.log(this.cardID,'=====cardId=====')
    if(this.cardID) {
      this.getCardInfo()
    }
    this.username = localStorage.getItem(process.env.VUE_APP_PARAM + '_USERNAME')
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
  created () {
    this.bankCardBiz()
    this.bankCardSubject()
    this.bankEnum()
    // this.bankCardState()
    this.getMatchingRule()
    this.getCardData()
  },
  methods: {
   async bankCardState(){
      const res = await bankCardState()
      this.bankCardStateOption = arrayOfObject(res.data)
    },
    async bankCardSubject(){
      const res = await bankCardSubject()
      this.bankCardSubjectOption = arrayOfObject(res.data)
    },
    async bankEnum(){
      const res = await bankEnum()
      this.bankEnumOption = arrayOfObject(res.data)
    },
    async bankCardBiz(){
      const res = await bankCardBiz()
      this.bankCardBizOption = arrayOfObject(res.data)
    },
    async getMatchingRule(){
      const res = await get_matchingRule()
      this.matchingRuleOption = arrayOfObject(res.data)
    },
    async getCardInfo(){
      const res = await get_cardInfo(this.cardID)
      this.dataInfo = res.data
      this.dataInfo.state = '' + this.dataInfo.state
      if(this.dataInfo.expands){
        this.dataInfo.expands = JSON.parse(this.dataInfo.expands)
      }else{
        this.dataInfo.expands = {
          password:null,//登录密码
          PIN:null,// PIN 
          emailPassword:null,//Email密码
          checkList:[],
        }
      } 

    },
    // 下一步
    nextClick() {
    const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
      if(this.dataInfo.cardholderEmail && !regEmail.test(this.dataInfo.cardholderEmail)) {
        return this.$message.warning('请输入正确的邮箱格式')
      }
      if (!this.dataInfo.bizType) {
        this.$message.warning('请选择卡用途')
        return
      } else if (!this.dataInfo.bankName) {
        this.$message.warning('请选择银行/电子钱包')
        return
      } else if (!this.dataInfo.subjectType) {
        this.$message.warning('请选择主体类型')
        return
      } else if (!this.dataInfo.matchingRule) {
        this.$message.warning('请选择匹配规则')
        return
      }else if (!this.dataInfo.bankCard || this.dataInfo.bankCard.length > 50) {
        this.$message.warning('请填写正确的账户号，1-50位任意字符')
        return
      } else if (!this.dataInfo.cardholderName || this.dataInfo.cardholderName.length > 100) {
        this.$message.warning('请填写正确的账户名，1-100位任意字符')
        return
      } else {
        this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$emit('nextClick', this.dataInfo,this.active)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
      }
    },
    submitInfo(){
      const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
      if(this.dataInfo.cardholderEmail && !regEmail.test(this.dataInfo.cardholderEmail)) {
        return this.$message.warning('请输入正确的邮箱格式')
      }
      if (!this.dataInfo.bizType) {
        this.$message.warning('请选择卡用途')
        return
      } else if (!this.dataInfo.bankName) {
        this.$message.warning('请选择银行/电子钱包')
        return
      } else if (!this.dataInfo.subjectType) {
        this.$message.warning('请选择主体类型')
        return
      } else if (!this.dataInfo.matchingRule) {
        this.$message.warning('请选择匹配规则')
        return
      }else if (!this.dataInfo.bankCard || this.dataInfo.bankCard.length > 50) {
        this.$message.warning('请填写正确的账户号，1-50位任意字符')
        return
      } else if (!this.dataInfo.cardholderName || this.dataInfo.cardholderName.length > 100) {
        this.$message.warning('请填写正确的账户名，1-100位任意字符')
        return
      } else {
        this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$emit('submitInfo', this.dataInfo,this.active)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
      }
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
    //获取卡商列表
    getCardData() {
      dealerInfo_table({
        size: 9999,
        current: 1
      }).then((res) => {
        this.cardAllOption = []
        res.data.records.forEach(item => {
          this.cardAllOption.push({
            label:item.dealerName,
            value:item.id
          })
        });
      })
    },

    validateWeight() {
      // 使用正则表达式验证输入是否为1-99的正整数
      const regex = /^(0?[1-9]|[1-9][0-9])$/;
      if (!regex.test(this.dataInfo.weights)) {
        // 如果输入不符合要求，可以在此进行处理，比如清空输入
        this.dataInfo.weights = '';
      }
    }
  }
}
</script>

<style scoped lang='scss'>
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
  width:  350px;
}
.station > p {
  text-align: right;
  width: 200px !important;
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
</style>
