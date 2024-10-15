<template>
  <!-- 基础信息 -->
  <div>
    <div class="main">
      <!-- 基础信息 -->
      <p class="title">基础信息</p>
      <div class="move">
        <!-- 卡ID： -->
        <div class="station">
          <p>通道ID：</p>
          <div class="management_input">{{ channelID }}</div>
        </div>
        <!-- 通道名称： -->
        <div class="station">
          <p><i style="color:red">*</i>通道名称：</p>
          <el-input
            v-model.trim="dataInfo.channelName"
            autocomplete="off"
            :maxlength="20"
            :disabled="channelID"
            placeholder="请输入通道名称"
            class="management_input"
            @input="dataInfo.channelName=dataInfo.channelName.replace(/[^A-Za-z0-9_]/g, '')"
          />
        </div>
        <!-- 通道类型： -->
        <div class="station">
          <p><i style="color:red">*</i>通道类型：</p>
          <el-select
            v-model="dataInfo.type"
            :placeholder="'请选择通道类型'"
            clearable
            :disabled="channelID"
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
        <!-- 指定商户 -->
        <div class="station" v-if="dataInfo.type == 'DESIGNATED_MERCHANT'">
          <p><i style="color:red">*</i>指定商户：</p>
          <el-select
            v-model="dataInfo.designatedMchId"
            :placeholder="'请选择指定商户'"
            clearable
            class="merchant_input"
          >
          <el-option
            v-for="item in mechantOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        </div>
      <!-- 状态： -->
      <div class="station" style="position:relative">
        <p><i style="color:red">*</i>状态：：</p>
        <el-radio-group v-model="dataInfo.state" @change="changestate">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </div>
      </div>
       <p class="title">备注</p>
        <div style="padding: 10px;">
          <el-input
            v-model.trim="dataInfo.remark"
            type="textarea"
            :maxlength="200"
            :rows="3"
            onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
            @blur="dataInfo.remark = $event.target.value"
          />
        </div>
    </div>
    <!-- 按钮 -->
    <div class="head">
      <el-button style="margin-right: 30px;" @click="reback()">取消</el-button>
      <el-button  type="primary" @click="nextClick()">{{'完成' }}</el-button>
    </div>
  </div>
</template>

<script>
import {get_channelType} from '@/api/channel'
import { arrayOfObject } from '@/filters'
import { mchInfo_table } from '@/api/merchant'
export default {
  name: 'basicInformation',
  props: {
    mchData: { // 编辑回显的数据
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      channelID:'',
      dataInfo:{
        state:'1',
        type:'',
        designatedMchId:'',
        remark:'',
        channelName:'',
      },
      availableItems: [
        { id: 1, label: '选项1', checked: true },
        { id: 2, label: '选项2', checked: true },
        { id: 3, label: '选项3', checked: true },
        { id: 4, label: '选项4', checked: true }
      ],
      available:[],
      selectedItems: [],
      channelTypeOption:[],
      mechantOption:[],//选择商户列表
    }
  },
  computed: {

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
  created () {
    this.channelID = this.$route.query.id
    this.dataInfo.channelName = this.$route.query.channelName
    if(this.$route.query.id) {
     this.dataInfo.state = this.$route.query.state == 'true' ? '1' : '0'
     console.log(this.dataInfo.state,'======this.dataInfo.state===')
     
     console.log(this.$route.query.state,'======this.$route.query.state===')
    }
    this.dataInfo.remark = this.$route.query.remark
    this.dataInfo.type = this.$route.query.type
    this.dataInfo.designatedMchId = this.$route.query.designatedMchId

  },
  mounted() {
    this.getChannelType()
    this.getMchInfo()
  },
  methods: {
    // 切换状态
    changestate(val){
      console.log(val)
      val == '1' ? this.dataInfo.state = '0' : this.dataInfo.state = '1'
      if(val == '0'){
        this.$confirm('是否要禁用通道，禁用后商户将无法交易', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dataInfo.state = '0'
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
        }else {
          this.dataInfo.state = '1'
        }
    },
    // 切换商户
    changeMerchant(){
      this.selectedItems = []
      this.availableItems.forEach(item => {
        if(this.available.includes(item.label)) {
          this.selectedItems.push(item)
        }
      });
    },
    // 删除已选商户
    delMerchant(value){
      console.log(value)
      this.selectedItems = this.selectedItems.filter(item => value.label !== item.label);
      this.available = this.available.filter(item => value.label !== item);
    },
    async getChannelType(){
      const res = await get_channelType()
      this.channelTypeOption = arrayOfObject(res.data)
    },
    //  读取全部列表
    getMchInfo() {
      mchInfo_table({
            size: 9999,
            current: 1
          }).then(res => {
            console.log(res.data)
            res.data.records.forEach(item => {
              this.mechantOption.push({
                label:item.mchName,
                value:item.id
              })
            })  
        }).catch(error => {
          console.log(error);
        });
      },
    // 下一步
    nextClick() {
        if (this.dataInfo.channelName !== '' && this.dataInfo.channelName < 2) {
          return  this.$message.warning('请填写正确的通道名称，长度为2-20个字符')
        }else if(!this.dataInfo.type) {
          return this.$message.warning('请选择通道类型')
        }else if(this.dataInfo.type === 'DESIGNATED_MERCHANT' && !this.dataInfo.designatedMchId) {
          return this.$message.warning('请选择指定商户')
        }
        this.$confirm('是否要保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.$emit('nextClick', this.dataInfo)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
    
      },
    // 取消操作
    reback(){
      this.$confirm('是否取消所有保存', '提示', {
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
    },
}
</script>

<style scoped lang='scss'>
.main {
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
  width:  350px;
}
.station > p {
  text-align: right;
  width: 200px !important;
  font-size: 12px;
  margin: 0;
}
.management_input {
  width: 300px !important;
}
.moves {
  margin-bottom: 30px;
}
.Merchant {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .title {
      font-size: 14px;
      font-weight: bold;
      border: 1px solid #d7d7d7;
      padding: 10px;
    }
    .content {
      padding: 20px;
    }
  .left {
    width: 40%;
    min-height: 300px;
    border: 1px solid #d7d7d7;
  }
  .right {
    width: 60%;
    min-height: 300px;
    border: 1px solid #d7d7d7;
  }
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
</style>
