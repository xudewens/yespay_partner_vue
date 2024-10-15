<template>
  <section class="home-page-index">
    <!-- 数据看版 -->
    <div class="statistics-dashboard">
      <div class="statistics-dashboard-left">
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="选择日期"
          :default-value="getCurrentDate()"
          class="date-picker"
        />
        <el-card class="box-card">
          <div class="statistics-data ">
            <div class="statistics-left">
              <div class="statistics-data-num">Rp 120,021,221</div>
              <div class="statistics-data-desc">代收金额</div>
            </div>
            <div class="statistics-right">
              <div class="statistics-data-num">189</div>
              <div class="statistics-data-desc">代收订单</div>
            </div>
          </div>

        </el-card>
      </div>
      <div class="statistics-dashboard-right">
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="选择日期"
          :default-value="getCurrentDate()"
          class="date-picker"
        />
        <el-card class="box-card">
          <div class="statistics-data ">
            <div class="statistics-left">
              <div class="statistics-data-num">Rp 120,021,221</div>
              <div class="statistics-data-desc">代收金额</div>
            </div>
            <div class="statistics-right">
              <div class="statistics-data-num">189</div>
              <div class="statistics-data-desc">代收订单</div>
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
            <i class="card-icon">{{ item.type }}</i>
            <div class="card-desc">

              <div class="card-code">
                {{ item.cardCode }}
              </div>
              <div>
                {{ item.userName }}
              </div>

            </div>
          </div>
          <span :class="{ 'status-on':item.status,'status-off':item.status===0}">
            {{ item.status?'在用':'未用' }}
          </span>
        </div>

      </el-card>

    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      value1: null,
      cardList: [
        {
          type: '银行类型', // 用于展示icon
          cardCode: '29319247126',
          userName: 'asassadndakdsand',
          status: 1 // 银行卡状态
        }, {
          type: '银行类型', // 用于展示icon
          cardCode: '29319247126',
          userName: 'asassadndakdsand',
          status: 1 // 银行卡状态
        },
        {
          type: '银行类型', // 用于展示icon
          cardCode: '29319247126',
          userName: 'asassadndakdsand',
          status: 0 // 银行卡状态
        }
      ]
    }
  },
  methods: {
    getCurrentDate() {
      const now = new Date()
      return now.toISOString().substr(0, 10)
    }
  }
}
</script>

<style lang="scss">
.home-page-index {
  padding: 50px 40px;
  height: 100vh;
}
.statistics-dashboard {
    display: flex;
    margin-bottom: 60px;
    flex-wrap: wrap;
    // justify-content: space-between;
}
.statistics-dashboard-left,.statistics-dashboard-right{
    width: 440px;
    height: 140px;
    margin-right: 50px;
}
.date-picker{
    margin-bottom: 10px;
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
}
.card-desc{
font-size: 14px;
}
.card-contsiner{
    width: 400px;
}
.card-code{
    margin-bottom: 3px;
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
