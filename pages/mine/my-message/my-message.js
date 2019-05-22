const App = getApp()
import { getResourceList, setResourceState } from '../../../request/teamPort'
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
   * switch event
   * @param e
   */
  captureFix(e) {
    this.captureIndex = e.currentTarget.dataset.index
    this.captureID = this.data.courseList[this.captureIndex].ResourceID
  },
  controlFixEvent(e) {
    let valTemp = 0
    let msgTemp = '取消资源'
    const max = this.getCourseFixLen()


    if(e.detail.value && max >= this.data.courseMax) {
      $wuToast().show({
        type: 'text',
        duration: 1000,
        color: '#fff',
        text: `最多只能设置${this.data.courseMax}个资源`
      })
      return false
    }
    if(e.detail.value) {
      valTemp = 1
      msgTemp = '加入资源'
    }
    const intState = `courseList[${this.captureIndex}].intState`

    this.setResourceState(this.captureID, valTemp).then(res => {
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
  /**
   * 获取课程选择数据的长度
   */
  getCourseFixLen() {
    let i = 0
    this.data.courseList.map(item => {
      if(item.intState === 1) {
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
    getResourceList({
      teamID: this.optionsId
    }).then(res => {
      this.setData({
        courseList: res.data.courseList
      })
    })
  },

  setResourceState(resourceID, state) {
    return setResourceState({
      resourceID: resourceID,
      state: state
    }).then(res => {
      return res
    })
  }
})
