<template>
  <!-- 出款订单 -->
  <div class="dashbody">
    <div class="move moveList">
      <div class="merchant">
        <el-input
          v-model.trim="list.mchNo"
          placeholder="平台订单号"
          class="merchant_input"
          @blur="list.mchNo = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.mchNo"
          placeholder="商户订单号"
          class="merchant_input"
          @blur="list.mchNo = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.mchNo"
          placeholder="出款商户编号"
          class="merchant_input"
          @blur="list.mchNo = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.mchNo"
          placeholder="卡商编号"
          class="merchant_input"
          @blur="list.mchNo = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-select
          v-model="list.googleBinded"
          :placeholder="'订单状态'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in googleBindeds"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-select
          v-model="list.googleBinded"
          :placeholder="'出款通道'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in googleBindeds"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.mchNo"
          placeholder="出款账号"
          class="merchant_input"
          @blur="list.mchNo = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-select
          v-model="list.googleBinded"
          :placeholder="'收款通道'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in googleBindeds"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.mchNo"
          placeholder="收款账号"
          class="merchant_input"
          @blur="list.mchNo = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-date-picker
          v-model="createTime"
          class="merchant_input"
          type="daterange"
          :range-separator="'至'"
          :start-placeholder="'创建开始时间'"
          :end-placeholder="'创建结束时间'"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="dateChange"
        />
      </div>
      <div class="merchant">
        <el-date-picker
          v-model="createTime"
          class="merchant_input"
          type="daterange"
          :range-separator="'至'"
          :start-placeholder="'更新开始时间'"
          :end-placeholder="'更新结束时间'"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
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
      <div class="operation">
        <el-button
          type="primary"
          style="margin-left:20px"
        >批量补单</el-button>
        <el-button
          type="primary"
          style="margin-left:20px"
        >批量退单</el-button>
        <el-button
          type="primary"
          style="margin-left:20px"
        >导出列表</el-button>
      </div>
      <el-table
        :data="tableData"
        max-height="450"
        class="merchant_table"
        border
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
        @cell-click="copyText"
      >
        <!--序号 -->
        <el-table-column
          prop="mchNo"
          :label="'序号'"
          width="60"
          align="left"
          type="index"
        />
        <!-- 平台订单号 -->
        <el-table-column
          prop="mchNo"
          :label="'平台订单号'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 商户订单号 -->
        <el-table-column
          prop="name"
          :label="'商户订单号'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 商户编号 -->
        <el-table-column
          prop="linkedName"
          :label="'商户编号'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 出款通道 -->
        <el-table-column
          prop="linkedType"
          :label="'出款通道'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 出款账号 -->
        <el-table-column
          prop="lowerMchCount"
          :label="'出款账号'"
          min-width="160"
          align="left"
        />
        <!-- 订单金额 -->
        <el-table-column
          prop="createTimeStr"
          :label="'订单金额(Rp)'"
          min-width="160"
          align="left"
        />
        <!-- 收款通道 -->
        <el-table-column
          prop="createTimeStr"
          :label="'收款通道'"
          min-width="160"
          align="left"
        />
        <!-- 收款账号 -->
        <el-table-column
          prop="createTimeStr"
          :label="'收款账号'"
          min-width="160"
          align="left"
        />
        <!-- 卡商编号 -->
        <el-table-column
          prop="createTimeStr"
          :label="'卡商编号'"
          min-width="160"
          align="left"
        />
        <!-- 状态 -->
        <el-table-column
          prop="createTimeStr"
          :label="'状态'"
          min-width="160"
          align="left"
        />
        <!-- 创建时间 -->
        <el-table-column
          prop="createTimeStr"
          :label="'创建时间'"
          min-width="160"
          align="left"
        />
        <!-- 最近更新时间 -->
        <el-table-column
          prop="createTimeStr"
          :label="'最近更新时间'"
          min-width="160"
          align="left"
        />
        <!-- 商户备注 -->
        <el-table-column
          prop="createTimeStr"
          :label="'商户备注'"
          min-width="240"
          align="left"
        />
        <!-- 操作 -->
        <el-table-column
          :label="'操作'"
          min-width="90"
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
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
// import { lower_agentList } from '@/api/essential'
export default {
  name: 'disbursementOrder',
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      list: {
        mchNo: '', // 代理商编号
        name: '', // 代理商名称
        startDate: '', // 添加时间
        endDate: '', // 添加时间
        createTimeStr: [] // 添加时间
      }
    }
  },
  mounted() {
    // this.getTableData()
  },
  methods: {
    //  日期
    dateChange(val) {
      this.list.startDate = val ? val[0] : ''
      this.list.endDate = val ? val[1] : ''
    },
    // 分页
    handleSizeChange(size) {
      this.pageSize = size
      this.search()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.search(false)
    },
    //  读取全部列表
    getTableData() {
      lower_agentList({
        pageSize: this.pageSize,
        pageNum: 1
      }).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    // 查询
    search(y) {
      if (y !== false) {
        this.currentPage = 1
      }
      lower_agentList({
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        mchNo: this.list.mchNo !== '' ? this.list.mchNo : undefined,
        mchName: this.list.name !== '' ? this.list.name : undefined,
        startDate: this.list.startDate !== '' ? this.list.startDate : undefined,
        endDate: this.list.endDate !== '' ? this.list.endDate : undefined
      }).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
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
      this.currentPage = 1
      this.list.mchNo = ''
      this.list.name = ''
      this.list.startDate = ''
      this.list.endDate = ''
      this.list.createTimeStr = []
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
