const app = getApp()

Page({
  data: {},
  getInfo(e) {
    if (!e.detail.iv) {
      wx.showModal({
        title: '提示',
        content: '请先允许授权用户信息',
        showCancel: false,
        success: function() {
          wx.redirectTo({
            url: '../forceLogin/forceLogin',
          });
        }
      })
      return false
    }
    wx.login({
      success: function(res) {
        wx.showLoading({
          title: 'Loading'
        })
        let that = this,
          url = app.baseUrl + '/interface/Login/mini_userInfo',
          data = {}
        data = {
          // 'openid': app.globalData.openId,
          'code': res.code
        }
        var code = res.code
        wx.getUserInfo({
          success: res => {
            // console.log('mmmmmmmmmmmmmm',res)
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo
            wx.request({
              url: url,
              data: {
                code: code,
                iv: iv,
                encryptedData: encryptedData
              },
              success: resOp => {
                console.log('授权页面', resOp)
                if (resOp.data.code == 1) {
                  app.globalData.openId = resOp.data.data.openid
                  let system = wx.getStorageSync('system').substr(0, 3)
                  if (system == 'iOS') {
                    // 绑定手机
                    if (resOp.data.data.bind != 1) {
                      console.log('nnnnnnnnnnnnnnnnnnnnnnn')
                      wx.navigateTo({
                        url: '/pages/bindPhone/bindPhone?openId=' + resOp.data.data.openid,
                      })
                      return false
                    }
                  }
                  // 绑定上级
                  let upId = app.data.upId
                  if (upId) {
                    let url = `https://meilihua.06baobao.com/interface/Reading/bind_lower_level`, data = {}
                    data = {
                      'openid': resOp.data.openId.openid,
                      'id': upId
                    }
                    console.log('app.globalData.openId', app.globalData.openId)
                    app.wxRequest(url, data, (res) => {
                      console.log('绑定下级请求成功,授权页面的', res)
                      app.data.upId = ''
                    })
                  }
                  if (app.openIdReadyCallback) {
                    console.log('执行了')
                    app.openIdReadyCallback(app.globalData.openId)
                  }
                  wx.navigateBack()
                }
                wx.setStorage({
                  key: 'openID',
                  data: resOp.data.data.openid,
                  success: () => {
                    wx.navigateBack()
                  }
                })
                return false
              }
            })
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
          },
          fail: function(err) {
            console.log('请求失败.')
            setTimeout(function() {
              that.getInfo()
            }, 5000)
          }
        })
      }
    })
  },
  onLoad: function(options) {
    var arr = getCurrentPages()
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})