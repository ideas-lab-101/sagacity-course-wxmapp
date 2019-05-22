const App = getApp()
import {getTeamTaskList, setTeamTaskState, removeTeamTask} from '../../../request/teamPort'
const { $wuToast } = require('../../../components/wu/index')

Page({
  data: {
    nav: {
      title: '作业管理',
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
    /**
     * 初始化数据
     */
    this.init()
  },
  onReachBottom: function () {
    this._ReachBottom()
  },
  /**
   * 删除task
   * @param e
   */
  delTask(e) {
    const index = e.currentTarget.dataset.index
    const id = this.data.task.list[index].TaskID
    wx.showModal({
      title: '删除提示',
      content: `确定删除作业?`,
      success: res => {
        if (res.confirm) {
          this._removeTeamTask(id, index)
        }
      }
    })
  },
  _removeTeamTask(taskID, index) {
    removeTeamTask({taskID}).then( res => {
      this.data.task.list.splice(index, 1)
      this.setData({
        'task.list': this.data.task.list
      })
    })
  },
  /**
   * 单项开发设置
   * @param e
   * @returns {boolean}
   */
  captureFix(e) {
    this.captureIndex = e.currentTarget.dataset.index
    this.captureID = this.data.task.list[this.captureIndex].TaskID
  },
  controlFixEvent(e) {
    let valTemp = 0
    let msgTemp = '关闭当前作业'

    if(e.detail.value) {
      valTemp = 1
      msgTemp = '当前作业已开启'
    }
    const intState = `task.list[${this.captureIndex}].intState`

    this.setTeamTaskState(this.captureID, valTemp).then(res => {
      this.setData({
        [intState]: valTemp
      })
      $wuToast().show({
        type: 'text',
        duration: 1000,
        color: '#fff',
        text: msgTemp
      })
    })
  },
  setTeamTaskState(taskID, state) {
    return setTeamTaskState({
      taskID: taskID,
      state: state
    }).then(res => {
      return res
    })
  },
  /**
   * 请求数据
   * @param e
   */
  init() {
    return getTeamTaskList({
      teamID: this.optionsId,
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
    const id = this.data.task.list[index].TaskID
    const name = this.data.task.list[index].Content
    wx.navigateTo({
      url: `/pages/apply/task-detail/task-detail?id=${id}&teamid=${this.optionsId}&name=${encodeURIComponent(name)}`
    })
  }
})
