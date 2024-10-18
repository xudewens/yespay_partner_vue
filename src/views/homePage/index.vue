<template>
  <section class="home-page-index">
    <!-- 数据看版-天统计 -->
    <div class="statistics-dashboard">
      <div class="statistics-dashboard-left">
        <el-date-picker
          v-model="dayTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :default-value="getCurrentDate(true)"
          class="date-picker"
          @change="getSummaryDay"
        />
        <el-card class="box-card">
          <div class="statistics-data ">
            <div class="statistics-left">
              <div class="statistics-data-num"><span style="font-size: 18px;">Rp</span> {{dayNum | formatNumber }}</div>
              <div class="statistics-data-desc"><span>代收金额</span></div>
            </div>
            <div class="statistics-right">
              <div class="statistics-data-num">{{dayOrder | formatNumber }}</div>
              <div class="statistics-data-desc"><span>代收订单</span></div>
            </div>
          </div>
        </el-card>
      </div>
      <!--数据看版-月统计 -->
      <div class="statistics-dashboard-right">
        <el-date-picker
          v-model="mouthTime"
          type="month"
          placeholder="选择日期"
          format="yyyy-MM"
          value-format="yyyy-MM"
          :default-value="getCurrentDate(false)"
          class="date-picker"
          @change="getSummaryMouth"
        />
        <el-card class="box-card">
          <div class="statistics-data ">
            <div class="statistics-left">
              <div class="statistics-data-num"><span style="font-size: 18px;">Rp</span> {{monthNum | formatNumber }}</div>
              <div class="statistics-data-desc"><span>代收金额</span></div>
            </div>
            <div class="statistics-right">
              <div class="statistics-data-num">{{monthOrder | formatNumber }}</div>
              <div class="statistics-data-desc"><span>代收订单</span></div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 银行卡 -->
    <div class="card-list">
      <div class="card-list-title">
        银行卡
      </div>
      <el-card class="box-card card-contsiner">
        <div v-for="(item,index) in cardList" :key="index" class="box-card-item">
          <div class="box-card-item-left">
            <img class="card-icon" :src="bankImg(item.bankName.toUpperCase())"></img>
            <div class="card-desc">

              <div class="card-code">
                {{ item.bankCard }}
              </div>
              <div class="card-name">
                {{ item.cardholderName }}
              </div>

            </div>
          </div>
          <span :class="{ 'status-on':item.state,'status-off':!item.state}">
            {{ item.state ? '在用':'未用' }}
          </span>
        </div>
        <el-empty description="无数据" v-if="!cardList.length"></el-empty>
      </el-card>

    </div>
  </section>
</template>

<script>
import { getCardList, dealerSummary} from '@/api/cardMch'
export default {
  data() {
    return {
      dayTime: new Date().toISOString().split('T')[0],
      mouthTime:new Date().toISOString().slice(0, 7),
      cardList: [],
      dayNum:0,
      dayOrder:0,
      monthNum:0,
      monthOrder:0,
    }
  },
  mounted() {
    this.getCardList()
    this.getSummaryDay()
    this.getSummaryMouth()
  },
  methods: {
    getCurrentDate(val) {
      if(val) {
        return new Date().toISOString().split('T')[0]
      }else {
        return new Date().toISOString().slice(0, 7)
      }
    },
    // 按天查询订单
  async getSummaryDay() {
      const res = await dealerSummary({
        type:'DAY',
        date:this.dayTime
      })
      this.dayNum = res.data.orderMoney
      this.dayOrder = res.data.count
    },
    // 按月查询订单
  async getSummaryMouth() {
      const res = await dealerSummary({
        type:'MONTH',
        date:this.mouthTime
      })
      this.monthNum = res.data.orderMoney
      this.monthOrder = res.data.count
    },
    // 获取银行卡列表
   async getCardList() {
      const res = await getCardList({})
      this.cardList = res.data
    },
    // 银行图片展示
    bankImg(bankName) {
        try {
          return require(`@/assets/bankImg/${bankName}.png`)
        } catch (error) {
          return require(`@/assets/404_images/404.png`)
        }
    },
  }
}
</script>

<style lang="scss">
.home-page-index {
  padding: 50px 40px;
  // height: 100vh;
}
.statistics-dashboard {
    display: flex;
    margin-bottom: 30px;
    flex-wrap: wrap;
    justify-content: space-between;
}
.statistics-dashboard-left,.statistics-dashboard-right{
    width: 45%;
    height: 300px;
    margin-right: 100px;
}
.statistics-dashboard-right {
  margin-right: 0;
}
.date-picker{
    margin-bottom: 25px;
}
.statistics-data-left{
    height: 50px;
}
.statistics-data {
    display: flex;
    align-items: center;
}
.statistics-left,.statistics-right{
    flex: 0.5;
    text-align: center;
}
.statistics-left{
    border-right: 1px solid #d7d7d7;
}
.statistics-data-num{
    font-size: 22px;
    font-weight: 700;
  padding-bottom: 20px;
  }
.statistics-data-desc{
    padding: 12px 0px;
    background-color: #f2f2f2;
}
.box-card{
    border-radius: 8px !important;
}
.card-list-title{
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
}
.box-card-item{
    border-bottom: 1px solid #d7d7d7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0px;
}
.card-icon{
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-right: 5px;
}
.box-card-item-left{
    display: flex;
    align-items: center;
}
.card-desc{
  font-size: 18px;
}
.card-name{
  font-size: 18px;
}
.card-code{
    margin-bottom: 3px;
    font-weight: bold;
}
.status-on{
color: #557822;
line-height: 40px;
}
.status-off{
  color: #c72a29;
  line-height: 40px;

}

</style>
<style lang="scss">
@media (max-width: 800px) {
  .home-page-index{
    padding: 0;
    background-color: #f5f5f5;
  }
  .statistics-dashboard-left, .statistics-dashboard-right{
    width: 100%;
    height: 380px;
     margin-right: 0px;
     padding: 20px 22px;
     background-color: #fff;
     margin-bottom: 28px;
  }
  .statistics-data {
    height: 225px;
  }
  .el-card{
    border: 1px dashed #767777 !important;
  }
  .statistics-left, .statistics-right{
    height:70%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

  }
  .statistics-left{
    border-right: 1px dashed #767777;

  }
  .statistics-data-desc{
    width: 80%;
    margin: auto;
    border-radius: 10px;
    background-color: #7915f5;
    color: #fff;
    height: 70px;
    display: flex;
    align-items: center;
    span{
      width: 100%;
    }
    font-size: 22px;
    font-weight: 500;
  }
  .statistics-data-num{
    color: #ff0000;
    font-size: 32px;
  }
  .card-list{
    background-color: #fff;
    padding: 20px 22px;
    font-size: 16px;
  }
  .statistics-dashboard{
    margin-bottom: 0px;
  }
  .card-contsiner{
    width: 100%;
}
.card-icon{
width: 80px;
height: 80px;
background-color: #7915f5;
margin-right: 15px;
}
.card-desc{
  font-size:16px ;
  margin: auto;
}

}
</style>
