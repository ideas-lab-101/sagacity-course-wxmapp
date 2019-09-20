import baseBehavior from '../../components/wu/helpers/baseBehavior'
import mergeOptionsToData from '../../components/wu/helpers/mergeOptionsToData'
import {  getCourseList, GetLessonList } from '../../request/coursePort'
const { $wuToast } = require('../../components/wu/index')
const App = getApp()

const defaults = {
    deviceStatusBarHeight: App.globalData.equipment.deviceStatusBarHeight,
    courseList: [],
    courseCurrent: 0,
    lesson: {
        pageNumber: 1,
        lastPage: false,
        list: [],
        totalRow: 0
    },
    /**
     * 数据存储
     */
    storeData: [
        /*{
            DataID: 69,
            DataName: "上李邕 -  天才起步时",
            DataType: "audio"
        }*/
    ]
}

Component({
    behaviors: [baseBehavior],
    externalClasses: ['wux-class'],
    data: mergeOptionsToData(defaults),
    lifetimes: {
        created() {
        },
        attached() {
        },
        detached() {
        }
    },
    methods: {
        submit() {
            const { storeData } = this.data
            this.$$setData({ courseIn: false })
            this.triggerEvent('hideDisperse', {storeData})
        },
        /**
         * 隐藏
         */
        hide() {
            this.$$setData({ courseIn: false })
            this.triggerEvent('hideDisperse', {})
        },
        /**
         * 显示
         */
        show(opts = {}) {
            return new Promise( (resolve, reject) => {
                const options = this.$$mergeOptionsAndBindMethods(Object.assign({}, defaults, opts))
                this.$$setData({ ...options })
                /**
                 * 获取课程的列表
                 */
                this.getCourseList(opts.teamID).then(() => {
                    this.$$setData({ courseIn: true })
                    /**
                     * 计算高度
                     */
                    this.calculateScrollHeight()
                    resolve()
                }).catch(() => {
                    reject()
                })
            })
        },
        calculateScrollHeight() {
            try {
                var res = wx.getSystemInfoSync()
                var screenHeight = res.windowHeight
            } catch (e) {}
            const query = wx.createSelectorQuery().in(this)
            query.select('#courseNav').fields({ size: true})
            query.select('#courseList').fields({ size: true})
            query.exec(ret => {
                let h = 0
                ret.forEach((item) => {
                    h += item.height
                })
                this.setData({ scrollHeight: `${screenHeight - h}px`})
            })
        },
        /**
         * tab 切换
         * @param e
         */
        courseTabChange(e) {
            const index = e.currentTarget.dataset.index
            this.setData({
                courseCurrent: index,
                'lesson.pageNumber': 1,
                'lesson.lastPage': false,
                'lesson.list': [],
                'lesson.totalRow': 0
            })
            /**
             * 加载章节
             */
            this.getLessonList()
        },
        /**
         * 章节选择
         * @param e
         */
        lessonChange(e) {
            const item = e.currentTarget.dataset.item
            const { storeData } = this.data

            if(this.indexStore(item.DataID) === -1) {
                if(storeData.length >= 3) {
                    $wuToast().show({
                        type: 'text',
                        duration: 1000,
                        color: '#fff',
                        text: `最多只能设置3个章节`
                    })
                    return false
                }
                storeData.push(item)
            }else {
                this.removeArrayItem(item.DataID)
            }
            this.setData({
                storeData
            })
        },
        indexStore(DataID) {
            return this.data.storeData.findIndex(item => {
                return item.DataID === DataID
            })
        },
        removeArrayItem(DataID) {
            const index = this.indexStore(DataID)
            this.data.storeData.splice(index, 1)
        },
        /**
         * 请求课本列表
         */
        getCourseList(teamID) {
            return getCourseList({
                teamID: teamID,
                state: 1
            }).then(res => {
                this.setData({
                    courseList: res.data.list
                })
                /**
                 * 加载章节
                 */
                this.getLessonList()
            })
        },

        getLessonList() { //courseID page orderType(ASC|DESC)
            return GetLessonList({
                courseID: this.data.courseList[this.data.courseCurrent].CourseID,
                page: this.data.lesson.pageNumber,
                orderType: 'ASC'
            }).then(res => {
                this.setData({
                    'lesson.list': this.data.lesson.list.concat(res.data.list),
                    'lesson.lastPage': res.data.lastPage,
                    'lesson.totalRow': res.data.totalRow
                })
            })
        },
        /**
         * 滚动加载更多
         * @param e
         * @returns {boolean}
         */
        profileTolower(e) {
            if (this.data.lesson.lastPage || this.isLoading) {
                return false
            }
            this.isLoading = true
            this.data.lesson.pageNumber++
            this.getLessonList().then(() => {   // 档案数据翻页
                this.isLoading = false
            }).catch(() => {
                this.isLoading = false
                this.data.lesson.pageNumber--
            })
        },
    }
})
