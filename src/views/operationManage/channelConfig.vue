<template>
  <!-- 通道列表 -->
  <div class="dashbody">
    <div class="move moveList">
      <div class="merchant">
        <el-input
          v-model.trim="list.channelName"
          placeholder="通道名称"
          class="merchant_input"
          @blur="list.channelName = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-select
          v-model="list.state"
          :placeholder="'状态'"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-select
            v-model="list.type"
            :placeholder="'请选择通道类型'"
            clearable
            class="merchant_input"
          >
          <el-option
            v-for="item in channelTypeOption"
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
        <el-button
          type="primary"
          style="margin-left:20px"
          @click="addChannel"
        >新增通道</el-button>
      </div>
      <el-table
        :data="tableData"
        max-height="600"
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
          <template  slot-scope="scope">
            <el-table
              :data="scope.row.orderTimeLines"
              border
              class="twoTable"
              @cell-click="copyText"
            >
              <el-table-column
                prop="cardId"
                min-width="130"
                label="银行卡Id"
                align="left"
                show-overflow-tooltip
              />
              <el-table-column
                prop="bankCard"
                label="银行卡号"
                min-width="130"
                align="left"
                show-overflow-tooltip
              />
              <el-table-column
                prop="bankName"
                min-width="60"
                label="银行名称"
                align="left"
                show-overflow-tooltip
              />
              <!-- <el-table-column
                prop="cardState"
                min-width="100"
                label="银行卡状态"
                align="left"
                show-overflow-tooltip
              >
              <template slot-scope="scopesss">
                <span v-if="scopesss.row.cardState == 1">正常</span>
                <span v-if="scopesss.row.cardState == 0" style="color: red;">停用</span>
                <span v-if="scopesss.row.cardState == 2" style="color: #931fff;">废弃</span>
              </template>
            </el-table-column> -->
              <el-table-column
                prop="bizType"
                min-width="70"
                label="业务类型"
                align="left"
                show-overflow-tooltip
              >
              <template slot-scope="scopesss">
                <span v-if="scopesss.row.bizType == 'PAYMENT'">代收卡</span>
              </template>
            </el-table-column>
              <el-table-column
                prop="cardholderName"
                min-width="180"
                label="持卡人姓名"
                align="left"
                show-overflow-tooltip
              />
              <el-table-column
                prop="weights"
                min-width="60"
                label="权重"
                align="left"
                show-overflow-tooltip
              />
              <el-table-column
                min-width=""
                label="收银台显示状态"
                align="left"
                show-overflow-tooltip
              >
              <template slot-scope="scopenell">
                <el-switch
                  v-model="scopenell.row.cardState"
                  :active-value=1
                  :inactive-value=0
                  @change="changeState(scopenell.row)"
                />
          </template>
            </el-table-column>
            <el-table-column
                min-width="70"
                label="流水查询状态"
                align="left"
                show-overflow-tooltip
              >
              <template slot-scope="scopenell">
                <el-switch v-model="scopenell.row.syncStatus" @change="changeSyncStatus(scopenell.row)"></el-switch>
              </template>
            </el-table-column>
            </el-table>
          </template>

        </el-table-column>
        <!--通道ID -->
        <el-table-column
          prop="id"
          :label="'通道ID'"
          width="200"
          align="left"
          show-overflow-tooltip
        />
        <!-- 通道名称 -->
        <el-table-column
          prop="channelName"
          :label="'通道名称'"
          min-width="180"
          align="left"
          show-overflow-tooltip
        />
        <!-- 通道编号 -->
        <el-table-column
          prop="orderNum"
          :label="'通道编号'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 使用商户 -->
        <!-- <el-table-column
          prop="mchNo"
          :label="'使用商户'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        /> -->
        <!-- 策略数量 -->
        <el-table-column
          prop=""
          :label="'策略数量'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 收款卡数量 -->
        <!-- <el-table-column
          prop="bankCard"
          :label="'收款卡数量'"
          min-width="160"
          align="left"
        /> -->
        <!-- 出款卡数量 -->
        <!-- <el-table-column
          prop="orderMoney"
          :label="'出款卡数量'"
          min-width="160"
          align="left"
        /> -->
         <!-- 归集卡数量 -->
         <el-table-column
          prop="type"
          :label="'通道类型'"
          min-width="160"
          align="left"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'COMMON'">公共</span>
          <span v-if="scope.row.type === 'DESIGNATED_MERCHANT'">指定商户</span>
        </template>
      </el-table-column>
         <!-- 状态 -->
         <el-table-column
          prop="state"
          :label="'状态'"
          min-width="160"
          align="left"
          fixed="right"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.state">启用</span>
          <span v-if="!scope.row.state" style="color: red;">禁用</span>
        </template>
      </el-table-column>
        <!-- 创建时间 -->
        <!-- <el-table-column
          prop="matchRule"
          :label="'创建时间'"
          min-width="160"
          align="left"
        /> -->
        <!-- 操作 -->
        <el-table-column
          :label="'操作'"
          min-width="200"
          fixed="right"
          align="left"
        >
          <template slot-scope="scope">
            <el-button
              name="111"
              size="mini"
              type="primary"
              @click="editChannnel(scope.row)"
            >
            编辑通道
            </el-button>
            <el-button
               name="111"
               size="mini"
               type="danger"
               @click="disabledItem(scope.row)"
               v-if="scope.row.state"
             >
               禁用
             </el-button>
             <el-button
               name="111"
               size="mini"
               type="success"
               v-if="!scope.row.state"
               @click="opemItem(scope.row)"
             >
               启用
             </el-button>
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
      <el-dialog :title="editOrderType?'补单':'退单'" :visible.sync="dialogTableVisible" width="88%">
        <el-table 
        :data="multipleSelection"
        max-height="450"
        class="merchant_table"
        border
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
        @cell-click="copyText">
          <el-table-column property="platOrderNum" label="平台订单号" width="200"></el-table-column>
          <el-table-column property="orderNum" label="商户订单号" width="150"></el-table-column>
          <el-table-column property="channelName" label="收款通道" width="150"></el-table-column>
          <el-table-column property="orderMoney" label="订单金额（Rp）" width="150"></el-table-column>
          <el-table-column property="floatMoney" label="浮动金额（Rp）" width="150"></el-table-column>
          <el-table-column property="actuallyMoney" label="应付金额（Rp）" width="150"></el-table-column>
          <el-table-column  label="银行流水ID" width="200">
            <template slot-scope="scope">
                <el-input v-model="scope.row.flowId"></el-input>
            </template>
          </el-table-column>
          <el-table-column  label="实收金额（Rp）">
            <template slot-scope="scope">
                <el-input v-model="scope.row.platOrderNum"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="SubmitSupOrder">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {orderStatus,matchingRule,batchNotifyMerchant } from '@/api/transaction'
import { bankEnum ,listByChannelId,updateCardDataSync,update_card} from '@/api/card'
import { allChannel,get_channelType,updateChannel,channel_page} from '@/api/channel'
import { arrayOfObject } from '@/filters'
export default {
  name: 'channelConfig',
  data() {
    return {
      current: 1,
      size: 80,
      total: 0,
      tableData: [],
      multipleSelection:[],
      list: {
        channelName: '', // 通道名称
        status: '', // 订单状态
        type:'',
      },
      statusOption:[{
        label:'启用',
        value:true
      },{
        label:'禁用',
        value:false
      },],
      editOrderType:0,
      dialogTableVisible:false,
      lastClickedRow: null, // 二级展开只调用一次接口
      expands:[],//节点操作日志数据
      createTimeStr:'',
      orderTimeLines:[],
      channelTypeOption:[],
    }
  },
  mounted() {
    this.getTableData()
    this.orderStatus()
    this.bankCardState()
    this.getChannelType()
    this.matchingRule()
  },
  methods: {
    //  日期
    dateChange(val) {
      this.list.startDate = val ? val[0] : ''
      this.list.endDate = val ? val[1] : ''
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
    async getChannelType(){
      const res = await get_channelType()
      this.channelTypeOption = arrayOfObject(res.data)
    },
    //  读取全部列表
    getTableData() {
      this.expands = []
      this.lastClickedRow = null
      channel_page({
        size: this.size,
        current: 1
      })
      .then(res => {
        this.tableData = res.data.records
        this.tableData.forEach(item => {
          this.$set(item, 'orderTimeLines', []);
        })
        this.total = +res.data.total
      }).catch(error => {
        console.log(error);
      });
    },
    // 查询
    search(y) {
      if (y !== false) {
        this.current = 1
      }
      this.expands = []
      this.lastClickedRow = null
      channel_page({
          size: this.size,
          current: this.current,
          channelName: this.list.channelName !== '' ? this.list.channelName : undefined,
          state: this.list.state !== '' ? this.list.state : undefined,
          type: this.list.type !== '' ? this.list.type : undefined,
      })
      .then(res => {
        this.tableData = res.data.records
        this.tableData.forEach(item => {
          this.$set(item, 'orderTimeLines', []);
        })
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
      this.current = 1
      this.list.state = ''
      this.list.channelName = ''
      this.list.type = ''
      this.getTableData()
    },
    // 详情
    addChannel() {
      this.$router.push({
        path: '/operationManage/addChannel'
      })
    },
    editChannnel(row){
      this.$router.push({
        path: '/operationManage/addChannelEdit',
        query:{
          id:row.id,//通道id
          channelName:row.channelName,
          state:row.state,
          remark:row.remark,
          type:row.type,
          designatedMchId:row.designatedMchId,
        }
      })
    },
    // 表格多选选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },
    async orderStatus(){
      const res = await orderStatus()
      this.orderStatusOption = arrayOfObject(res.data)
    },
    async bankCardState(){
      const res = await bankEnum()
      this.bankCardStateOption = arrayOfObject(res.data)
    },
    async matchingRule(){
      const res = await matchingRule()
      this.matchingRuleOption = arrayOfObject(res.data)
    },
    // 补单退单操作 0/补单  1/退单
    SupOrder(type){
      if(this.multipleSelection.length < 1)
      return this.$message.warning('请先选择订单')
      this.editOrderType = type
      this.dialogTableVisible = true
    },
    // 补单确定
    SubmitSupOrder(){},
    // 补发通知
    noticeReissue(row){
      this.$confirm('是否补发通知?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await batchNotifyMerchant({
              platOrderNumList:[row.platOrderNum]
            })
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
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
        this.timeLines(row)
      }
    },
    // 时间轴
    timeLines(row) {
      console.log(row,'===row===')
      listByChannelId(row.id).then((res) => {
        console.log(res.data,'listByChannelIdlistByChannelId')
        const showList = []
        this.tableData.forEach(item => {
          if(row.id === item.id)
            res.data.forEach(item => {
              if(item.channelCardStatus) {
                showList.push(item)
              }
            })
            this.$set(item, 'orderTimeLines', showList);
            console.log(item.orderTimeLines,'======')
          })
      })
    },
    //禁用
    disabledItem(item){
      this.$confirm('是否要禁用卡?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await updateChannel({
          id:item.id,
          state: false,
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
        const res = await updateChannel({
          id:item.id,
          state: true,
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
    // 更新银行卡 流水同步状态
    async changeSyncStatus(item){
      console.log(item.syncStatus)
        const res = await updateCardDataSync({
          id:item.cardId, 
          syncStatus:item.syncStatus
        })
        if(res.code === '021-000-S-999') {
          this.$message.success('操作成功')
        }else {
          this.$message.error('操作失败')
        }
        // this.search(true)
      },
    // 修改状态
   async changeState(item){
        const res = await update_card({
          id:item.cardId,
          state: item.cardState,
          bizType:item.bizType,
        })
        if(res.code == '021-000-S-999') {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
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
