<template>
  <!-- 卡商卡列表 -->
  <div class="dashbody">
    <div class="move moveList">
      <div class="merchant">
        <el-select
          v-model="list.bankName"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in bankEnumOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-select
          v-model="list.subjectType"
          :placeholder="'主体类型'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in bankCardSubjectOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-select
          v-model="list.bizType"
          :placeholder="'用途'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in bankCardBizOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-select
          v-model="list.bindChannel"
           :placeholder="'使用状态'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in bankCardStateOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-select
          v-model="list.matchingRule"
           :placeholder="'匹配规则'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in matchingRuleOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.bankCard"
          placeholder="卡/账户号"
          class="merchant_input"
          @blur="list.bankCard = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.cardholderName"
          placeholder="卡/账户名称"
          class="merchant_input"
          @blur="list.cardholderName = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.dealerName"
          placeholder="所属卡商"
          class="merchant_input"
          @blur="list.dealerName = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-date-picker
          v-model="createTime"
          class="merchant_input"
          type="daterange"
          :range-separator="'至'"
          :start-placeholder="'新增开始时间'"
          :end-placeholder="'新增结束时间'"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="dateChange"
          :picker-options="pickerOptions"
        />
      </div>
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
        <el-button
          type="primary"
          style="margin-left:20px"
          @click="$router.push('/cardMerchant/addCardMerchantCard')"
        >新增</el-button>
      </div>
      <el-table
        :data="tableData"
        max-height="450"
        class="merchant_table"
        border
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
        @cell-click="copyText"
        :row-key="getRowKeys"
        current-row-key
        :expand-row-keys="expands"
        @expand-change="expandSelect"
      >
      <el-table-column type="expand" align="center" width="40" fixed="left">
            <template slot-scope="props">
              <el-timeline class="timeCard" style="width: 900px;">
                <el-timeline-item
                  v-for="(index, i) in props.row.orderTimeLines"
                  :key="i"
                  type="success"
                >
                  <span> {{ index.updateTime }}</span>&nbsp;
                  <!-- <span>状态： {{ index.operationContent }}</span>&nbsp; -->
                  <span>操作人：【{{ index.operationBy }}】</span>&nbsp;
                  <span>操作：【{{ index.operationType }}】</span>
                </el-timeline-item>
              </el-timeline>
            </template>
        </el-table-column>
        <!--序号 -->
        <el-table-column
          :label="'序号'"
          width="60"
          align="left"
          type="index"
        />
        <!-- 账户号 -->
        <el-table-column
          prop="bankCard"
          :label="'卡/账户号'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 账户名称 -->
        <el-table-column
          prop="cardholderName"
          :label="'卡/账户名称'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 所属卡商 -->
        <el-table-column
          prop="dealerName"
          :label="'所属卡商'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 电子钱包 -->
        <el-table-column
          prop="bankName"
          :label="'银行/电子钱包'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 主体类型 -->
        <el-table-column
          prop="subjectType"
          :label="'主体类型'"
          min-width="80"
          align="left"
        >
      <template slot-scope="scope">
        <span v-if="scope.row.subjectType == 'PUBLIC'">公户</span>
        <span v-if="scope.row.subjectType == 'PRIVATE'">私户</span>
      </template>
      </el-table-column>
      <!-- 用途 -->
      <el-table-column
        prop="bizType"
        :label="'用途'"
        min-width="160"
        align="left"
        >
        <template slot-scope="scope">
        <span v-if="scope.row.bizType == 'POND'">资金归集卡</span>
        <span v-if="scope.row.bizType == 'DISBURSEMENT'">代付卡</span>
        <span v-if="scope.row.bizType == 'PAYMENT'">代收卡</span>
        <span v-if="scope.row.bizType == 'TRANSFER'">中转卡</span>
        <span v-if="scope.row.bizType == 'UNKNOWN'">未知卡</span>
        <span v-if="scope.row.bizType == 'PAYMENT_DISBURSEMENT'">收付卡</span>
      </template>
      </el-table-column>
      <!-- 匹配规则 -->
      <el-table-column
        prop="matchingRule"
        :label="'匹配规则'"
        min-width="160"
        align="left"
        >
        <template slot-scope="scope">
        <span v-if="scope.row.matchingRule == 'CUSTOMER_BANK_CARD'">客户银行卡号</span>
        <span v-if="scope.row.matchingRule == 'CUSTOMER_NAME'">客户名称匹配</span>
        <span v-if="scope.row.matchingRule == 'RANDOM_AMOUNT'">随机金额</span>
      </template>
      </el-table-column>
        <!-- 最近更新余额（Rp） -->
        <!-- <el-table-column
          prop="balance"
          :label="'最近更新余额（Rp）'"
          min-width="160"
          align="left"
        >
        <template slot-scope="scope">
          <span>{{ scope.row.balance | formatNumber }}</span>
        </template>
      </el-table-column> -->
        <!-- 审核状态 -->
        <!-- <el-table-column
          prop="syncStatus"
          :label="'审核状态'"
          min-width="160"
          align="left"
        /> -->
        <!-- 使用状态 -->
        <el-table-column
          prop="bindChannel"
          :label="'使用状态'"
          min-width="160"
          align="left"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.bindChannel">已关联通道</span>
          <span v-if="!scope.row.bindChannel" style="color: red;">未关联通道</span>
        </template>
      </el-table-column>
         <!-- 新增时间 -->
         <el-table-column
          prop="createTime"
          :label="'新增时间'"
          min-width="160"
          align="left"
        />
         <!-- 最近操作时间 -->
         <el-table-column
          prop="updateTime"
          :label="'最近操作时间'"
          min-width="160"
          align="left"
        />
        <!-- 备注 -->
        <el-table-column
          prop="remark"
          :label="'备注'"
          min-width="160"
          align="left"
        />
        <!-- 流水同步状态 -->
        <el-table-column
          :label="'流水同步状态'"
          min-width="160"
          align="left"
        >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.syncStatus" @change="changeSyncStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
        <!-- 操作 -->
        <el-table-column
          :label="'操作'"
          min-width="100"
          fixed="right"
          align="left"
        >
          <template slot-scope="scope">
            <el-button
               
              name="111"
              size="mini"
              type="primary"
              @click="detail(scope.row)"
            >
              编辑
            </el-button>
            <!-- <el-button
               name="111"
               size="mini"
               type="danger"
               @click="disabledItem(scope.row)"
               v-if="scope.row.state == 1"
             >
               禁用
             </el-button>
             <el-button
               name="111"
               size="mini"
               type="success"
               v-if="scope.row.state == 0"
               @click="opemItem(scope.row)"
             >
               启用
             </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :current-page="current"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { cardInfo_table,bankCardState, bankCardSubject, bankEnum,bankCardBiz,update_card,get_cardRule,get_userOperationLogList,get_adminOperation ,get_matchingRule,updateCardDataSync} from '@/api/card'
import { arrayOfObject,getPropertyIfExists} from '@/filters'
import moment from 'moment-timezone';
export default {
  name: 'cardMerchantCard111',
  data() {
    return {
      current: 1,
      size: 80,
      total: 0,
      tableData: [],
      TimeZone:localStorage.getItem('TimeZone'),
      list: {
        bankCard:'',//银行卡号
        bankName:'',//银行名称
        bizType:'',//业务类型
        cardholderName:'',//持卡人姓名
        dealerName:'',//卡商
        endCreateTime:'',//创建结束时间
        startCreateTime:'',//创建开始时间
        bindChannel:undefined,//状态
        subjectType:'',//主体类型
      },
      createTime:[],
      expands:[],//节点操作日志数据
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
      orderTimeLines:[],
      matchingRuleOption:[],
      orderOpera:[],
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
      lastClickedRow: null // 二级展开只调用一次接口
    }
  },
  mounted() {
    this.getTableData()
  },
  created () {
    this.bankCardBiz()
    this.bankCardSubject()
    this.bankEnum()
    // this.bankCardState()
    this.orderOperation()
    this.getMatchingRule()
  },
  methods: {
    //  日期
    dateChange(val) {
      console.log(this.TimeZone,'====this.TimeZone===')
      this.list.startCreateTime = val ?  moment.tz(val[0], this.TimeZone).valueOf() : ''
      this.list.endCreateTime = val ?  moment.tz(val[1], this.TimeZone).valueOf() : ''
    },
    // 分页
    handleSizeChange(size) {
      this.size = size
      this.search()
    },
    handleCurrentChange(current) {
      this.current = current
      this.search(false)
    },
    //  读取全部列表
    getTableData() { 
      this.expands = []
      this.lastClickedRow = null
      cardInfo_table({
        size: this.size,
        current: 1
      }).then((res) => {
        this.tableData = res.data.records
        this.tableData.forEach(item => {
          this.$set(item, 'orderTimeLines', []);
        })
        this.total = +res.data.total
      })
    },
    // 查询
    search(y) {
      this.expands = []
      this.lastClickedRow = null
      if (y !== false) {
        this.current = 1
      }
      cardInfo_table({
        size: this.size,
        current: this.current,
        bankCard: this.list.bankCard !== '' ? this.list.bankCard : undefined,
        bankName: this.list.bankName !== '' ? this.list.bankName : undefined,
        bizType: this.list.bizType !== '' ? this.list.bizType : undefined,
        cardholderName: this.list.cardholderName !== '' ? this.list.cardholderName : undefined,
        matchingRule: this.list.matchingRule !== '' ? this.list.matchingRule : undefined,
        dealerName: this.list.dealerName !== '' ? this.list.dealerName : undefined,
        bindChannel: this.list.bindChannel !== undefined ? this.list.bindChannel : undefined,
        subjectType: this.list.subjectType !== '' ? this.list.subjectType : undefined,
        startCreateTime: this.list.startCreateTime ? this.list.startCreateTime : undefined,
        endCreateTime: this.list.endCreateTime !== '' ? this.list.endCreateTime : undefined,
      }).then((res) => {
        this.tableData = res.data.records
        this.tableData.forEach(item => {
          this.$set(item, 'orderTimeLines', []);
        })
        this.total = +res.data.total
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
    reset() {
      this.current = 1
      this.list.bankCard = ''
      this.list.bankName = ''
      this.list.bizType = ''
      this.list.cardholderName = ''
      this.list.dealerName = ''
      this.list.bindChannel = undefined
      this.list.subjectType = ''
      this.list.startCreateTime = ''
      this.list.endCreateTime = ''
      this.list.matchingRule = ''
      this.createTime = []
      this.getTableData()
    },
    // 详情
    detail(row) {
      if(row.id) {
        this.$router.push({
          path: '/cardMerchant/addCardMerchantCardEdit',
          query: {
            typeId: row.id//卡id
          }
        })
      }else {
        this.$router.push({
          path: '/cardMerchant/addCardMerchantCard',
        })
      }
    },
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
     //禁用
     disabledItem(item){
      this.$confirm('是否要禁用卡?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await update_card({
          id:item.id,
          state: '0',
          bizType:item.bizType,
          subjectType:item.subjectType,
          dealerId:item.dealerId,
          matchingRule:item.matchingRule
        })
        if(res.code == '021-000-S-999') {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.search(true)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    //启用
    opemItem(item){
      this.$confirm('是否要启用卡?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await update_card({
          id:item.id,
          state: '1',
          bizType:item.bizType,
          subjectType:item.subjectType,
          dealerId:item.dealerId,
          matchingRule:item.matchingRule
        })
        if(res.code == '021-000-S-999') {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.search(true)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
     // 折叠行每次只展开一行
     getRowKeys(row) {
       return row.id
    },
    expandSelect(row, expandedRows) {
      var that = this
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.id)
        }
      } else {
        that.expands = []
      }
      // 控制二级展开只调用一次接口
      if (this.lastClickedRow === row.id) {
        return
      } else {
        this.lastClickedRow = row.id
        this.timeLines(row,expandedRows)
      }
    },
    // 时间轴
    timeLines(row) {
      row.orderTimeLines = []
      get_userOperationLogList(row.id).then((res) => {
        row.orderTimeLines = res.data
        row.orderTimeLines.forEach(item => {
          item.operationContent = JSON.parse(item.operationContent)
          item.operationType =  getPropertyIfExists(this.orderOpera,item.operationType)
          console.log(item.operationType,']]]]]]]]]')
        })
      })
    },
    // 订单操作类型枚举
   async orderOperation(){
      const res = await get_adminOperation()
      console.log(res,'==订单操作类型枚举====')
      if(res.code === "021-000-S-999") {
        this.orderOpera = res.data
        // getPropertyIfExists(orderOpera,index.operationType)
      }
    },
    // 更新银行卡 流水同步状态
  async changeSyncStatus(item){
    console.log(item.syncStatus)
      const res = await updateCardDataSync({
        id:item.id, 
        syncStatus:item.syncStatus
      })
      if(res.code === '021-000-S-999') {
        this.$message.success('操作成功')
      }else {
        this.$message.error('操作失败')
      }
      // this.search(true)
    },
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
