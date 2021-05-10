const App = getApp()
const { $wuNavigation, $wuToast } = require('../../../components/wu/index')
const { getInfoList } = require('../../../request/infoPort')

Page({
    data: {
      nav: {
        title: '帮助文档',
        model: 'extrude',
        transparent: false
      },
      documents: []
    },

    onLoad: function () {
      this._getInfoList()
    },

    onShow: function () {
    },

    onPageScroll: function (e) {
      $wuNavigation().scrollTop(e.scrollTop)
    },

    // 自定义事件
    goToGuidesEvent: function (e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/common/documents/documents?id=${id}`
        })
    },

    goContactEvent: function (e) {
        console.log(e)
    },
  /**
   * 获取文档列表
   * @private
   */
    _getInfoList: function () {
      getInfoList({
        channelId: 3
      }).then((res) => {
        this.setData({documents: res.data.list})
      })
    }

})
