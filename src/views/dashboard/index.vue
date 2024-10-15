<template>
  <div class="dashboard-container">
    <el-dialog
      :visible.sync="dialogVisible"
      width="100%"
      :fullscreen="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="container">
        <div v-for="(item, i) in areaData" :key="i" class="card">
          <div style="margin: 20px 0;">
            <p>{{ item.countryName }}</p>
            <p>{{ item.businessType }}_Defend</p>
          </div>
          <div style="height: 1px;border-top: 1px solid #d7d7d7;" />
          <el-button v-if="item.authorize" type="primary" style="margin: 20px 0;" @click="relogin(item.country)">登录</el-button>
          <p v-else style="margin-top: 32px;">未授权</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { user_getCountryUrl } from '@/api/essential'
export default {
  name: 'Dashboard',
  data() {
    return {
      dialogVisible: true,
      areaData: [],
      areaOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.areaData = []
    this.areaOptions = []
    user_getCountryUrl({}).then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        this.areaData.push({
          country: res.data[i].country,
          countryName: res.data[i].countryName,
          businessType: res.data[i].businessType.toUpperCase() === 'FINEPAY' ? 'JayaPay' : res.data[i].businessType,
          url: res.data[i].url,
          authorize: res.data[i].authorize
        })
        this.areaOptions.push({
          country: res.data[i].country,
          area: res.data[i].businessType.toUpperCase() === 'FINEPAY' ? 'JAYAPAY' + '_' + res.data[i].country : res.data[i].businessType.toUpperCase() + '_' + res.data[i].country,
          url: res.data[i].url
        })
      }
    })
  },
  methods: {
    // 选择地区登录
    relogin(val) {
      try {
        const loading = this.$loading({
          lock: true,
          text: '正在登录',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.areaOptions.forEach((item) => {
          if (val === item.country) {
            sessionStorage.setItem(process.env.VUE_APP_PARAM + '_AREA', item.area)
            sessionStorage.setItem(process.env.VUE_APP_PARAM + '_REQUESTURL', item.url)
            this.$router.replace('/controlMark/' + val)
            setTimeout(() => {
              this.$router.go(0)
              setTimeout(() => {
                loading.close()
              }, 500)
            }, 1000)
            throw new Error('Stop')
          }
        })
      } catch (error) {
        if (Error.message === 'Stop') {
          return
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 10px 20px;
}
.card {
  width: 300px;
  min-width: 200px;
  border: 2px solid #d7d7d7;
  border-radius: 10px;
  box-shadow: #d7d7d7 0px 0px 10px;
  text-align: center;

  p {
    font-weight: 600;
    color: #000;
  }
}
</style>

<style>
.dashboard-container {
  min-height: calc(100vh - 84px);
  background: #ffffff;
}
.dashboard-container .el-dialog__body {
  display: flex;
  height: 90%;
  text-align: center;
  align-items: center;
}
</style>
