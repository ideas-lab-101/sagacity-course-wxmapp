const App = getApp()
import { getTeamList, getTeamInfo } from '../../../request/teamPort'

Page({
  data: {
    deviceStatusBarHeight: App.globalData.equipment.deviceStatusBarHeight,
    swiperHeight: 0,
    /**
     * 存储的数据参数
     */
    teamList: [],

    one: {
      teamInfo: '',
      liveList: []
    },
    two: {
      teamInfo: '',
      liveList: []
    },
    three: {
      teamInfo: '',
      liveList: []
    },

    /**
     * 选定的小组
     */
    teamCurrent: 0,   // swiper 改变的时候 当前的下标
    teamCurrentID: null,  // 当前加载的teamID  并一定指当前选中的TEAM  的ID
  },
  onLoad: function (options) {
    /**
     * id 为初始化传进的teamID
     */
    this.optionsId = options.id

    if(!App.user.ckLogin()) {
      wx.navigateTo({
        url: '/pages/common/accredit/accredit'
      })
    }else {
      this.getTeamListData()
      this.pageLoad = true
    }
  },
  onShow: function () {
    if(App.user.ckLogin() && !this.pageLoad) {
      this.getTeamListData()
    }
  },
  onReady: function () {
    try {
      var res = wx.getSystemInfoSync()
      var screenHeight = res.windowHeight
    } catch (e) {}
    var query = wx.createSelectorQuery()
    query.select('#indexTitle').boundingClientRect()
    query.exec((ret) => {
      let h = 0
      ret.forEach((item) => {
        h += item.height
      })
      this.setData({
        swiperHeight: `${screenHeight - h}px`
      })
    })
  },
  onHide() {
    this.pageLoad = false
  },
  onUnload() {
    this.pageLoad = false
  },
  /**
   * 触发事件
   * @param e
   */
  teamSwiperChangeEvent: function (e) {
    let index = e.detail.current
    if (e.detail.source === "touch") {
      if (e.detail.current === 0 && this.data.teamCurrent > 1) {
        index = this.data.teamCurrent
      }
    }

    let loadIndex = null
    if (index > this.data.teamCurrent && index + 1 <= this.data.teamList.length-1) {
      loadIndex = index+1
    }
    if(index < this.data.teamCurrent && index-1 >=0 ) {
      loadIndex = index-1
    }
    if(loadIndex === null) {
      this.setData({ teamCurrent: index })
      return false
    }

    this.data.teamCurrentID = this.data.teamList[loadIndex].TeamID

    this._getTeamInfo(this.data.teamCurrentID, loadIndex).then(() => {
      this.setData({ teamCurrent: index })
    })
  },
  /**
   * 获取team数据列表
   */
  getTeamListData() {
    getTeamList().then(res => {
      /**
       *  加载当前加入进入页面  的小组 数据下标
       */
      let index = 0
      if(!this.optionsId) {
        index = this.data.teamCurrent
      }else {
        index = this._filterTeamCurrent(res.data.list, this.optionsId)
      }
      if(index === -1) {
        index = 0
      }
      if(res.data.list.length > 0) {
        /**
         *  加载当前页的数据
         */
        this._getTeamInfo(res.data.list[index].team_id, index)
        /**
         *  加载下一条数据
         */
        if(index+1 < res.data.list.length) {
          this._getTeamInfo(res.data.list[index+1].team_id, index+1)
        }
        /**
         *  加载上一条数据
         */
        if(index-1 >= 0) {
          this._getTeamInfo(res.data.list[index-1].team_id, index-1)
        }
        /**
         *  初始化下标  和 当前的加载的teamId
         */
        this.data.teamCurrent = index
        this.data.teamCurrentID = res.data.list[index].team_id
      }
      this.setData({
        teamCurrent: this.data.teamCurrent,
        teamList: res.data.list
      })
    })
  },

  _filterTeamCurrent: function (teamList, id) {
    if(id === null || id === 'undefined' || teamList.length<=0) {
      return -1
    }
    return teamList.findIndex(item => {
      return Number(item.TeamID) === Number(id)
    })
  },

  _getTeamInfo: function (teamId, index) {
    return getTeamInfo({teamId: teamId}).then((res) => {
      if(index%3 === 0) {
        setTimeout(() => {
          this.setData({
            'one.liveList': res.data.liveList,
            'one.teamInfo': res.data.teamInfo
          })
        }, 10)
      }else if(index%3 === 1) {
        setTimeout(() => {
          this.setData({
            'two.liveList': res.data.liveList,
            'two.teamInfo': res.data.teamInfo
          })
        }, 10)
      }else if(index%3 === 2) {
        setTimeout(() => {
          this.setData({
            'three.liveList': res.data.liveList,
            'three.teamInfo': res.data.teamInfo
          })
        }, 10)
      }else {
        return null
      }
      return res
    })
  },
  /**
   * 链接
   * @param e
   */
  goResourceManage(e) {
    const id = this.data.teamList[this.data.teamCurrent].team_id
    wx.navigateTo({
      url: `/pages/apply/resource-manage/resource-manage?id=${id}`
    })
  },

  goTeamSet(e) {
    const id = this.data.teamList[this.data.teamCurrent].team_id
    wx.navigateTo({
      url: `/pages/apply/team-set/team-set?id=${id}`
    })
  },

  goStudentsManage(e) {
    const id = this.data.teamList[this.data.teamCurrent].team_id
    wx.navigateTo({
      url: `/pages/apply/students-manage/students-manage?id=${id}`
    })
  },

  goTaskManage(e) {
    const id = this.data.teamList[this.data.teamCurrent].team_id
    wx.navigateTo({
      url: `/pages/apply/task-manage/task-manage?id=${id}`
    })
  },

  goIssueTask(e) {
    const id = this.data.teamList[this.data.teamCurrent].team_id
    wx.navigateTo({
      url: `/pages/apply/issue-task/issue-task?id=${id}`
    })
  }
})
