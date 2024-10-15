<template>
  <!-- BCA流水列表 -->
  <div class="dashbody">
    <div class="fiatdashbord">
        <!-- 流水金额 -->
        <div class="moneyText" style="border-right:1px solid #AAAAAA;">
          <p style="margin: 0; color:#AAAAAA;font-size: 12px;">流水金额 ({{ currency }})</p>
          <p class="money">{{summaryInfo.flowMoney | formatNumber}}</p>
        </div>
        <!-- 流水笔数 -->
        <div class="moneyText" style="margin-left: 0;">
          <p style="margin: 0; color:#AAAAAA;font-size: 12px;">流水笔数</p>
          <p class="money">{{ summaryInfo.flowCount  | formatNumber}}</p>
        </div>
      </div>
    <div class="move moveList">
      <!-- 流水ID -->
      <div class="merchant">
        <el-input
          v-model.trim="list.flowId"
          placeholder="流水ID"
          class="merchant_input"
          @blur="list.flowId = $event.target.value"
        />
      </div>
      <!-- 平台订单号 -->
      <div class="merchant">
        <el-input
          v-model.trim="list.platOrderNum"
          placeholder="平台订单号"
          class="merchant_input"
          @blur="list.platOrderNum = $event.target.value"
        />
      </div>
      <!-- 银行卡号 -->
      <div class="merchant">
        <el-input
          v-model.trim="list.bankCard"
          placeholder="银行卡号"
          class="merchant_input"
          @blur="list.bankCard = $event.target.value"
        />
      </div>
      <!-- 类型 -->
      <div class="merchant">
        <el-select
          v-model="list.isPay"
           :placeholder="'类型'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in typeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- 金额 -->
      <div class="merchant">
        <el-input
          v-model.trim="list.inMoney"
          placeholder="金额"
          class="merchant_input"
          @blur="list.inMoney = $event.target.value"
        />
      </div>
      <!-- 转出账户名 -->
      <div class="merchant">
        <el-input
          v-model.trim="list.fromAccName"
          placeholder="转出账户名"
          class="merchant_input"
          @blur="list.fromAccName = $event.target.value"
        />
      </div>
      <!-- 转出账户 -->
      <div class="merchant">
        <el-input
          v-model.trim="list.fromAccNo"
          placeholder="转出账户"
          class="merchant_input"
          @blur="list.fromAccNo = $event.target.value"
        />
      </div>
      <!-- 入账金额 -->
      <!-- <div class="merchant">
        <el-input
          v-model.trim="list.inMoney"
          placeholder="入账金额"
          class="merchant_input"
          @blur="list.inMoney = $event.target.value"
        />
      </div> -->
      <!-- 账户余额 -->
      <!-- <div class="merchant">
        <el-input
          v-model.trim="list.cardBalance"
          placeholder="账户余额"
          class="merchant_input"
          @blur="list.cardBalance = $event.target.value"
        />
      </div> -->
      <!-- 匹配状态 -->
      <div class="merchant">
        <el-select
          v-model="list.state"
           :placeholder="'匹配状态'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in StateOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- 流水开始时间 -->
      <div class="merchant">
        <el-date-picker
          v-model="createTime"
          class="merchant_input"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :range-separator="'至'"
          :start-placeholder="'流水开始时间'"
          :end-placeholder="'流水结束时间'"
          :picker-options="pickerOptionsCreate"
          @change="dateChange1"
        />
      </div>
      <!-- 获取开始时间 -->
      <!-- <div class="merchant">
        <el-date-picker
          v-model="getTime"
          class="merchant_input"
          type="datetimerange"
          :range-separator="'至'"
          :start-placeholder="'获取开始时间'"
          :end-placeholder="'获取结束时间'"
          @change="dateChange2"
        />
      </div> -->
      <!-- 状态更新开始时间 -->
      <!-- <div class="merchant">
        <el-date-picker
          v-model="updateTime"
          class="merchant_input"
          type="datetimerange"
          :range-separator="'至'"
          :start-placeholder="'状态更新开始时间'"
          :end-placeholder="'状态更新结束时间'"
          @change="dateChange3"
        />
      </div> -->
      <div>
        <el-button
          id="109"
           
          type="primary"
          style="margin-left: 5px"
          @click="search(true)"
        >查询</el-button>
        <el-button style="margin-left: 20px" @click="reset()">重置</el-button>
      </div>
    </div>
    <div class="dashTable">
      <div class="operation">
         <!-- 查看导出列表弹窗 -->
         <export-download
          style="display: inline-block;"
          :query-value="esportlist"
          :is-mark="true"
          file-name="BCA流水列表"
          :expand-fun="writeCardFlowExcel"
          :expand-listfun="getCardFlowExcel"
        />
      </div>
      <el-table
        :data="tableData"
        max-height="600"
        class="merchant_table"
        border
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
        @cell-click="copyText"
      >
        <!--序号 -->
        <el-table-column
          :label="'序号'"
          width="60"
          align="left"
          type="index"
        />
        <!--ID -->
        <el-table-column
          :label="'流水ID'"
          width="80"
          align="left"
          prop="flowId"
          show-overflow-tooltip
        />
        <!-- 平台订单号 -->
        <el-table-column
          prop="platOrderNum"
          :label="'平台订单号'"
          min-width="100"
          align="left"
          show-overflow-tooltip
        />
        <!-- 银行流水号 -->
        <el-table-column
          prop="bankCard"
          :label="'银行卡号'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 入账金额 -->
        <el-table-column
          prop="inMoney"
          :label="'金额(Rp)'"
          min-width="90"
          align="right"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
            <span v-if="scope.row.inMoney >= 0">{{ scope.row.inMoney | formatNumber}}</span>
            <span v-if="scope.row.inMoney < 0" style="color: red;">{{ scope.row.inMoney | formatNumber}}</span>
          </template>
      </el-table-column>
        <!-- 商户余额 -->
        <el-table-column
          :label="'账户余额(Rp)'"
          min-width="150"
          align="right"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
            <span>{{ scope.row.expands.balance | formatNumber}}</span>
          </template>
      </el-table-column>
        <!-- 类型 -->
        <!-- <el-table-column
          prop="reference"
          :label="'类型'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span v-if="scope.row.inMoney >= 0">入账</span>
          <span v-if="scope.row.inMoney < 0" style="color: red;">出账</span>
        </template>
      </el-table-column> -->
        <!-- 所属银行 -->
        <!-- <el-table-column
          prop="bankName"
          :label="'所属银行'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        /> -->
        <!-- 账户余额 -->
        <!-- <el-table-column
          prop="cardBalance"
          :label="'账户余额'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        /> -->
        <!-- 币种 -->
        <!-- <el-table-column
          prop="currency"
          :label="'币种'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        /> -->
 
        
        <!-- 对方账户名 -->
        <el-table-column
          prop="fromAccName"
          :label="'对方账户名'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 对方银行 -->
        <!-- <el-table-column
          :label="'对方银行'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span >{{ scope.row.expands.fromBankName }}</span>
        </template>
      </el-table-column> -->
        <!-- 使用状态 -->
        <el-table-column
          prop="state"
          :label="'匹配状态'"
          min-width="160"
          fixed="right"
          align="left"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.state" style="color: #4b7902;">已匹配</span>
          <span v-if="!scope.row.state" style="color: red;">未匹配</span>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column
          prop="expands"
          :label="'备注'"
          min-width="450"
          align="left"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span>{{ scope.row.expands.description }}</span>
        </template>
      </el-table-column>
          <!-- 流水发生时间 -->
          <el-table-column
          prop="flowTime"
          :label="'流水发生时间'"
          min-width="160"
          align="left"
        />
         <!-- 获取时间 -->
         <el-table-column
          prop="createTime"
          :label="'获取时间'"
          min-width="160"
          align="left"
        />
         <!-- 状态最近更新时间 -->
         <el-table-column
          prop="updateTime"
          :label="'状态最近更新时间'"
          min-width="160"
          align="left"
        />
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :current-page="list.current"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="list.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>

import { arrayOfObject } from '@/filters'
import { cardFlow_page,writeCardFlowExcel,getCardFlowExcel,cardFlow_summary} from '@/api/card'
import moment from 'moment-timezone';
export default {
  name: 'BCASerial',
  data() {
    return {
      writeCardFlowExcel,
      getCardFlowExcel,
      currency:'Rp',
      total: 0,
      TimeZone:localStorage.getItem('TimeZone'),
      tableData: [],
      list: {
        bankName:'BCA',//卡所属银行
        size: 80,
        current: 1,
        bankCard:undefined,
        cardBalance:undefined,//账户余额
        currency:undefined,//币种
        flowId:undefined,//流水id
        fromAccName:undefined,//转出账户名
        fromAccNo:undefined,//转出账户
        inMoney:undefined,//入账金额
        state:undefined,//状态
        matchParam:undefined,
        reference:undefined,
        isPay:undefined,//类型
        platOrderNum:undefined,//平台订单号
        endFlowTime:undefined,//银行流水结束时间
        startFlowTime:undefined,//银行流水开始时间
      },
      typeOption:[{
        label:'入账',
        value:true,
      },{
        label:'出账',
        value:false,
      }],
      pickerOptionsCreate: {
        onPick: (obj) => {
          if (obj.minDate) {
            this.createTime[0] = new Date(obj.minDate).getTime()
          }
        },
        disabledDate: (time) => {
          if (!this.createTime) {
            this.createTime = []
          }
          if (this.createTime !== '') {
            const start = new Date(this.createTime[0]).getTime()
            const one = start + 1000 * 3600 * 24 * 31
            const two = start - 1000 * 3600 * 24 * 31
            return (time.getTime() < two || time.getTime() > one)
          } else {
            return
          }
        }
      },
      createTime:[],
      getTime:[],
      updateTime:[],
      pickerOptions: {
        onPick: (obj) => {
          if (obj.minDate) {
            this.createTime[0] = new Date(obj.minDate).getTime()
          }
        },
        disabledDate: (time) => {
          if (!this.createTime) {
            this.createTime = []
          }
          if (this.createTime !== '') {
            const start = new Date(this.createTime[0]).getTime()
            const one = start + 1000 * 3600 * 24 * 31
            const two = start - 1000 * 3600 * 24 * 31
            return (time.getTime() < two || time.getTime() > one)
          } else {
            return
          }
        }
      },
      StateOption:[{
          label:'已匹配',
          value:true,
        },{
          label:'未匹配',
          value:false,
      }],
      summaryInfo:{
        flowMoney:0,
        flowCount:0,
      },//统计数据
    }
  },
  mounted() {
    this.getTableData()
  },
  created () {
  },
  methods: {
    //  日期
    dateChange1(val) {
      this.list.startFlowTime = val ? moment.tz(val[0], this.TimeZone).valueOf() : undefined
      this.list.endFlowTime = val ? moment.tz(val[1], this.TimeZone).valueOf() : undefined
    },
    dateChange2(val) {
      this.list.startFlowTime = val ? moment.tz(val[0], this.TimeZone).valueOf() : undefined
      this.list.endFlowTime = val ? moment.tz(val[1], this.TimeZone).valueOf() : undefined
    },
    dateChange3(val) {
      this.list.startFlowTime = val ? moment.tz(val[0], this.TimeZone).valueOf() : undefined
      this.list.endFlowTime = val ? moment.tz(val[1], this.TimeZone).valueOf() : undefined
    },
    // 分页
    handleSizeChange(size) {
      this.list.size = size
      this.search()
    },
    handleCurrentChange(current) {
      this.list.current = current
      this.search(false)
    },
    //  读取全部列表
    getTableData() {
      const searchInfo = {
        size: this.list.size,
        current: 1,
        bankName:'BCA'
      }
      cardFlow_page(searchInfo).then(async(res) => {
        res.data.records.forEach(item => {
          item.expands = JSON.parse(item.expands)
        })
        this.tableData = res.data.records
        this.total = +res.data.total
        const summaryInfo = await cardFlow_summary(searchInfo)
        this.summaryInfo = summaryInfo.data
      })
    },
    // 查询
    search(y) {
      if (y !== false) {
        this.list.current = 1
      }
      const searchInfo = {
        size: this.list.size,
        current: this.list.current,
        bankName: this.list.bankName ,
        bankCard: this.list.bankCard ? this.list.bankCard : undefined,
        isPay: this.list.isPay !== undefined ? this.list.isPay : undefined,
        cardBalance: this.list.cardBalance ? this.list.cardBalance : undefined,
        currency: this.list.currency ? this.list.currency : undefined,
        flowId: this.list.flowId ? this.list.flowId : undefined,
        platOrderNum: this.list.platOrderNum ? this.list.platOrderNum : undefined,
        fromAccName: this.list.fromAccName ? this.list.fromAccName : undefined,
        fromAccNo: this.list.fromAccNo ? this.list.fromAccNo : undefined,
        state: this.list.state !== undefined ? this.list.state : undefined,
        inMoney: this.list.inMoney ? this.list.inMoney.replace(/,/g, '') : undefined,
        startFlowTime: this.list.startFlowTime ? this.list.startFlowTime  : undefined,
        endFlowTime: this.list.endFlowTime ?  this.list.endFlowTime : undefined,
      }
      cardFlow_page(searchInfo).then(async(res) => {
        res.data.records.forEach(item => {
          item.expands = JSON.parse(item.expands)
        })
        this.tableData = res.data.records
        this.total = +res.data.total
        const summaryInfo = await cardFlow_summary(searchInfo)
        this.summaryInfo = summaryInfo.data
      })
    },
    // 表格-单击单元格复制内容
    copyText(row, column, cell) {
      if (column.property !== undefined) {
        const cel = cell.getElementsByClassName('cell')[0].innerText
        this.copyTable(cel)
      }
    },
    // 重置
  async reset() {
      this.list.current = 1
      this.list.bankCard = undefined
      this.list.bankName = 'BCA'
      this.list.cardBalance = undefined
      this.list.currency = undefined
      this.list.flowId = undefined
      this.list.fromAccName = undefined
      this.list.fromAccNo = undefined
      this.list.inMoney = undefined
      this.list.state = undefined
      this.list.isPay = undefined
      this.list.platOrderNum = undefined
      this.list.endFlowTime = undefined
      this.list.startFlowTime = undefined
      this.createTime = []
      this.getTableData()
    },

  },
  computed: {
    esportlist(){
      return {
        size: this.list.size,
        current: this.list.current,
        bankName: this.list.bankName ,
        bankCard: this.list.bankCard ? this.list.bankCard : undefined,
        isPay: this.list.isPay !== undefined ? this.list.isPay : undefined,
        cardBalance: this.list.cardBalance ? this.list.cardBalance : undefined,
        currency: this.list.currency ? this.list.currency : undefined,
        flowId: this.list.flowId ? this.list.flowId : undefined,
        platOrderNum: this.list.platOrderNum ? this.list.platOrderNum : undefined,
        fromAccName: this.list.fromAccName ? this.list.fromAccName : undefined,
        fromAccNo: this.list.fromAccNo ? this.list.fromAccNo : undefined,
        state: this.list.state !== undefined ? this.list.state : undefined,
        inMoney: this.list.inMoney ? this.list.inMoney.replace(/,/g, '') : undefined,
        startFlowTime: this.list.startFlowTime ? this.list.startFlowTime  : undefined,
        endFlowTime: this.list.endFlowTime ? this.list.endFlowTime  : undefined,
      }
    }
  }
}
</script>

<style>
.el-table td {
  padding: 4px 0;
}
.el-table .cell p {
  margin: 0;
}
</style>
