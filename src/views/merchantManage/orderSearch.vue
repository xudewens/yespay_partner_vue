<template>
  <!-- 卡商列表 -->
  <div class="dashbody">
    <div class="move moveList">
      <div class="merchant">
        <el-select
          v-model="list.paystatus"
          :placeholder="'支付状态'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in payStateOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.dealerName"
          placeholder="平台订单号"
          class="merchant_input"
          onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
          @blur="list.dealerName = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.dealerNo"
          placeholder="收款账号"
          class="merchant_input"
          onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
          @blur="list.dealerNo = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-date-picker
          v-model="createTime"
          class="merchant_input"
          type="daterange"
          :range-separator="'至'"
          :start-placeholder="'成功开始时间'"
          :end-placeholder="'成功结束时间'"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          @change="dateChange"
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
      <el-table
        :data="tableData"
        max-height="550"
        class="merchant_table"
        border
        stripe
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
        @cell-click="copyText"
      >
        <!--平台订单号 -->
        <el-table-column
          prop="mchNo"
          :label="'平台订单号'"
          width="300"
          align="left"
          type="index"
        />
        <!-- 机构 -->
        <el-table-column
          prop="dealerNo"
          :label="'机构'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 账号 -->
        <el-table-column
          prop="dealerName"
          :label="'账号'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 金额（Rp） -->
        <el-table-column
          prop="linkedName"
          :label="'金额（Rp）'"
          min-width="150"
          align="right"
          show-overflow-tooltip
        />
        <!-- 登录账号数量 -->
        <!-- <el-table-column
          prop="linkedType"
          :label="'登录账号数量'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        /> -->
        <!-- 状态 -->
        <el-table-column
          prop="status"
          :label="'状态'"
          min-width="80"
          align="left"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">启用</span>
            <span v-if="scope.row.status == 0" style="color: red;">禁用</span>
          </template>
        </el-table-column>
        <!-- 成功时间 -->
        <el-table-column
          prop="createTime"
          :label="'成功时间'"
          min-width="160"
          align="left"
        />
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
import { dealerInfo_table, update_dealerInfo } from '@/api/card'
export default {
  name: 'CardMerchant',
  data() {
    return {
      current: 1,
      size: 80,
      total: 0,
      TimeZone: localStorage.getItem('TimeZone'),
      tableData: [],
      list: {
        dealerName: '', // 平台订单号
        dealerNo: '', // 收款账号
        paystatus: '', // 支付状态
        endCreateTime: '', // 成功结束时间
        startCreateTime: ''// 成功开始时间
      },
      createTime: [],
      payStateOption: [{
        value: true,
        label: '支付成功'
      }, {
        value: false,
        label: '支付失败'
      }],
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
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    //  日期
    dateChange(val) {
      console.log(this.TimeZone, '====this.TimeZone===')
      this.list.startCreateTime = val ? moment.tz(val[0], this.TimeZone).valueOf() : ''
      this.list.endCreateTime = val ? moment.tz(val[1], this.TimeZone).valueOf() : ''
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
      dealerInfo_table({
        size: this.size,
        current: 1
      }).then((res) => {
        this.tableData = res.data.records
        this.total = +res.data.total
      })
    },
    // 查询
    search(y) {
      if (y !== false) {
        this.current = 1
      }
      dealerInfo_table({
        size: this.size,
        current: this.current,
        dealerName: this.list.dealerName !== '' ? this.list.dealerName : undefined,
        dealerNo: this.list.dealerNo !== '' ? this.list.dealerNo : undefined,
        startCreateTime: this.list.startCreateTime ? this.list.startCreateTime : undefined,
        endCreateTime: this.list.endCreateTime !== '' ? this.list.endCreateTime : undefined
      }).then((res) => {
        this.tableData = res.data.records
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
      this.list.dealerName = ''
      this.list.dealerNo = ''
      this.list.startCreateTime = ''
      this.list.endCreateTime = ''
      this.createTime = []
      this.getTableData()
    },
    // 详情
    detail(row) {
      if (row.id) {
        this.$router.push({
          path: '/cardMerchant/addcardMerchantEdit',
          query: {
            id: row.id,
            status: row.status,
            dealerName: row.dealerName,
            dealerNo: row.dealerNo,
            tgAlarmId: row.tgAlarmId,
            tgNotificationId: row.tgNotificationId
          }
        })
      } else {
        this.$router.push({
          path: '/cardMerchant/addcardMerchant'
        })
      }
    },
    // 禁用
    disabledItem(item) {
      this.$confirm('是否要禁用卡商，禁用后卡商所有操作账号无法登录卡商端', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await update_dealerInfo({
          id: item.id,
          status: '0'
        })
        if (res.code == '021-000-S-999') {
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
        })
      })
    },
    // 启用
    opemItem(item) {
      this.$confirm('是否要启用卡商?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await update_dealerInfo({
          id: item.id,
          status: '1'
        })
        if (res.code == '021-000-S-999') {
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
        })
      })
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
