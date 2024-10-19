<template>
  <!-- 卡商列表 -->
  <div class="dashbody">
    <div v-if="this.device === 'mobile'">
      <div class="header-order">
        <div class="header-title">
          查单
        </div>
        <div class="header-search-icon">
          <el-button type="primary" icon="el-icon-search" @click="handleShowSearch">搜索</el-button>
        </div>
      </div>

    </div>
    <div v-else class="move moveList">
      <div class="merchant">
        <el-select
          v-model="list.paystatus"
          :placeholder="'支付状态'"
          clearable
          disabled
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
          v-model.trim="list.platOrderNum"
          placeholder="平台订单号"
          clearable
          class="merchant_input"
          onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
          @blur="list.platOrderNum = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.bankCard"
          placeholder="收款账号"
          clearable
          class="merchant_input"
          onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
          @blur="list.bankCard = $event.target.value"
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
    <div v-if="this.device === 'mobile'">
      <div class="order-list">
        <div v-for="(item,index) in tableData" :key="index" class="order-item">
          <!-- top -->
          <div class="order-item-header">
            <div>
              {{ item.platOrderNum }}
            </div>
            <div>
              {{ item.paystatus }}
            </div>
          </div>
          <!-- 内容 -->
          <div class="order-item-container">
            <div class="item-container-main">
              <div class="order-item-icon">
                {{ item.bankName }}
              </div>
              <div class="order-item-orderMoney">
                {{ item.orderMoney }}
              </div>
            </div>
            <div class="item-container-bottom">
              <div class="container-cardCode">
                {{ item. bankCard }}
              </div>
              <div class="container-time">
                {{ item.successTime }}
              </div>
            </div>

          </div>
        </div>
      </div>
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

    <div v-else class="dashTable">
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
          prop="platOrderNum"
          :label="'平台订单号'"
          width="300"
          align="left"
        />
        <!-- 机构 -->
        <el-table-column
          prop="bankName"
          :label="'机构'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 账号 -->
        <el-table-column
          prop="bankCard"
          :label="'账号'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 金额（Rp） -->
        <el-table-column
          prop="orderMoney"
          :label="'金额（Rp）'"
          min-width="150"
          align="right"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.orderMoney | formatNumber }}</span>
          </template>
        </el-table-column>
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
            <span v-if="scope.row.status == 'SUCCESS'">成功</span>
          </template>
        </el-table-column>
        <!-- 成功时间 -->
        <el-table-column
          prop="successTime"
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

    <el-drawer
      title=""
      :visible.sync="searchDrawer"
      direction="btt"
      :before-close="handleClose"
      custom-class="search-drawer"
    >
      <div class="move moveList">
        <div class="merchant">
          <el-select
            v-model="list.paystatus"
            :placeholder="'支付状态'"
            clearable
            disabled
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
            v-model.trim="list.platOrderNum"
            placeholder="平台订单号"
            clearable
            class="merchant_input"
            onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
            @blur="list.platOrderNum = $event.target.value"
          />
        </div>
        <div class="merchant">
          <el-input
            v-model.trim="list.bankCard"
            placeholder="收款账号"
            clearable
            class="merchant_input"
            onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
            @blur="list.bankCard = $event.target.value"
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
        <div class="search-action">
          <el-button
            id="109"
            type="primary"
            @click="search(true)"
          >查询</el-button>
          <el-button @click="reset()">重置</el-button>
        </div>
      </div>
    </el-drawer>

  </div>
</template>
<script>
import { search_order } from '@/api/cardMch'
import moment from 'moment-timezone'
import { mapGetters } from 'vuex'

export default {
  name: 'CardMerchant',
  computed: {
    ...mapGetters(['device'])
  },
  data() {
    return {
      current: 1,
      size: 80,
      total: 0,
      TimeZone: localStorage.getItem('TimeZone'),
      tableData: [
        {
          orderMoney: 'Rp 10000',
          bankName: '中国银行',
          platOrderNum: '01', // 平台订单号
          bankCard: '24121341234234', // 收款账号
          paystatus: true, // 支付状态
          endSuccessTime: '', // 成功结束时间
          startSuccessTime: '2023-10-18'// 成功开始时间
        }
      ],
      list: {
        platOrderNum: '', // 平台订单号
        bankCard: '', // 收款账号
        paystatus: true, // 支付状态
        endSuccessTime: '', // 成功结束时间
        startSuccessTime: ''// 成功开始时间
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
      },
      searchDrawer: false
    }
  },
  mounted() {
    // this.getTableData()
  },
  methods: {
    handleShowSearch() {
      this.searchDrawer = true
    },
    //  日期
    dateChange(val) {
      console.log(this.TimeZone, '====this.TimeZone===')
      this.list.startSuccessTime = val ? moment.tz(val[0], this.TimeZone).valueOf() : ''
      this.list.endSuccessTime = val ? moment.tz(val[1], this.TimeZone).valueOf() : ''
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
      search_order({
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
      search_order({
        size: this.size,
        current: this.current,
        platOrderNum: this.list.platOrderNum !== '' ? this.list.platOrderNum : undefined,
        bankCard: this.list.bankCard !== '' ? this.list.bankCard : undefined,
        startSuccessTime: this.list.startSuccessTime ? this.list.startSuccessTime : undefined,
        endSuccessTime: this.list.endSuccessTime !== '' ? this.list.endSuccessTime : undefined
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
      this.list.platOrderNum = ''
      this.list.bankCard = ''
      this.list.startSuccessTime = ''
      this.list.endSuccessTime = ''
      this.createTime = []
      this.getTableData()
    }
  }
}
</script>

<style lang="scss">
.el-table td {
  padding: 4px 0;
}
.el-table .cell p {
  margin: 0;
}
.header-order{
display: flex;
justify-content: space-between;
padding: 20px 22px;
align-items: center;
background-color: #fff;
margin-bottom: 20px;
}
.header-title{
  font-size: 28px;
  font-weight: 500;
}
.header-search-icon{
  font-size: 22px;
}
</style>

<style lang="scss">
@media (max-width: 800px) {
.dashbody{
  padding: 0 !important;
}
}
.search-drawer{
  height: 60% !important;
}
.moveList{
  flex-direction: column;

}
.merchant{
width: 100% !important;
.merchant_input{
  width: 100% !important;
}
}

.search-action{
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .el-button{
    width: 48%;
  }
}
.order-list{
  background-color: #fff;
}
.item-container-main,.item-container-bottom,.order-item-header{
  padding: 10px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999999;
}
.order-item-header{
  font-size: 22px;
}
</style>
