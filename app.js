const User = require('/utils/user')
const request = require('/utils/request')
const util = require('./utils/util')
const RequestLoadManager = require('./utils/requestLoadManager')

App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.equipment.systemSeries = util.formatSystem(res.system)
        this.globalData.equipment.deviceHeight = res.windowHeight
        this.globalData.equipment.deviceWidth = res.windowWidth
        this.globalData.equipment.deviceStatusBarHeight = res.statusBarHeight
      }
    })
    /**
     * 初始化验证失效
     */
    this.user.checkToken()
  },
  globalData: {
    equipment: {                // 移动设备基本信息
      systemSeries: null,
      deviceHeight: 0,
      deviceWidth: 0,
      deviceStatusBarHeight: 0
    }
  },

  version: '1.0.0',
  request: request, // 数据请求封装
  user: new User(), // 登录验证
  requestLoadManager: new RequestLoadManager(), // 请求更新管理器
})
