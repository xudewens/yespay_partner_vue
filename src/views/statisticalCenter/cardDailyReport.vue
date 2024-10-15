<template>
  <!-- 卡交易日报表 -->
  <div class="dashbody">
    <div class="move moveList">
       <!-- 开始时间 -->
       <div class="merchant">
        <el-date-picker
          v-model="createTime"
          class="merchant_input"
          type="daterange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :range-separator="'至'"
          :start-placeholder="'开始时间'"
          :end-placeholder="'结束时间'"
          :picker-options="pickerOptionsCreate"
          @change="dateChange1"
        />
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.bankCard"
          placeholder="银行账号"
          class="merchant_input"
          @blur="list.bankCard = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-select
          v-model="list.bankName"
          :placeholder="'银行名称'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in bankOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
         <!-- 查看导出列表弹窗 -->
         <export-download
          style="display: inline-block;"
          :query-value="esportlist"
          :is-mark="true"
          file-name="BCA流水列表"
          :expand-fun="dayReport_export"
          :expand-listfun="getOrderPayExcel"
        />
      </div>
      <el-table
        :data="tableData"
        ref="tableList"
        max-height="600"
        class="merchant_table"
        border
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
        @cell-click="copyText"
        :row-key="getRowKeys"
        current-row-key
        :expand-row-keys="expands"
        @expand-change="expandSelect"
        @sort-change="sortChange"
      >
        <el-table-column type="expand" align="center" width="40" fixed="left">
          <template  slot-scope="scope">
            <!-- 二级表格 -->
            <el-table
              :data="scope.row.orderTimeLines"
              border
              class="twoTable"
              @cell-click="copyText"
            >
              <el-table-column
                prop="transType"
                min-width="80"
                label="交易类型"
                align="center"
                show-overflow-tooltip
              >
              <template slot-scope="scopes">
                  <span v-if="scopes.row.transType === 'W'">出款</span>
                  <span v-if="scopes.row.transType === 'P'">收款</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="orderCount"
                label="订单总数"
                min-width="100"
                align="right"
                show-overflow-tooltip
              >       
                <template slot-scope="scopes">
                  <span>{{ scopes.row.orderCount || 0 | formatNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="successOrderCount"
                label="订单成功数"
                min-width="90"
                align="right"
                show-overflow-tooltip
              >
                <template slot-scope="scopes">
                  <span>{{ scopes.row.successOrderCount || 0 | formatNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="successRate"
                min-width="90"
                label="订单成功率"
                align="right"
                show-overflow-tooltip
              >
                <template slot-scope="scopes">
                  <span>{{scopes.row.successRate ?`${(scopes.row.successRate*100).toFixed(2)}%` : '0%' }}</span>
                </template>
            </el-table-column>
              <el-table-column
                prop="supplyOrderCount"
                min-width="90"
                label="补单笔数"
                align="right"
                show-overflow-tooltip
              >
                <template slot-scope="scopes">
                  <span>{{ scopes.row.supplyOrderCount || 0 | formatNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="supplyRate"
                min-width="80"
                label="补单率"
                align="right"
                show-overflow-tooltip
              >
              <template slot-scope="scopes">
                  <span>{{scopes.row.supplyRate ?`${(scopes.row.supplyRate*100).toFixed(2)}%` : '0%' }}</span>
              </template>
            </el-table-column>
              <el-table-column
                prop="totalOrderMoney"
                min-width="130"
                label="订单总额（Rp）"
                align="right"
                show-overflow-tooltip
              >
                <template slot-scope="scopes">
                  <span>{{ scopes.row.totalOrderMoney || 0 | formatNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="successOrderMoney"
                min-width="130"
                label="订单成功额（Rp）"
                align="right"
                show-overflow-tooltip
              >
               <template slot-scope="scopes">
                  <span>{{ scopes.row.successOrderMoney || 0 | formatNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="orderPayFee"
                min-width="130"
                label="订单手续费（Rp）"
                align="right"
                show-overflow-tooltip
              >
                <template slot-scope="scopes">
                  <span>{{ scopes.row.orderPayFee || 0 | formatNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="baseFee"
                min-width="100"
                label="成本（Rp）"
                align="right"
                show-overflow-tooltip
              >               
                <template slot-scope="scopes">
                    <span>{{ scopes.row.baseFee || 0 | formatNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="grossProfit"
                min-width="100"
                label="毛利（Rp）"
                align="right"
                show-overflow-tooltip
              >
                <template slot-scope="scopes">
                    <span>{{ scopes.row.grossProfit || 0 | formatNumber}}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      <!--序号 -->
      <!-- <el-table-column
          :label="'序号'"
          width="80"
          align="left"
          prop="id"
          show-overflow-tooltip
        /> -->
        <!--日期 -->
        <el-table-column
          :label="'日期'"
          width="120"
          align="center"
          prop="reportDate"
          sortable="custom"
          fixed="left"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span>{{ timeFormat(scope.row.reportDate) }}</span>
        </template>
      </el-table-column>
        <!-- 账号 -->
        <el-table-column
          prop="bankCard"
          :label="'账号'"
          min-width="120"
          align="center"
          show-overflow-tooltip
        />
        <!-- 账户名 -->
        <el-table-column
          prop="cardholderName"
          :label="'账户名'"
          min-width="100"
          align="center"
          show-overflow-tooltip
        />
        <!-- 银行 -->
        <el-table-column
          prop="bankName"
          :label="'机构'"
          min-width="100"
          align="center"
          show-overflow-tooltip
        >
      </el-table-column>
        <!-- 订单总数 -->
        <el-table-column
          prop="orderCount"
          :label="'订单总数'"
          min-width="100"
          align="right"
          sortable="custom"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span>{{ scope.row.orderCount || 0 | formatNumber}}</span>
        </template>
      </el-table-column>
        <!-- 订单成功数 -->
        <el-table-column
          prop="successOrderCount"
          :label="'订单成功数'"
          min-width="120"
          align="right"
          sortable="custom"
          show-overflow-tooltip
        >     
        <template slot-scope="scope">
            <span>{{ scope.row.successOrderCount || 0 | formatNumber}}</span>
          </template>
      </el-table-column>
        <!-- 订单成功率 -->
        <el-table-column
          prop="successRate"
          :label="'订单成功率'"
          min-width="120"
          sortable="custom"
          align="right"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
              <span>{{scope.row.successRate ?`${(scope.row.successRate*100).toFixed(2)}%` : '0%' }}</span>
          </template>
      </el-table-column>
        <!-- 补单笔数 -->
        <el-table-column
          prop="supplyOrderCount"
          :label="'补单笔数'"
          min-width="100"
          sortable="custom"
          align="right"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
            <span>{{ scope.row.supplyOrderCount || 0 | formatNumber}}</span>
          </template>
      </el-table-column>
        <!-- 补单率 -->
        <el-table-column
          prop="supplyRate"
          :label="'补单率'"
          min-width="90"
          align="right"
          sortable="custom"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
            <span>{{scope.row.supplyRate ?`${(scope.row.supplyRate*100).toFixed(2)}%` : '0%' }}</span>
        </template>
      </el-table-column>
        <!-- 订单总额 -->
        <el-table-column
          prop="totalOrderMoney"
          :label="'订单总额(Rp)'"
          min-width="120"
          align="right"
          sortable="custom"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
            <span>{{ scope.row.totalOrderMoney || 0 | formatNumber}}</span>
          </template>
        </el-table-column>
        <!-- 订单成功额 -->
        <el-table-column
          prop="successOrderMoney"
          :label="'订单成功额(Rp)'"
          min-width="130"
          align="right"
          sortable="custom"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
            <span>{{ scope.row.successOrderMoney || 0 | formatNumber}}</span>
          </template>
        </el-table-column>
        <!-- 订单手续费 -->
        <el-table-column
          prop="orderPayFee"
          :label="'订单手续费(Rp)'"
          min-width="130"
          align="right"
          sortable="custom"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
            <span>{{ scope.row.orderPayFee || 0 | formatNumber}}</span>
          </template>
        </el-table-column>
         <!-- 成本 -->
         <el-table-column
          prop="baseFee"
          :label="'成本(Rp)'"
          min-width="100"
          align="right"
          sortable="custom"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
            <span>{{ scope.row.baseFee || 0 | formatNumber}}</span>
          </template>
        </el-table-column>
         <!-- 毛利 -->
         <el-table-column
          prop="grossProfit"
          :label="'毛利(Rp)'"
          min-width="100"
          align="right"
          sortable="custom"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
            <span>{{ scope.row.grossProfit || 0 | formatNumber}}</span>
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
</template>
<script>
import {dayReport,dayReport_detail,dayReport_export,getOrderPayExcel} from '@/api/summary'
// import { arrayOfObject } from '@/filters'
import moment from 'moment-timezone';
export default {
  name: 'cardDailyReport',
  data() {
    return {
      dayReport_export,
      getOrderPayExcel,
      total: 0,
      tableData: [],
      size1: '', // 开始下标
      size2: '', // 结束下标
      allData: [], // 全部数据
      multipleSelection:[],
      TimeZone:localStorage.getItem('TimeZone'),
      list: {
        current: 1,
        size: 80,
        bankCard: undefined, // 通道名称
        bankName: undefined, // 订单状态
        startTime:undefined,
        endTime:undefined,
      },
      bankOption:[{
        label:'BCA',
        value:'BCA'
      },{
        label:'BRI',
        value:'BRI'
      },],
      lastClickedRow: null, // 二级展开只调用一次接口
      expands:[],//节点操作日志数据
      orderTimeLines:[],
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
      createTime:[this.getStartOfDay(), this.getEndOfDay()],
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
     //  日期
     dateChange1(val) {
      this.list.startTime = val ? moment.tz(val[0], this.TimeZone).valueOf() : undefined
      this.list.endTime = val ? moment.tz(val[1], this.TimeZone).valueOf() : undefined
    },
    // 分页
    handleSizeChange(size) {
      this.list.size = size
      // this.search()
      this.size2 = this.list.size * this.list.current
      this.size1 = this.size2 - this.list.size
      this.tableData = this.allData.slice(this.size1, this.size2)

    },
    handleCurrentChange(current) {
      this.list.current = current
      // this.search(false)
      this.size2 = this.list.size * current
      this.size1 = this.size2 - this.list.size
      this.tableData = this.allData.slice(this.size1, this.size2)
    },
    //  读取全部列表
    getTableData() {
      this.expands = []
      this.lastClickedRow = null
      dayReport({
        size: 99999,
        current: 1,
        startTime: this.createTime[0] ? moment.tz(this.createTime[0], this.TimeZone).valueOf() : undefined,
        endTime: this.createTime[1] ? moment.tz(this.createTime[1], this.TimeZone).valueOf() : undefined,
      })
      .then(res => {
        if(res.data.records.length === 0) {
          this.allData = []
          this.tableData = []
        }else {
          this.allData = res.data.records
          this.size1 = 0
          this.size2 = this.list.size
          this.tableData = this.allData.slice(this.size1, this.size2)
        }
        // this.tableData = res.data.records
        this.total = +res.data.total
      }).catch(error => {
        console.log(error);
      });
    },
    // 查询
    search(y) {
      if (y !== false) {
        this.list.current = 1
      }
      if(!this.createTime) {
        this.createTime = [this.getStartOfDay(), this.getEndOfDay()]
      }
      this.expands = []
      this.lastClickedRow = null
      dayReport({
          size: 99999,
          current: this.list.current,
          bankName: this.list.bankName !== '' ? this.list.bankName : undefined,
          bankCard: this.list.bankCard !== '' ? this.list.bankCard : undefined,
          startTime: this.createTime[0] ? moment.tz(this.createTime[0], this.TimeZone).valueOf() : undefined,
          endTime: this.createTime[1] ? moment.tz(this.createTime[1], this.TimeZone).valueOf() : undefined
          
      })
      .then(res => {
        if(res.data.records.length === 0) {
          this.allData = []
          this.tableData = []
        }else {
          this.allData = res.data.records
          this.size1 = 0
          this.size2 = this.list.size
          this.total = +res.data.total
          this.tableData = this.allData.slice(this.size1, this.size2)
        }
      }).catch(error => {
        console.log(error);
      });
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
      this.list.bankName = undefined
      this.list.bankCard = undefined
      this.list.startTime = undefined
      this.list.endTime = undefined
      this.createTime = [this.getStartOfDay(), this.getEndOfDay()]
      this.getTableData()
      if (this.$refs.tableList) {
        this.$refs.tableList.clearSort()
      }

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
    timeFormat(value){
      if (value) {
          // 拆分日期时间字符串
          const parts = value.split(' ');
          const dateParts = parts[0].split('-');

          // 构建新的 Date 对象
          const dateTime = new Date(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2])
          );

          // 获取年月日部分并重新格式化
          const formattedDateString = dateTime.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
          return formattedDateString;
      } else {
          return '';
      }
    },
    getStartOfDay() {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      return start;
    },
    getEndOfDay() {
      const end = new Date();
      end.setDate(end.getDate() + 1);
      end.setHours(0, 0, 0, 0);
      return end;
    },
    // 时间轴
    timeLines(row) {
      console.log(row,'===row===')
      dayReport_detail({
        id:row.id
      }).then((res) => {
        this.tableData.forEach(item => {
          if(row.id === item.id)
            this.$set(item, 'orderTimeLines', res.data);
            console.log(item.orderTimeLines,'======')
          })
      })
    },
    sortChange({ column, prop, order }) { // 列，字段名，排序顺序 ascending：升序 descending：降序
      // 排序
      this.allData.sort((a, b) => {
        const A = a[prop]
        const B = b[prop]
        if (order === 'ascending') {
          if (A > B) {
            return 1 // 放在后面
          } else if (A < B) {
            return -1 // 放在前面
          } else {
            return 0
          }
        } else if (order === 'descending') {
          if (A < B) {
            return 1 // 放在后面
          } else if (A > B) {
            return -1 // 放在前面
          } else {
            return 0
          }
        } else {
          return
        }
      })
      this.tableData = this.allData.slice(this.size1, this.size2)
    },
  },
  computed: {
    esportlist(){
      return {
        size: this.list.size,
        current: this.list.current,
        bankName: this.list.bankName !== '' ? this.list.bankName : undefined,
        bankCard: this.list.bankCard !== '' ? this.list.bankCard : undefined,
        startTime: this.list.startTime ?  this.list.startTime   : undefined,
        endTime: this.list.endTime ?this.list.endTime : undefined,
      }
    }
  }
}
</script>

<style scoped>
.el-table td {
  padding: 4px 0;
}
.el-table .cell p {
  margin: 0;
}

.twoTable {
  width: calc(100vw - 430px);
  margin-left: 15px;
}
</style>
