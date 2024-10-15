<template>
  <!-- 收款订单 -->
  <div class="dashbody">
    <div v-if="!dialogTableVisible" class="templateOne">
      <div class="fiatdashbord">
        <!-- 订单金额 -->
        <div class="moneyText" style="border-right:1px solid #AAAAAA;">
          <p style="margin: 0; color:#AAAAAA;font-size: 12px;">订单金额 ({{ currency }})</p>
          <p class="money">{{ summaryInfo.orderMoney | formatNumber }}</p>
        </div>
        <!-- 交易金额 -->
        <div class="moneyText" style="border-right:1px solid #AAAAAA;margin-left: 0;">
          <p style="margin: 0; color:#AAAAAA;font-size: 12px;">交易金额 ({{ currency }})</p>
          <p class="money">{{ summaryInfo.actuallyMoney | formatNumber }}</p>
        </div>
        <!-- 订单笔数 -->
        <div class="moneyText" style="margin-left: 0;">
          <p style="margin: 0; color:#AAAAAA;font-size: 12px;">订单笔数</p>
          <p class="money">{{ summaryInfo.count | formatNumber }}</p>
        </div>
        <!-- 订单笔数 -->
        <div class="moneyText" style="margin-left: 0;">
          <p style="margin: 0; color:#AAAAAA;font-size: 12px;">订单手续费</p>
          <p class="money">{{ summaryInfo.orderFee | formatNumber }}</p>
        </div>
      </div>
      <div class="move moveList">
        <div class="merchant">
          <el-input
            v-model.trim="list.platOrderNum"
            placeholder="平台订单号"
            class="merchant_input"
            @blur="list.platOrderNum = $event.target.value"
          />
        </div>
        <div class="merchant">
          <el-input
            v-model.trim="list.orderNum"
            placeholder="商户订单号"
            class="merchant_input"
            @blur="list.orderNum = $event.target.value"
          />
        </div>
        <div class="merchant">
          <el-input
            v-model.trim="list.mchNo"
            placeholder="收款商户编号"
            class="merchant_input"
            @blur="list.mchNo = $event.target.value"
          />
        </div>
        <div class="merchant">
          <el-input
            v-model.trim="list.dealerNo"
            placeholder="卡商编号"
            class="merchant_input"
            @blur="list.dealerNo = $event.target.value"
          />
        </div>
        <div class="merchant">
          <el-select
            v-model="list.matchRule"
            :placeholder="'匹配模式'"
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
          <el-select
            v-model="list.bankName"
            :placeholder="'银行名称'"
            clearable
            class="merchant_input"
          >
            <el-option
              v-for="item in bankNameOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="merchant">
          <el-input
            v-model.trim="list.matchingId"
            placeholder="匹配备注"
            class="merchant_input"
            @blur="list.matchingId = $event.target.value"
          />
        </div>
        <div class="merchant">
          <el-select
            v-model="list.channelName"
            :placeholder="'收款通道'"
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
          <el-input
            v-model.trim="list.bankCard"
            placeholder="收款账号"
            class="merchant_input"
            @blur="list.bankCard = $event.target.value"
          />
        </div>
        <div class="merchant">
          <el-select
            v-model="list.status"
            :placeholder="'订单状态'"
            clearable
            class="merchant_input"
          >
            <el-option
              v-for="item in orderStatusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="merchant">
          <el-date-picker
            v-model="createTime"
            class="merchant_input"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :range-separator="'至'"
            :start-placeholder="'创建开始时间'"
            :end-placeholder="'创建结束时间'"
            :picker-options="pickerOptionsCreate"
            @change="dateChangeCreate"
          />
        </div>
        <div class="merchant">
          <el-date-picker
            v-model="updataTime"
            class="merchant_input"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :range-separator="'至'"
            :start-placeholder="'交易成功开始时间'"
            :end-placeholder="'交易成功结束时间'"
            :picker-options="pickerOptionsUp"
            @change="dateChangeUp"
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
            v-if="userIdList.includes('100300010001')"
            type="primary"
            style="margin-left:20px"
            @click="SupOrder(0)"
          >批量补单</el-button>
          <el-button
            v-if="userIdList.includes('100300010002')"
            type="primary"
            style="margin-left:20px"
            @click="SupOrder(1)"
          >批量退单</el-button>
          <!-- <el-button
            type="primary"
            style="margin-left:20px"
          >导出列表</el-button> -->
          <div class="operation">
            <!-- 查看导出列表弹窗 -->
            <export-download
              style="display: inline-block;"
              :query-value="esportlist"
              :is-mark="true"
              file-name="收款订单列表"
              :expand-fun="writeOrderPayExcel"
              :expand-listfun="getOrderPayExcel"
            />
          </div>
        </div>
        <el-table
          :data="tableData"
          max-height="450"
          class="merchant_table"
          border
          :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
          :row-key="getRowKeys"
          current-row-key
          :expand-row-keys="expands"
          @cell-click="copyText"
          @expand-change="expandSelect"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column type="expand" align="center" width="40" fixed="left">
            <!-- <el-card shadow="never" class="twoTable"> -->
            <template slot-scope="props">
              <el-timeline class="timeCard">
                <el-timeline-item
                  v-for="(index, i) in props.row.orderTimeLines"
                  :key="index.id"
                  type="success"
                >
                  <span> {{ index.updateTime }}</span>&nbsp;
                  <!-- <span>状态： {{ index.operationContent }}</span>&nbsp; -->
                  <span>操作人：【{{ index.operationBy }}】</span>&nbsp;
                  <span>操作：【{{ index.operationType }}】</span>
                </el-timeline-item>
              </el-timeline>
            </template>
            <!-- </el-card> -->
          </el-table-column>
          <!--序号 -->
          <el-table-column
            :label="'序号'"
            width="60"
            align="left"
            type="index"
          />
          <!-- 平台订单号 -->
          <el-table-column
            prop="platOrderNum"
            :label="'平台订单号'"
            min-width="150"
            align="left"
            show-overflow-tooltip
          />
          <!-- 商户订单号 -->
          <el-table-column
            prop="orderNum"
            :label="'商户订单号'"
            min-width="150"
            align="left"
            show-overflow-tooltip
          />
          <!-- 商户编号 -->
          <el-table-column
            prop="mchNo"
            :label="'商户编号'"
            min-width="150"
            align="left"
            show-overflow-tooltip
          />
          <!-- 银行名称 -->
          <el-table-column
            prop="bankName"
            :label="'银行名称'"
            min-width="150"
            align="left"
            show-overflow-tooltip
          />
          <!-- 收款通道 -->
          <el-table-column
            prop="channelName"
            :label="'收款通道'"
            min-width="150"
            align="left"
            show-overflow-tooltip
          />
          <!-- 收款账号 -->
          <el-table-column
            prop="bankCard"
            :label="'收款账号'"
            min-width="160"
            align="left"
          />
          <!-- 订单金额 -->
          <el-table-column
            prop="orderMoney"
            :label="'订单金额(Rp)'"
            min-width="160"
            align="right"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.orderMoney | formatNumber }}</span>
            </template>
          </el-table-column>
          <!-- 浮动金额 -->
          <el-table-column
            prop="floatMoney"
            :label="'浮动金额(Rp)'"
            min-width="160"
            align="right"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.floatMoney | formatNumber }}</span>
            </template>
          </el-table-column>
          <!-- 应付金额 -->
          <el-table-column
            prop="orderMoney"
            :label="'应付金额(Rp)'"
            min-width="160"
            align="right"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.orderMoney + scope.row.floatMoney) | formatNumber }}</span>
            </template>
          </el-table-column>
          <!-- 匹配模式 -->
          <el-table-column
            prop="matchRule"
            :label="'匹配模式'"
            min-width="160"
            align="left"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.matchRule == 'CUSTOMER_NAME'">客户名称匹配</span>
              <span v-if="scope.row.matchRule == 'CUSTOMER_BANK_CARD'">客户银行卡号</span>
              <span v-if="scope.row.matchRule == 'RANDOM_AMOUNT'">随机金额</span>
            </template>
          </el-table-column>
          <!-- 匹配备注 -->
          <el-table-column
            prop="matchingId"
            :label="'匹配备注'"
            min-width="160"
            align="left"
          />
          <!-- 卡商编号 -->
          <el-table-column
            prop="dealerNo"
            :label="'卡商编号'"
            min-width="160"
            align="left"
          />
          <!--状态  -->
          <el-table-column
            prop="status"
            :label="'状态'"
            min-width="160"
            align="left"
            fixed="right"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'NO_PAY'">下单成功未支付</span>
              <span v-if="scope.row.status == 'PAY_CANCEL'">退单</span>
              <span v-if="scope.row.status == 'SUCCESS'">支付成功</span>
              <span v-if="scope.row.status == 'TIME_OUT'">订单超时</span>
            </template>
          </el-table-column>
          <!--创建时间  -->
          <el-table-column
            prop="createTime"
            :label="'创建时间'"
            min-width="160"
            align="left"
          />
          <!-- 最近更新时间 -->
          <el-table-column
            prop="successTime"
            :label="'交易成功时间'"
            min-width="160"
            align="left"
          />
          <!--商户备注  -->
          <el-table-column
            prop="matchingRemark"
            :label="'商户备注'"
            min-width="240"
            align="left"
          />
          <!-- 操作 -->
          <el-table-column
            :label="'操作'"
            min-width="240"
            fixed="right"
            align="left"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status !== 'NO_PAY'"
                name="111"
                size="mini"
                type="primary"
                @click="noticeReissue(scope.row)"
              >
                补发通知
              </el-button>
              <el-button
                v-if="(scope.row.status === 'SUCCESS' || scope.row.status === 'TIME_OUT') && userIdList.includes('100300010002')"
                name="111"
                size="mini"
                type="danger"
                @click="Chargeback(scope.row)"
              >
                退单
              </el-button>
              <el-button
                v-if="(scope.row.status === 'PAY_CANCEL' || scope.row.status === 'TIME_OUT' || scope.row.status === 'NO_PAY') && userIdList.includes('100300010001')"
                name="111"
                size="mini"
                type="success"
                @click="SuppOrder(scope.row)"
              >
                补单
              </el-button>
            </template>
          </el-table-column>
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
    <div v-else class="templateTwo">
      <!-- <el-dialog :title="editOrderType == 0?'补单':'退单'" :visible.sync="dialogTableVisible" width="88%"> -->
      <p class="title">{{ editOrderType == 0 ? '补单 ' : '退单' }}</p>
      <div style="display: flex; align-items: center;">
        <p style="padding-right: 5px;"><span style="color: red;padding-right:4px;">*</span>登录密码</p>
        <el-input
          v-model.trim="userPassword"
          placeholder="请输入当前用户的登录密码"
          class="merchant_input"
          type="password"
          @blur="userPassword = $event.target.value"
        />
      </div>
      <p style="padding-left: 5px;">订单数量：{{ formData.submitOrderList.length }}</p>
      <el-form ref="formRef" :model="formData" :rules="formData.rules">
        <el-table
          ref="orderTable"
          :data="formData.submitOrderList"
          max-height="550"
          class="merchant_table"
          border
          :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
          @cell-click="copyText"
        >
          <el-table-column property="platOrderNum" label="平台订单号" width="200" />
          <el-table-column property="orderNum" label="商户订单号" width="150" />
          <el-table-column property="channelName" label="收款通道" width="150" />
          <el-table-column property="orderMoney" label="订单金额（Rp）" width="150" />
          <el-table-column property="floatMoney" label="浮动金额（Rp）" width="150" />
          <el-table-column property="orderMoney" label="应付金额（Rp）" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.orderMoney + scope.row.floatMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="银行流水ID" width="300">
            <template slot-scope="scope">
              <!-- <el-select
                    style="width:100%"
                    v-if="!editOrderType"
                    v-model="scope.row.flowId"
                    :placeholder="'银行流水ID'"
                    clearable
                    class="merchant_input"
                    @change="changecardFlow(scope.$index)"
                  >
                    <el-option
                      v-for="item in cardFlowOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select> -->
              <el-form-item :prop="'submitOrderList.' + scope.$index + '.flowId'" :rules="formData.rules.flowId" style="margin-bottom: 0;">
                <el-input v-if="!editOrderType" v-model="scope.row.flowId" :placeholder="'银行流水ID'" @change="changecardFlow(scope.$index)" />
              </el-form-item>
              <el-input v-if="editOrderType" v-model="scope.row.flowId" disabled />
            </template>
          </el-table-column>
          <el-table-column v-if="!editOrderType" label="实收金额（Rp）" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.orderPayNum" disabled />
            </template>
          </el-table-column>
          <el-table-column v-if="editOrderType" label="实收金额（Rp）" width="150">
            <template slot-scope="scope">
              <el-input v-if="scope.row.flowId" v-model="scope.row.inMoney" disabled />
              <el-input v-else :v-model="0" disabled />

            </template>
          </el-table-column>
          <el-table-column label="差额（Rp）" width="150" fixed="right">
            <template slot-scope="scope">
              <span v-if="!editOrderType" style="color:red;">{{ scope.row.orderPayNum ? scope.row.orderPayNum - (+scope.row.orderMoney + scope.row.floatMoney) : '' }}</span>
              <span v-if="editOrderType" style="color:red;">{{ scope.row.flowId ? 0 : 0 }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button v-preventReClick type="primary" @click="OrderClick">确 定</el-button>
      </div>
      <!-- </el-dialog> -->
    </div>
  </div>
</template>
<script>
import { orderPay, orderStatus, matchingRule, batchNotifyMerchant, listOrderOperationLog, batchFillingPay, batchChargebackPay, orderOperation } from '@/api/transaction'
import { allChannel } from '@/api/channel'
import { bankEnum, cardFlow_page, writeOrderPayExcel, getOrderPayExcel, orderPay_summary } from '@/api/card'
import { arrayOfObject, getPropertyIfExists } from '@/filters'
import MD5 from 'crypto-js/md5'
import moment from 'moment-timezone'
export default {
  name: 'CollectionOrder',
  data() {
    return {
      writeOrderPayExcel,
      getOrderPayExcel,
      total: 0,
      tableData: [],
      userPassword: '',
      currency: 'Rp',
      userIdList: JSON.parse(localStorage.getItem(process.env.VUE_APP_PARAM + '_MENUIDLIST')),
      TimeZone: localStorage.getItem('TimeZone'),
      list: {
        current: 1,
        size: 80,
        platOrderNum: undefined, // 平台订单号
        bankName: '',
        orderNum: undefined, // 商户订单号
        mchNo: undefined, // 收款商户编号
        dealerNo: undefined, // 卡商编号
        matchRule: undefined, // 匹配规则
        channelName: undefined, // 通道名称
        bankCard: undefined, // 收款账号
        status: undefined, // 订单状态
        matchingId: undefined, // 匹配备注
        startCreateTime: undefined, // 订单创建开始时间
        endCreateTime: undefined, // 订单创建结束时间
        startSuccessTime: undefined, // 交易成功开始时间
        endSuccessTime: undefined // 交易成功结束时间
      },
      createTime: [],
      updataTime: [],
      multipleSelection: [], // 选中的数据
      matchingRuleOption: [],
      bankCardStateOption: [],
      orderStatusOption: [],
      editOrderType: 0,
      dialogTableVisible: false,
      lastClickedRow: null, // 二级展开只调用一次接口
      expands: [], // 节点操作日志数据
      createTimeStr: '',
      orderTimeLines: [],
      cardFlowOptions: [],
      cardFlowInfo: [],
      formData: {
        submitOrderList: [],
        rules: {
          flowId: { validator: this.validateID, trigger: 'blur' }
        }
      },
      orderOpera: {},
      bankNameOption: [{
        label: 'BRI',
        value: 'BRI'
      }, {
        label: 'BCA',
        value: 'BCA'
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
          if (this.createTime) {
            const start = new Date(this.createTime[0]).getTime()
            const one = start + 1000 * 3600 * 24 * 31
            const two = start - 1000 * 3600 * 24 * 31
            return (time.getTime() < two || time.getTime() > one)
          } else {
            return
          }
        }
      },
      pickerOptionsUp: {
        onPick: (obj) => {
          if (obj.minDate) {
            this.updataTime[0] = new Date(obj.minDate).getTime()
          }
        },
        disabledDate: (time) => {
          if (!this.updataTime) {
            this.updataTime = []
          }
          if (this.updataTime) {
            const start = new Date(this.updataTime[0]).getTime()
            const one = start + 1000 * 3600 * 24 * 31
            const two = start - 1000 * 3600 * 24 * 31
            return (time.getTime() < two || time.getTime() > one)
          } else {
            return
          }
        }
      },
      summaryInfo: {
        orderMoney: 0,
        actuallyMoney: 0,
        count: 0,
        orderFee: 0
      }// 统计数据
    }
  },
  computed: {
    esportlist() {
      return {
        size: this.list.size,
        current: this.list.current,
        mchNo: this.list.mchNo ? this.list.mchNo : undefined,
        platOrderNum: this.list.platOrderNum ? this.list.platOrderNum : undefined,
        bankName: this.list.bankName ? this.list.bankName : undefined,
        bankCard: this.list.bankCard ? this.list.bankCard : undefined,
        orderNum: this.list.orderNum ? this.list.orderNum : undefined,
        matchingId: this.list.matchingId ? this.list.matchingId : undefined,
        dealerNo: this.list.dealerNo ? this.list.dealerNo : undefined,
        matchRule: this.list.matchRule ? this.list.matchRule : undefined,
        channelName: this.list.channelName ? this.list.channelName : undefined,
        status: this.list.status ? this.list.status : undefined,
        startCreateTime: this.list.startCreateTime ? this.list.startCreateTime : undefined,
        endCreateTime: this.list.endCreateTime ? this.list.endCreateTime : undefined,
        startSuccessTime: this.list.startSuccessTime ? this.list.startSuccessTime : undefined,
        endSuccessTime: this.list.endSuccessTime ? this.list.endSuccessTime : undefined
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  created() {
    this.orderStatus()
    this.bankCardState()
    this.matchingRule()
    this.orderOperation()
  },
  methods: {
    //  日期
    dateChangeCreate(val) {
      this.list.startCreateTime = val ? moment.tz(val[0], this.TimeZone).valueOf() : undefined
      this.list.endCreateTime = val ? moment.tz(val[1], this.TimeZone).valueOf() : undefined
    },
    //  日期
    dateChangeUp(val) {
      this.list.startSuccessTime = val ? moment.tz(val[0], this.TimeZone).valueOf() : undefined
      this.list.endSuccessTime = val ? moment.tz(val[1], this.TimeZone).valueOf() : undefined
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
      this.expands = []
      this.lastClickedRow = null
      const searchInfo = {
        size: this.list.size,
        current: 1
      }
      orderPay(searchInfo)
        .then(async(res) => {
          this.tableData = res.data.records
          this.tableData.forEach(item => {
            this.$set(item, 'orderTimeLines', [])
          })
          this.total = +res.data.total
          const summaryInfo = await orderPay_summary(searchInfo)
          this.summaryInfo = summaryInfo.data
        }).catch(error => {
          console.log(error)
        })
    },
    // 查询
    search(y) {
      if (y !== false) {
        this.current = 1
      }
      this.expands = []
      this.lastClickedRow = null
      const searchInfo = {
        size: this.list.size,
        current: this.list.current,
        mchNo: this.list.mchNo ? this.list.mchNo : undefined,
        platOrderNum: this.list.platOrderNum ? this.list.platOrderNum : undefined,
        bankName: this.list.bankName ? this.list.bankName : undefined,
        bankCard: this.list.bankCard ? this.list.bankCard : undefined,
        orderNum: this.list.orderNum ? this.list.orderNum : undefined,
        matchingId: this.list.matchingId ? this.list.matchingId : undefined,
        dealerNo: this.list.dealerNo ? this.list.dealerNo : undefined,
        matchRule: this.list.matchRule ? this.list.matchRule : undefined,
        channelName: this.list.channelName ? this.list.channelName : undefined,
        status: this.list.status ? this.list.status : undefined,
        startCreateTime: this.list.startCreateTime ? this.list.startCreateTime : undefined,
        endCreateTime: this.list.endCreateTime ? this.list.endCreateTime : undefined,
        startSuccessTime: this.list.startSuccessTime ? this.list.startSuccessTime : undefined,
        endSuccessTime: this.list.endSuccessTime ? this.list.endSuccessTime : undefined
      }
      orderPay(searchInfo)
        .then(async(res) => {
          this.tableData = res.data.records
          this.tableData.forEach(item => {
            this.$set(item, 'orderTimeLines', [])
          })
          this.total = +res.data.total
          const summaryInfo = await orderPay_summary(searchInfo)
          this.summaryInfo = summaryInfo.data
        }).catch(error => {
          console.log(error)
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
      this.list.current = 1
      this.list.platOrderNum = undefined
      this.list.orderNum = undefined
      this.list.bankName = undefined
      this.list.mchNo = undefined
      this.list.dealerNo = undefined
      this.list.matchRule = undefined
      this.list.matchingId = undefined
      this.list.channelName = undefined
      this.list.bankCard = undefined
      this.list.status = undefined
      this.list.startCreateTime = undefined
      this.list.endCreateTime = undefined
      this.list.startSuccessTime = undefined
      this.list.endSuccessTime = undefined
      this.createTime = [],
      this.updataTime = [],

      this.getTableData()
    },
    // 详情
    detail(row) {
      this.$router.push({
        path: '/agentManagement/agentDetails/' + row.mchId,
        query: {
          agentId: row.mchId
        }
      })
    },
    // 表格多选选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    async orderStatus() {
      const res = await orderStatus()
      this.orderStatusOption = arrayOfObject(res.data)
    },
    async bankCardState() {
      const res = await allChannel()
      res.data.forEach(item => {
        this.bankCardStateOption.push({
          label: item.channelName,
          value: item.channelName
        })
      })
    },
    async matchingRule() {
      const res = await matchingRule()
      this.matchingRuleOption = arrayOfObject(res.data)
    },
    // 单独退单
    Chargeback(value) {
      this.formData.submitOrderList = [value]
      this.editOrderType = 1
      this.dialogTableVisible = true
    },
    // 单独补单
    SuppOrder(value) {
      if (!value.hasOwnProperty('orderPayNum')) {
        this.$set(value, 'orderPayNum', '')
      }
      this.formData.submitOrderList = [value]
      this.getCardFlow()
      this.editOrderType = 0
      this.dialogTableVisible = true
    },
    // 补单退单操作 0/补单  1/退单
    SupOrder(type) {
      if (this.multipleSelection.length < 1) { return this.$message.warning('请先选择订单') }
      this.editOrderType = type
      if (this.editOrderType == 0) {
        // 补单操作
        this.getCardFlow()
        this.formData.submitOrderList = this.multipleSelection.filter(item => item.status !== 'SUCCESS')
        this.formData.submitOrderList.forEach(item => {
          item.orderPayNum = ''
        })
      } else {
        // 退单操作
        // this.getCardFlow()
        this.formData.submitOrderList = this.multipleSelection.filter(item => item.status !== 'PAY_CANCEL')
      }
      this.dialogTableVisible = true
    },
    OrderClick() {
      if (this.editOrderType == 0) {
        // 补单
        this.SubmitSupOrder()
      } else {
        // 退单
        this.SubmitBacOrder()
      }
    },
    // 补单确定
    async SubmitSupOrder() {
      this.$refs.formRef.validate(async(valid) => {
        if (valid) {
          if (!this.userPassword) {
            return this.$message.warning('请输入登录密码进行校验')
          }
          const dataInfo = {
            password: MD5(this.userPassword).toString().toUpperCase(),
            orderNumAndFlowList: []
          }
          this.formData.submitOrderList.forEach(item => {
            dataInfo.orderNumAndFlowList.push({
              flowId: item.flowId,
              platOrderNum: item.platOrderNum
            })
          })
          const res = await batchFillingPay(dataInfo)
          console.log(res, '——————补单——————')
          if (res.code === '021-000-S-999') {
            this.$refs.orderTable.clearSelection()
            this.$message.success('操作成功')
            this.dialogTableVisible = false
            this.formData.submitOrderList = []
            this.search()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 退单确定
    async SubmitBacOrder() {
      const dataInfo = {
        password: MD5(this.userPassword).toString().toUpperCase(),
        platOrderNumList: []
      }
      this.formData.submitOrderList.forEach(item => {
        dataInfo.platOrderNumList.push(
          item.platOrderNum
        )
      })
      const res = await batchChargebackPay(dataInfo)
      console.log(res, '——————退单——————')
      if (res.code === '021-000-S-999') {
        this.$refs.orderTable.clearSelection()
        this.$message.success('操作成功')
        this.dialogTableVisible = false
        this.formData.submitOrderList = []
        this.search()
      }
    },
    // 补发通知
    noticeReissue(row) {
      this.$confirm('是否补发通知?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await batchNotifyMerchant({
          platOrderNumList: [row.platOrderNum]
        })
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
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
        this.timeLines(row)
      }
    },
    // 时间轴
    timeLines(row) {
      row.orderTimeLines = []
      listOrderOperationLog(row.platOrderNum).then((res) => {
        row.orderTimeLines = res.data ? res.data : []
        row.orderTimeLines.forEach(item => {
          item.operationType = getPropertyIfExists(this.orderOpera, item.operationType)
        })
        console.log(res, '====platOrderNum====')
      })
    },
    async getCardFlow() {
      const res = await cardFlow_page({
        current: 1,
        size: 9999
      })
      console.log(res)
      const dataInfo = res.data.records
      this.cardFlowInfo = dataInfo.filter(item => !item.state)
      this.cardFlowOptions = []
      this.cardFlowInfo.forEach(item => {
        this.cardFlowOptions.push({
          label: item.flowId,
          value: item.flowId
        })
      })
    },
    // 修改订单流水号自动带出对应金额
    changecardFlow(index) {
      const idList = this.cardFlowInfo.map(item => item.flowId)
      if (!idList.includes(this.formData.submitOrderList[index].flowId)) {
        this.$set(this.formData.submitOrderList[index], 'orderPayNum', '')
        return
      }
      this.cardFlowInfo.forEach(item => {
        if (item.flowId === this.formData.submitOrderList[index].flowId) {
          this.$set(this.formData.submitOrderList[index], 'orderPayNum', item.inMoney)
        }
      })
    },
    validateID(rule, value, callback) {
      const idList = this.cardFlowInfo.map(item => item.flowId)
      if (!idList.includes(value)) {
        callback(new Error('流水订单号已匹配或不存在,请重新输入'))
      } else {
        callback()
      }
    },
    // 订单操作类型枚举
    async orderOperation() {
      const res = await orderOperation()
      console.log(res, '==订单操作类型枚举====')
      if (res.code === '021-000-S-999') {
        this.orderOpera = res.data
      // getPropertyIfExists(orderOpera,index.operationType)
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
.dialog-footer {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  /* padding: 20px; */
}
.title {
  font-size: 22px;
  font-weight: bold;
}
</style>
