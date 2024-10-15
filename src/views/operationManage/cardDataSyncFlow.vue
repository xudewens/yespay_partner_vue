<template>
  <!-- 机器人同步记录 -->
  <div class="dashbody">
    <div class="move moveList">
       <!-- 流水开始时间 -->
       <div class="merchant">
        <el-date-picker
          v-model="createTime"
          class="merchant_input"
          type="datetimerange"
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
         <!-- <export-download
          style="display: inline-block;"
          :query-value="esportlist"
          :is-mark="true"
          file-name="BCA流水列表"
          :expand-fun="dayReport_export"
          :expand-listfun="getOrderPayExcel"
        /> -->
      </div>
      <el-table
        :data="tableData"
        ref="tableList"
        max-height="600"
        class="merchant_table"
        border
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
        @cell-click="copyText"
        current-row-key
      >
      <!--序号 -->
      <el-table-column
          :label="'序号'"
          width="80"
          align="left"
          prop="id"
          show-overflow-tooltip
        />
        <!--日期 -->
        <el-table-column
          :label="'操作时间'"
          width="180"
          align="left"
          prop="updateTime"
          show-overflow-tooltip
        />
        <!-- 账号 -->
        <el-table-column
          prop="bankCard"
          :label="'账号'"
          width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 银行 -->
        <el-table-column
          prop="bankName"
          :label="'银行'"
          width="150"
          align="left"
          show-overflow-tooltip
        >
      </el-table-column>
        <!-- 耗时(秒) -->
        <el-table-column
          prop="requestTime"
          :label="'耗时(秒)'"
          width="150"
          align="left"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
            <span>{{scope.row.requestTime ? (+scope.row.requestTime/1000).toFixed(2) : 0}}</span>
          </template>
      </el-table-column>
      <el-table-column
          prop="errLogs"
          :label="'说明'"
          align="left"
          show-overflow-tooltip
        >
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
import { cardDataSyncFlowPage } from '@/api/card'
// import { arrayOfObject } from '@/filters'
import moment from 'moment-timezone';
export default {
  name: 'cardDataSyncFlow',
  data() {
    return {
      total: 0,
      tableData: [],
      multipleSelection:[],
      TimeZone:localStorage.getItem('TimeZone'),
      list: {
        current: 1,
        size: 80,
        bankCard: undefined, // 通道名称
        bankName: undefined, // 订单状态
        startSyncTime:undefined,
        endSyncTime:undefined,
      },
      bankOption:[{
        label:'BCA',
        value:'BCA'
      },{
        label:'BRI',
        value:'BRI'
      },],
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
      this.list.startSyncTime = val ? moment.tz(val[0], this.TimeZone).valueOf() : undefined
      this.list.endSyncTime = val ? moment.tz(val[1], this.TimeZone).valueOf() : undefined
    },
    // 分页
    handleSizeChange(size) {
      this.list.size = size
      console.log(this.list.size,'=====')
      this.search()
    },
    handleCurrentChange(current) {
      this.list.current = current
      console.log(this.list.current)
      this.search(false)
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
    //  读取全部列表
    getTableData() {
      cardDataSyncFlowPage({
        size: this.list.size,
        current: 1,
        startSyncTime: this.createTime[0] ? moment.tz(this.createTime[0], this.TimeZone).valueOf() : undefined,
        endSyncTime: this.createTime[1]? moment.tz(this.createTime[1], this.TimeZone).valueOf() : undefined,
      })
      .then(res => {
        this.tableData = res.data.records
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
      console.log(this.list.current)

      if(!this.createTime) {
        this.createTime = [this.getStartOfDay(), this.getEndOfDay()]
      }
      cardDataSyncFlowPage({
          size: this.list.size,
          current: this.list.current,
          bankName: this.list.bankName !== '' ? this.list.bankName : undefined,
          bankCard: this.list.bankCard !== '' ? this.list.bankCard : undefined,
          startSyncTime: this.createTime[0] ? moment.tz(this.createTime[0], this.TimeZone).valueOf() : undefined,
          endSyncTime: this.createTime[1] ? moment.tz(this.createTime[1], this.TimeZone).valueOf() : undefined,
      })
      .then(res => {
        this.tableData = res.data.records
        this.total = +res.data.total
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
      // this.list.startTime = undefined
      // this.list.endTime = undefined
      this.createTime = [this.getStartOfDay(), this.getEndOfDay()]
      this.getTableData()
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
  width: calc(100vw - 630px);
  margin-left: 85px;
}
</style>
