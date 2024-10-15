<template>
  <!-- 配卡策略 -->
  <div>
    <div class="main">
      <div style="display: flex;justify-content: flex-end;">
          <el-button
            type="primary"
            style="margin-left:20px"
            @click="addChannel"
          >添加策略</el-button>
        </div>
      <div class="dashTable">
        <el-card shadow="never">
          <el-table
            :data="cardList"
            max-height="450"
            class="merchant_table"
            border
            :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
            > 
            <!-- 策略ID -->
            <el-table-column
                prop="hashCode"
                label="操作"
                width="170"
                align="left"
                fixed="left"
                show-overflow-tooltip
              >
              <template slot-scope="scope">
                <el-button
                    name="111"
                    size="mini"
                    type="primary"
                    v-if="!scope.row.editType"
                    @click="changeDisable(scope.row)"
                    :disabled="scope.row.editBtnDisable"
                  >
                  编辑
                  </el-button>
                  <el-button
                    name="111"
                    size="mini"
                    type="primary"
                    v-if="scope.row.editType"
                    @click="submit(scope.row,scope.$index)"
                  >
                  保存
                  </el-button>
                  <el-button
                    name="111"
                    size="mini"
                    type="primary"
                    @click="delCl(scope.$index)"
                    v-if="!scope.row.editType"
                  >
                  删除
                  </el-button>
                  <el-button
                    name="111"
                    size="mini"
                    type="primary"
                    v-if="scope.row.editType"
                    @click="changeDisable(scope.row)"
                  >
                  取消
                  </el-button>
                </template>
            </el-table-column>
            <!-- 策略ID -->
            <el-table-column
                width="120"
                align="left"
              >
              <template #header>
                <span><span style="color: red;">*</span> 类型</span>
              </template>
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.typeId"
                  :placeholder="'类型'"
                  :disabled="!scope.row.editType"
                  >
                  <el-option
                    v-for="item in bankCardBizOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <!-- 卡商 -->
            <el-table-column
                width="180"
                align="left"
              >
              <template #header>
                <span><span style="color: red;">*</span> 卡商</span>
              </template>
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.dealerName"
                  :placeholder="'卡商'"
                  clearable
                  :disabled="!scope.row.editType"
                  @change="changeMch(scope.$index)"
                  >
                  <el-option
                    v-for="item in mchOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <!-- 卡号 -->
            <el-table-column
              width="240"
              align="left"
              >
              <template #header>
                <span><span style="color: red;">*</span> 卡号</span>
              </template>
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.cardId"
                  :placeholder="'卡号'"
                  clearable
                  :disabled="!scope.row.editType"
                  @change="changeCard(scope.$index)"
                  >
                  <el-option
                    v-for="item in scope.row.bankCardOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <!-- 持卡人姓名 -->
            <el-table-column
                prop="cardholderName"
                label="持卡人姓名"
                width="220"
                align="left"
                show-overflow-tooltip
              >
              <!-- <template slot-scope="scope">
                  <el-input v-model="scope.row.weights" 
                   @input="handleInput(scope.row, 'weights')"
                 ></el-input>
              </template> -->
            </el-table-column>
            <!-- 策略ID -->
            <el-table-column
                prop="weights"
                label="权重"
                width="50"
                align="left"
                show-overflow-tooltip
              >
              <!-- <template slot-scope="scope">
                  <el-input v-model="scope.row.weights" 
                   @input="handleInput(scope.row, 'weights')"
                 ></el-input>
              </template> -->
            </el-table-column>
              <!-- 策略ID -->
              <el-table-column
                prop="cardId"
                label="ID"
                width="180"
                align="left"
                show-overflow-tooltip
              />
          </el-table>
        </el-card>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="head">
      <el-button style="margin-right: 30px;" @click="reback()">返回</el-button>
      <!-- <el-button  type="primary" @click="addMchInfos()">完成</el-button> -->
    </div>
  </div>
</template>

<script>
import {bankCardBiz,cardInfo_table,dealerInfo_table} from '@/api/card'
import { arrayOfObject } from '@/filters'
import { getcardInfoChannelId,channelCardUpdate } from '@/api/channel'
export default {
  name: 'limitsAlarms',
  props: {
    type: { // 操作类型：编辑
      type: String,
      default: ''
    },
    mchData: { // 编辑回显的数据
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      channelId:'',
      bankCardOption:[],
      mchOption:[],
      cardList:[
        // {
        //   cardId:'',
        //   channelId:'',
        //   typeId:'PAYMENT',
        //   weights:'',
        //   status:true,
        //   editType:true,
        // }
      ],
      bankCardBizOption:[],
      defaultList:[],
    }
  },
  computed: {

  },
 async mounted() {
  await  this.bankCardBiz()
    // this.getTableDataCard()
  },
  async created () {
    this.channelID = this.$route.query.id
    if(this.channelID) {
      await this.getTableData()
      await this.getcardInfoChannelId()
    }
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
  methods: {
    addMchInfos(){
      this.$confirm('是否要保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.$emit('submitCL', this.cardList)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
    },
    submit(row,index){
      this.$confirm('是否要保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const submitList = []
          let subType = true
          if(!this.defaultList[index]){
            subType = false
          }else {
            subType = true
          }
          if(subType) {
            this.defaultList[index].status = false
              submitList.push(this.defaultList[index])
              submitList.push(row)
            }else {
              submitList.push(row)
            }
          this.submitCL(submitList)
        }).catch((error) => {
          console.log(error)
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
    },
    // 策略信息提交
    async submitCL(value){
      const list = []
      value.forEach(item => {
        if(!value.weights) {
          item.weights = 1
        }
        list.push({
          cardId:item.cardId,
          channelId: this.$route.query.id,
          status:item.status,
          weights:item.weights,
          dealerName:item.dealerName,
          cardholderName:item.cardholderName,
        })
      })
      const res = await channelCardUpdate({
        list,
      })
        console.log(res,'====策略信息=====')
        if(res.code==='021-000-S-999'){
          this.$message.success('操作成功')
          value.editType = !value.editType
          this.getcardInfoChannelId()
        }
      },
    async bankCardBiz(){
      const res = await bankCardBiz()
      this.bankCardBizOption = arrayOfObject(res.data)
      this.bankCardBizOption = this.bankCardBizOption.filter(item => item.value === 'PAYMENT')
    },
    // 添加策略
    addChannel(){
      if(this.cardList.length > 100) {
        return this.$message.warning('最多添加100条策略')
      }else {
        this.cardList.push({
          cardId:'',
          channelId:'',
          typeId:'PAYMENT',
          weights:1,
          status:true,
          editType:true,
          editBtnDisable:false,
          dealerName:'',
          cardholderName:'',
          bankCardOption:[],
        })
      }
    },
    // 删除策略
    delCl(index){
      if(this.cardList.length < 1) {
        return this.$message.warning('至少保留1条策略')
      }else {
          this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          if(this.cardList[index].cardId){
            this.$set(this.cardList[index], 'status', false);
            this.submitCL([this.cardList[index]])
          }else {
            this.cardList.splice(index,1)
          }
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });          
          });
        }
      },
    // 读取卡全部列表
    getTableDataCard(index) {
      cardInfo_table({
        size:9999,
        dealerName:this.cardList[index].dealerName,
        current: 1
      }).then((res) => {
        this.cardList[index].bankCardOption = []
        const cendList = []
        res.data.records.forEach(item => {
          cendList.push({
            label:item.bankCard + `  (${item.bankName})`,
            value:item.id,
            weights:item.weights,
            cardholderName:item.cardholderName,
          })
        });
        this.$set(this.cardList[index], 'bankCardOption', cendList);
      })
    },
    // 读取卡商全部列表
    getTableData() {
      dealerInfo_table({
            size: 9999,
            current: 1
          }).then(res => {
            res.data.records.forEach(item => {
            this.mchOption.push({
              label:item.dealerName,
              value:item.dealerName,
            })
        });
        }).catch(error => {
          console.log(error);
        });
      },
    // 获取回显信息
  async  getcardInfoChannelId(){
      const res = await getcardInfoChannelId(this.channelID)
      console.log(res,'===getcardInfoChannelId====')
      if(res.code === '021-000-S-999') {
        this.cardList = []
        this.defaultList = []
        res.data.forEach((item,index) => {
          console.log(item.cardId,'====item.cardId====')
          if(item.channelCardStatus) {
            this.cardList.push({
              cardId:item.cardId,
              channelId:item.channelId,
              typeId:item.bizType,
              weights:item.weights,
              status:item.channelCardStatus,
              editType:false,
              editBtnDisable:false,
              dealerName:item.dealerName,
              cardholderName:item.cardholderName,
              bankCardOption:[],
            })
            this.defaultList.push({
              cardId:item.cardId,
              channelId:item.channelId,
              typeId:item.bizType,
              weights:item.weights,
              status:item.channelCardStatus,
              editType:false,
              editBtnDisable:false,
              dealerName:item.dealerName,
              cardholderName:item.cardholderName,
            })
          }
        })
        this.cardList.forEach((item,index) => {
          this.getTableDataCard(index)
        })
        console.log(this.cardList,'===cardList==')
      }
    },
    changeDisable(scope){
      scope.editType = !scope.editType
      let hasTrueEditType = this.cardList.some(item => item.editType === true);
      this.cardList.forEach(item => {
          item.editBtnDisable = hasTrueEditType ? true : false;
      });
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
    handleInput(row, prop) {
      row[prop] = row[prop].replace(/\D/g, ''); // 只保留数字
      if (row[prop] < 1 || row[prop] > 99) {
        row[prop] = ''; // 清空输入
      }
    },
    // 更改卡后自动带出对应的权重
    changeCard(index){
      this.cardList[index].bankCardOption.forEach(item => {
        if(item.value === this.cardList[index].cardId) {
          this.$set(this.cardList[index], 'weights', item.weights);
          this.$set(this.cardList[index], 'cardholderName', item.cardholderName);
        }
      })
    },
    changeMch(index){
      if(!this.cardList[index].dealerName){
        this.$set(this.cardList[index], 'bankCardOption', []);
      }else {
        this.getTableDataCard(index)
      }
      this.cardList[index].weights = 1
      this.cardList[index].cardholderName = ''
      this.cardList[index].cardId = ''
    }
  },
}
</script>

<style scoped lang='scss'>
::v-deep .el-checkbox {
  padding-left: 20px;
}
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
  width:  650px;
}
.station > p {
  text-align: right;
  width: 300px !important;
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
.Collection {
  color: #70b603;
}
.Disbursement {
  color: #f59a23;
}
</style>
