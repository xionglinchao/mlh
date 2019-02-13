var app = getApp()
Page({
  data: {
    sw: 0,
    id: '',
    dataPro: {},
    imageHead: '',
    isComment: 0,
    isShowToast: true,
    toastData: '',
    first_bar: 0,
    end_bar: 0,
    imageFX: '',
    isShadow: true,
    isImageFx: true,
    typeNum: 1,
    isLoading: false,
    info: 1,
    isViewDisabled: true
  },
  onLoad: function (options) {
    var that = this
    console.log(options.id)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sw: res.windowWidth,
          id: options.id,
          typeNum: options.typeNum
        })
      },
    })
    if (options.info) {
      that.setData({
        info: 0
      })
    }
    if (app.globalData.openId) {
      that.getRelayInformation(options.id)
      that.getIsUserInfoComment(options.id)
    } else {
      app.openIdReadyCallback = res => {
        that.getRelayInformation(options.id)
        that.getIsUserInfoComment(options.id)
      }
    }
  },
  onShow: function () {
    var that = this
    if (app.globalData.openId) {
      if (that.data.id != '') {
        that.getRelayInformation(that.data.id)
        that.getIsUserInfoComment(that.data.id)
        that.get_is_login(that)
      }
      that.setData({
        isViewDisabled: true
      })
    } else {
      app.openIdReadyCallback = res => {
        if (that.data.id != '') {
          that.getRelayInformation(that.data.id)
          that.getIsUserInfoComment(that.data.id)
          that.get_is_login(that)
        }
        that.setData({
          isViewDisabled: true
        })
      }
    }
  },
  getRelayInformation: function (id) {
    var that = this
    if (that.data.info == 0) {
      var requestId = {
        orderId: id,
        openid: app.globalData.openId
      }
    } else {
      var requestId = {
        id: id,
        openid: app.globalData.openId
      }
    }
    wx.request({
      url: app.globalData.urlApi.getMyRelayRead,
      data: requestId,
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            dataPro: res.data.data.contact,
            imageHead: res.data.data.photo,
            first_bar: parseInt(res.data.data.contact.first_bar),
            end_bar: parseInt(res.data.data.contact.end_bar),
            isLoading: true
          })
        }
      }
    })
  },
  btn_p_l: function () {
    var that = this
    if (that.data.isComment == 1) {
      that.setData({
        isShowToast: false,
        toastData: '只能评论一次',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })

      }, 2000)
    } else {
      var parameterStrng = '?typeNum=5&id=' + that.data.id
      app.navigateWx(that, '../../commment/commment', parameterStrng)
    }
  },
  getIsUserInfoComment: function (id) {
    var that = this
    wx.request({
      url: app.globalData.urlApi.isUserInfoComment,
      data: {
        openid: app.globalData.openId,
        com_id: id,
        type: 1
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            isComment: 1
          })
        } else {
          that.setData({
            isComment: 0
          })
        }
      }
    })
  },
  btn_f_x: function () {
    var that = this
    var id = that.data.id
    var dataPro = that.data.dataPro
    that.setData({
      isLoading: false
    })
    wx.request({
      url: app.globalData.urlApi.getQrCode,
      data: {
        id: id
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            imageFX: res.data.data,
            isShadow: false,
            isImageFx: false,
            isLoading: true
          })
        } else {
          that.setData({
            isLoading: true
          })
        }
      }
    })
  },
  btn_shadow: function () {
    var that = this
    that.setData({
      isShadow: true,
      isImageFx: true
    })
  },
  get_is_login: function (that) {
    if (app.globalData.openId) {
      wx.request({
        url: app.globalData.urlApi.getExist,
        data: {
          openid: app.globalData.openId
        },
        success: function (res) {
          if (res.data.code == 1) {
          } else {
            wx.navigateTo({
              url: '../forceLogin/forceLogin',
            })
          }

        }
      })
    } else {
      app.openIdReadyCallback = res => {
        wx.request({
          url: app.globalData.urlApi.getExist,
          data: {
            openid: res
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 1) {

            } else {
              wx.navigateTo({
                url: '../forceLogin/forceLogin',
              })
            }

          }
        })
      }
    }
  },
  btn_pay: function () {
    var that = this
    var id = that.data.id
    console.log(1111111)
    wx.request({
      url: app.globalData.urlApi.getReadyInformationPay,
      data: {
        openid: app.globalData.openId,
        id: id,
        cash: that.data.dataPro.cash
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          var item = res.data.msg.config
          wx.requestPayment({
            'timeStamp': item.timestamp,
            'nonceStr': item.nonceStr,
            'package': item.package,
            'signType': item.signType,
            'paySign': item.paySign,
            'success': function (result) {

              that.setData({
                isShowToast: false,
                toastData: '支付成功',
              })

              setTimeout(function () {
                that.setData({
                  isShowToast: true,
                  isLoading1: true
                })

                wx.redirectTo({
                  url: "../myRelayReadInformation/myRelayReadInformation?typeNum=1&id=" + res.data.data
                })

              }, 2000)
            },
            'fail': function (result) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 2000,
              })

              that.setData({
                isLoading1: true
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  },
  btn_j_z: function () {
    var parameterStrng = '?id=' + this.data.id
    app.navigateWx(this, '../../giveBook/giveBook', parameterStrng)
  },
  btn_relay_end: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否结束当前接力读？',
      success: function (res) {
        if (res.confirm) {
          var id = that.data.id
          wx.navigateTo({
            url: '/pages/relayRead/last-relay/last-relay?com_id=' + id
          })

          // var requestData = {
          //   id: id,
          //   openid: app.globalData.openId,
          // }
          // app.requestPost(that, app.globalData.urlApi.relayRefund, requestData, function (res) {
          //   if (res.data.code == 1) {
          //     console.log(res)
          //     that.getRelayInformation(id)
          //     wx.showModal({
          //       title: '结束接力读',
          //       content: '您已停止该接力读，请将书籍寄往' + res.data.data,
          //       showCancel: false
          //     })
          //   }
          // })
        }
      }
    })
  }
})