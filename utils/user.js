const { $wuLoading } = require('../components/wu/index')
const { host } = require('../sever.config')

class user {
    constructor() {
        try {
            let authToken = wx.getStorageSync('authToken')
            if (authToken) {
                this.authToken = authToken
            } else {
                throw false
            }
        } catch (e) {
            this.authToken = false
        }
        try {
            let userInfo = wx.getStorageSync('userInfo')
            if (userInfo) {
                this.userInfo = userInfo
            } else {
                throw false
            }
        } catch (e) {
            this.userInfo = null
        }
    }

    /**
     * 是否登录过
     *
     * @returns boolean
     * @memberof User
     */
    ckLogin() {
      try {
        let AuthToken = wx.getStorageSync('authToken')
        let UserInfo = wx.getStorageSync('userInfo')
        if (AuthToken && UserInfo) {
          return AuthToken
        } else {
          throw false
        }
      } catch (e) {
        return false
      }
    }
    /**
     * * 已经登录的情况下，判断sessionKey是否失效  如果失效就重新登录
     **/
    checkToken() {
      return new Promise( (resolve, reject) => {
        wx.request({
          url: `${host}wxmanager/system/v2/checkUser`,
          header: { 'content-type': 'application/json'},
          data: { token: this.authToken},
          method: 'GET',
          success: res => {
            console.log(res.data)
            if (res.errMsg === 'request:ok' && Number(res.data.code) === 6) {
              this.goLogin()
            }
            resolve(res.data)
          },
          fail: ret => {
            reject(ret)
          },
          complete: function () {}
        })
      })
    }

  /**
   * 失效跳转
   */
    goLogin() {
      return new Promise( (resolve, reject) => {
        this.clear()
        wx.navigateTo({
          url: '/pages/common/accredit/accredit'
        })
      })
    }
    /**
     * 清除所有的storage
     *
     * @returns boolean
     * @memberof User
     */
    clear() {
      try {
        wx.removeStorageSync('userInfo')
        wx.removeStorageSync('authToken')
      } catch (e) {}
    }
    /**
     * 检测用户是否登录，未登录进行登录操作
     */
    isLogin(userInfo, cb) {
        try {
            let AuthToken = wx.getStorageSync('authToken')
            if (AuthToken) {
                typeof cb === "function" && cb(AuthToken)
            } else {
                throw false
            }
        } catch (e) {
            this.getUser(userInfo, res => {
                typeof cb === "function" && cb(res)
            })
        }
    }
    /**
   * 检测用户是否登录，未登录进行登录操作
   */
    getUser(fo, cb) {
      let that = this
      this._getWxUserInfo(function(code) {
        that._goLogin(code, fo, function (authToken, userInfo) {
          typeof cb === "function" && cb(authToken, userInfo)
        })
      })
    }
    /**
     * 用户登录
     *
     * @param {any} username
     * @param {any} password
     * @memberof User
     */
    _goLogin(username, password) {
        wx.showNavigationBarLoading()
        $wuLoading().show({
            title: '获取登录信息'
        })
      const promise = new Promise( (resolve, reject) => {
        wx.request({
            url: `${host}wxmanager/system/v2/login`,
            header: { 'content-type': 'application/x-www-form-urlencoded'},
            data: {
              username: username,
              password: password
            },
            method: 'POST',
            success: res => {
              console.log(res.data)
              if (res.errMsg === 'request:ok' && Number(res.data.code) === 1) {
                this.authToken = res.data.data.token
                this.userInfo = res.data.data.userInfo
                wx.setStorageSync('authToken', res.data.data.token)
                wx.setStorageSync('userInfo', res.data.data.userInfo)
                resolve(res.data)
              } else {
                wx.showModal({content: res.data.msg, showCancel: false})
              }
            },
            fail: ret => {
              reject(ret)
            },
            complete: function () {
                wx.hideNavigationBarLoading()
                $wuLoading().hide()
            }
        })
      })
      return promise
    }

  /**
   * 退出登录
   * @returns {Promise<any>}
   * @private
   */
    _logout() {
      return new Promise( (resolve, reject) => {
        wx.request({
          url: `${host}wxmanager/system/v2/logout`,
          header: { 'content-type': 'application/x-www-form-urlencoded'},
          data: {
            token: this.authToken
          },
          method: 'POST',
          success: res => {
            console.log(res.data)
            this.goLogin()
          },
          fail: ret => {
            reject(ret)
          },
          complete: function () {
          }
        })
      })
    }
    /**
     * 获取微信用户信息
     *
     * @param {any} cb (userInfo, code)
     * @memberof User
     */
    _getWxUserInfo(cb) {
        wx.login({
            success: res => {
                typeof cb === "function" && cb(res.code)
            }
        })
    }
}
module.exports = user
