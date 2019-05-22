const App = getApp()
import {getTeamProfile, removeTeamMember} from '../../../request/teamPort'
const { $wuToast } = require('../../../components/wu/index')

Page({
  data: {
    nav: {
      title: '学生管理',
      model: 'extrude',
      transparent: false
    },
    userInfo: App.user.userInfo,
    /**
     * data
     */
    students: {
      pageNumber: 1,
      lastPage: false,
      list: [],
      totalRow: 0
    }
  },
  onLoad: function (options) {
    this.optionsId = options.id
    /**
     * 初始化数据
     */
    this.init()
  },
  onReachBottom: function () {
    this._ReachBottom()
  },
  /**
   * 踢出小组
   * @param e
   */
  kickOut(e) {
    const index = e.currentTarget.dataset.index
    const relIndex = e.currentTarget.dataset.rel
    const userID = this.data.students.list[index].rList[relIndex].UserID
    wx.showModal({
      title: '踢出成员',
      content: '确定踢出该成员?',
      success: res => {
        if (res.confirm) {
          this._removeTeamMember(this.optionsId, userID, index, relIndex)
        }
      }
    })
  },
  _removeTeamMember(teamID, userID, index, relIndex) {
    removeTeamMember({
      teamID: teamID,
      userID: userID
    }).then(res => {
      this.data.students.list[index].rList.splice(relIndex, 1)
      const obj = `students.list[${index}].rList`
      this.setData({
        [obj]: this.data.students.list[index].rList
      })
    })
  },
  /**
   * 请求数据
   * @param e
   */
  init() {
    return getTeamProfile({
      teamID: this.optionsId,
      page: this.data.students.pageNumber
    }).then(res => {
      this.setData({
        'students.list': this.data.students.list.concat(res.data.list),
        'students.totalRow': res.data.totalRow,
        'students.lastPage': res.data.lastPage
      })
    })
  },

  _ReachBottom: function () {
    if (this.data.students.lastPage || this.isLoading) {
      return false
    }
    this.isLoading = true
    this.data.students.pageNumber++
    this.init().then(() => {
      this.isLoading = false
    }).catch(() => {
      this.isLoading = false
      this.data.students.pageNumber--
    })
  }

})
