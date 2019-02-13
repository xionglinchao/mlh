var stat = require('utils/mdk_stat.js')

//app.js
let url = require('utils/url.js')
let skip = require('utils/skip.js')
let network = require('utils/network.js')
App({
  onLaunch: function () {
    let that = this
    // 展示本地存储能力
    that.globalData.urlApi = url.urlApi
    // 获取使用平台系统
    wx.getSystemInfo({
      success: function (res) {
        that.systemInfo = res
        console.log('平台系统', res.system)
        let system = res.system
        wx.setStorageSync('system', system)
      },
    })
    //登录态过期
    wx.login({
      success: res => {
        // console.log(res)
        var code = res.code;
        wx.getUserInfo({
          success: res => {
            // console.log(res)
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            var system = wx.getStorageSync('system')
            // 可以将 res 发送给后台解码出 unionId
            that.globalData.userInfo = res.userInfo
            wx.request({
              url: url.urlApi.getOpenId,
              data: {
                code: code,
                iv: iv,
                encryptedData: encryptedData,
                system: system
              },
              success: resOp => {
                // console.log('llllllllllllllll',resOp)
                if (resOp.data.code == 1) {
                  that.globalData.openId = resOp.data.data.openid
                  console.log('使用手机的系统', system)
                  // 判断手机系统
                  if (system == 'iOS') {
                    // 绑定手机
                    console.log('555555555', resOp.data.data.bind)
                    if (resOp.data.data.bind != 1) {
                      wx.navigateTo({
                        url: '/pages/bindPhone/bindPhone?openId=' + resOp.data.data.openid,
                      })
                    }
                  }
                  // 绑定上级
                  let upId = that.data.upId
                  if(upId) {
                    let url = `https://meilihua.06baobao.com/interface/Reading/bind_lower_level`, data = {}
                    data = {
                      'openid': resOp.data.openId.openid,
                      'id': upId
                    }
                    console.log('app.globalData.openId', that.globalData.openId)
                    that.wxRequest(url, data, (res) => {
                      console.log('绑定下级请求成功', res)
                      that.data.upId = ''
                    })
                  }
                  if (that.openIdReadyCallback) {
                    that.openIdReadyCallback(resOp.data.openId.openid)
                  }
                }
              }
            })
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
          },
          fail: res => {
            console.log('登入失败', res)
            wx.navigateTo({
              url: '/pages/forceLogin/forceLogin',
            })
          }
        })
      }
    })
    wx.onNetworkStatusChange(function (res) {
      if (res.isConnected) {
        that.globalData.isNetwork = true
      } else {
        that.globalData.isNetwork = false
        wx.showModal({
          title: '提示',
          content: '当前网络状态不佳，请检查您的网络',
          showCancel: false,
          confirmText: '我知道了',
          success: function (res) {}
        })
      }
    })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // console.log(res)
    //           // 可以将 res 发送给后台解码出 unionId
    //           that.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (that.userInfoReadyCallback) {
    //             that.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     } else {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         fail: function () {
    //           // wx.openSetting({
    //           //   success: function () { }
    //           // })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  /**
   * 跳转
   */
  navigateWx: function (that, url, parameterStrng, isJudgeNetWork) {
    skip.navigateWx(that, url, parameterStrng, isJudgeNetWork)
  },
  redirectWx: function (that, url, parameterStrng, isJudgeNetWork) {
    skip.redirectWx(that, url, parameterStrng, isJudgeNetWork)
  },
  switchTabWx: function (that, url, parameterStrng, isJudgeNetWork) {
    skip.switchTabWx(that, url, parameterStrng, isJudgeNetWork)
  },
  reLaunchWx: function (that, url, parameterStrng, isJudgeNetWork) {
    skip.reLaunchWx(that, url, parameterStrng, isJudgeNetWork)
  },

  /**
   * 网络请求
   */
  requestGet: function (that, url, doSuccess, doFail, doComplete) {
    network.requestGet(that, url, doSuccess, doFail, doComplete)
  },
  requestPost: function (that, url, parameter, doSuccess, doFail, doComplete) {
    network.requestPost(that, url, parameter, doSuccess, doFail, doComplete)
  },

  /**
   * ajax请求
   * cb callback
   * url 请求地址
   * params 请求参数
   * compFunc 完成后执行的方法
   */
  wxRequest: function (url, params, cb, compFunc = null) {
    let app = getApp()
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: params,
      success: function (res) {
        typeof cb == 'function' && cb(res)
      },
      fail: function (err) {
        console.log('请求失败.' + err)
        typeof cb == 'function' && cb(err)
      },
      complete: function () {
        typeof compFunc == 'function' && compFunc()
      }
    })
  },
  globalData: {
    canUse: {
      'getRecorderManager': wx.canIUse('getRecorderManager')
    },
    userInfo: null,
    openId: null,
    goodsPro: {},
    goodsNum: 0,
    typeNum: 1,
    shopMoney: 0,
    couponObj: {},
    addressObj: {},
    addressObj1: {},
    loginSend: 0,
    openPro: [],
    square_color: 0,
    isLogin: 0,//判断是否登录 －1 未登录 0 初始状态 1 登录
    isNetwork: true,//判断网络问题
    createBookId: 0,//发帖选择的文库书籍id
    createBookName: null,//发帖选择的文库书籍name
    urlApi: {},//api接口数组
    findIdx: null  // 发现页面下标
  },
  /**
   * 系统信息
   */
  systemInfo: null,//系统信息

  data: {
    upId: ''
  },
  onShow: function (options) {
    let that = this
    that.loadShow(options)
  },
  loadShow: function (options) {
    let phoneNum = wx.getStorageSync('phoneNum')
    let that = this
    if (!that.globalData.openId) {
      setTimeout(function () {
        that.loadShow(options)
      }, 500)
      return false
    }
    // 易盾验证
    // 解决各类回调的兼容问题
    if (!this.captchaValidateExpire) this.captchaValidateExpire = {}

    if (options.scene === 1038 && options.referrerInfo.appId === 'wxb7c8f9ea9ceb4663') {
      const result = options.referrerInfo.extraData;
      if (result.ret === 0) {
        const validate = result.validate
        if (!this.captchaValidateExpire[validate]) {
          this.globalData.captchaResult = result
          this.captchaValidateExpire[validate] = true
        }
        let url = 'https://meilihua.06baobao.com/interface/Login/sendCode', data = {}
        data = {
          'phone': phoneNum,
          'NECaptchaValidate': validate,
          'openid': that.globalData.openId
        }
        console.log('66666666', data)
        that.wxRequest(url, data, (res) => {
          console.log('发送短信验证码', res)
          if (res.data.code != 1) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
            return false
          }
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        })
      } else {
        // 验证失败
      }
    }
  },
  baseUrl: 'https://meilihua.06baobao.com',
  baseImgUrl: 'https://meilihua.06baobao.com/images/small/',
  ossImgUrl: 'https://meilihua.oss-cn-hangzhou.aliyuncs.com/',
  packageImg: 'https://meilihua.oss-cn-hangzhou.aliyuncs.com/program/images/'
})

// SYPBZ-LEW6S-HMHOC-6A7SV-4S6RF-RTBMX 腾讯地图开发key