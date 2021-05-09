const App = getApp()
import { getTeamRecordGroup } from '../../../request/teamPort'
const { $wuToast } = require('../../../components/wu/index')

Page({
  data: {
    nav: {
      title: '作业列表',
      model: 'extrude',
      transparent: false
    },
    /**
     * data
     */
    task: {
      pageNumber: 1,
      lastPage: false,
      list: [],
      totalRow: 0
    }
  },
  onLoad: function (options) {
    this.optionsId = options.id
    this.optionsTeamId = options.teamid
    this.setData({
      'nav.title': decodeURIComponent(options.name)
    })
    /**
     * 初始化数据
     */
    this.init()
  },
  onReachBottom: function () {
    this._ReachBottom()
  },
  /**
   * 请求数据
   * @param e
   */
  init() {
    return getTeamRecordGroup({
      courseId: this.optionsId,
      teamId: this.optionsTeamId,
      page: this.data.task.pageNumber
    }).then(res => {
      this.setData({
        'task.list': this.data.task.list.concat(res.data.list),
        'task.totalRow': res.data.totalRow,
        'task.lastPage': res.data.lastPage
      })
    })
  },
  _ReachBottom: function () {
    if (this.data.task.lastPage || this.isLoading) {
      return false
    }
    this.isLoading = true
    this.data.task.pageNumber++
    this.init().then(() => {
      this.isLoading = false
    }).catch(() => {
      this.isLoading = false
      this.data.task.pageNumber--
    })
  },
  /**
   * 查看作业详情
   * @param e
   */
  goTaskDetail(e) {
    const index = e.currentTarget.dataset.index
    const id = this.data.task.list[index].data_id
    const name = this.data.task.list[index].data_name
    wx.navigateTo({
      url: `/pages/apply/resource-task-detail/resource-task-detail?id=${id}&teamid=${this.optionsTeamId}&name=${encodeURIComponent(name)}`
    })
  }
})
