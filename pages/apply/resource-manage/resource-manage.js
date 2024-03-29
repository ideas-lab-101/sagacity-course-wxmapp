const App = getApp()
import { getResourceList, setResourceState } from '../../../request/teamPort'
import { getCourseList } from '../../../request/coursePort'
const { $wuToast } = require('../../../components/wu/index')

Page({
  data: {
    nav: {
      title: '资源管理',
      model: 'extrude',
      transparent: false
    },
    /**
     * data
     */
    courseList: [],
    courseMax: 3
  },
  onLoad: function (options) {
    this.optionsId = options.id
    /**
     * 初始化数据
     */
    this.init()
  },
  /**
   * 链接
   * @param e
   */
  goTaskList(e) {
    const id = e.currentTarget.dataset.id
    const name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/apply/resource-task/resource-task?id=${id}&teamid=${this.optionsId}&name=${encodeURIComponent(name)}`
    })
  },
  /**
   * switch event
   * @param e
   */
  captureFix(e) {
    this.captureIndex = e.currentTarget.dataset.index
    this.captureId = this.data.courseList[this.captureIndex].resource_id
  },
  controlFixEvent(e) {
    let valTemp = 0
    let msgTemp = '取消资源启用'
    const max = this.getCourseFixLen()


    if(e.detail.value && max >= this.data.courseMax) {
      $wuToast().show({
        type: 'text',
        duration: 1000,
        color: '#fff',
        text: `最多只能设置${this.data.courseMax}个资源启用`
      })
      return false
    }
    if(e.detail.value) {
      valTemp = 1
      msgTemp = '资源已启用'
    }
    const state = `courseList[${this.captureIndex}].state`

    this.setResourceState(this.captureId, valTemp).then(res => {
      this.setData({
        [state]: valTemp
      })
      $wuToast().show({
        type: 'text',
        duration: 1000,
        color: '#fff',
        text: msgTemp
      })
    })
  },
  /**
   * 获取课程选择数据的长度
   */
  getCourseFixLen() {
    let i = 0
    this.data.courseList.map(item => {
      if(item.state === 1) {
        i++
      }
    })
    return i
  },

  /**
   * 请求数据
   * @param e
   */
  init() {
    getCourseList({
      teamId: this.optionsId,
      state: ''
    }).then(res => {
      this.setData({
        courseList: res.data.list
      })
    })
  },

  setResourceState(resourceId, state) {
    return setResourceState({
      resourceId: resourceId,
      state: state
    }).then(res => {
      return res
    })
  }
})
