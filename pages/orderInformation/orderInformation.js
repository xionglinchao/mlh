// pages/orderInformation/orderInformation.js
var app = getApp();
Page({
  data: {
    orderPro: {},
    money: 0,
    reasonPro: [{ 'id': 1, 'name': '我不想买了', 'isFalse': true }, { 'id': 2, 'name': '信息填写错误，重新拍', 'isFalse': false }, { 'id': 3, 'name': '卖家缺货', 'isFalse': false }, { 'id': 4, 'name': '其他原因', 'isFalse': false }],
    isShowToast: true,
    toastData: '',
    isShadow: true,
    hidden: true,
    orderId: '',
    hidden1: true,
    isLoading: false,
    yhmoney: 0,
    isViewDisabled: true,
    distinguish: 1
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      orderId: options.info,
      distinguish: options.distinguish
    })
    that.getOrderData(options.info, options.distinguish);
  },
  onShow: function () {
    this.setData({
      isViewDisabled: true
    })
  },
  getOrderData: function (orderId, distinguish) {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getOrderInformation,
      data: {
        orderId: orderId,
        distinguish: that.data.distinguish
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          var money = that.data.money;
          var yhmoney = that.data.yhmoney;
          for (var i in res.data.data.shops) {
            if (parseInt(res.data.data.orders.integral) > 0) {
              money += res.data.data.shops[i].moneys * 100;
              yhmoney += res.data.data.shops[i].money * 100 - res.data.data.shops[i].moneys * 100;
            } else {
              money += res.data.data.shops[i].money * 100;
            }
          }
          that.setData({
            orderPro: res.data.data,
            money: money,
            isLoading: true,
            yhmoney: yhmoney
          })
        } else {
          that.setData({
            isLoading: true
          })
        }
      }
    })
  },
  btn_two_pay: function () {
    var that = this;
    that.setData({
      isLoading: false
    })
    if (that.data.distinguish == 1) {
      wx.request({
        url: app.globalData.urlApi.orderPay,
        data: {
          orderId: that.data.orderPro.orders.orderId
        },
        success: function (res) {
          if (res.data.code == 1) {
            var item = res.data.msg.config;
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
                  })
                  that.getOrderData(res.data.data);
                }, 2000)
              },
              'fail': function (result) {
                console.log(result)
                that.setData({
                  isShowToast: false,
                  toastData: '支付失败',
                  isLoading: true
                })
                setTimeout(function () {
                  that.setData({
                    isShowToast: true,
                  })
                }, 2000)
              }
            })
          }
        }
      })
    } else {
      that.ReadyTwoPay();
    }
  },
  btn_open: function () {
    var that = this;
    var orderPro = that.data.orderPro;
    that.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../openInformation/openInformation?id=' + orderPro.orders.s_id + '&orderId=' + orderPro.orders.orderId + '&typeNum=2',
    })
  },
  btn_cancle_x_z: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var reasonPro = that.data.reasonPro;
    for (var i = 0; i < reasonPro.length; i++) {
      if (id == reasonPro[i].id) {
        reasonPro[i].isFalse = true;
      } else {
        reasonPro[i].isFalse = false;
      }
    }
    that.setData({
      reasonPro: reasonPro
    })
  },
  cancel: function () {
    var that = this;
    that.setData({
      isShadow: true,
      hidden: true,
    })
  },
  confirm: function () {
    var that = this;
    var orderId = that.data.orderId;
    var reasonPro = that.data.reasonPro;
    var info = '';
    var activeIndex = that.data.activeIndex;
    var distinguish = that.data.distinguish;
    for (var i = 0; i < reasonPro.length; i++) {
      if (reasonPro[i].isFalse) {
        info = reasonPro[i].name
      }
    }
    that.setData({
      isLoading: false
    })
    wx.request({
      url: app.globalData.urlApi.cancelOrder,
      data: {
        orderId: orderId,
        type: 1,
        reason: info,
        distinguish: distinguish
      },
      success: function (res) {
        that.setData({
          isShowToast: false,
          toastData: res.data.msg,
          isShadow: true,
          hidden: true,
        })
        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })
          if (res.data.code == 1) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            that.setData({
              isLoading: true
            })
          }
        }, 2000)
      }
    })
  },
  btn_cancel: function (e) {
    var that = this;
    that.setData({
      isShadow: false,
      hidden: false,
    })
  },
  btn_shadow: function () {
    var that = this;
    that.setData({
      isShadow: true,
      hidden: true,
    })
  },
  btn_w_l: function (e) {
    var that = this;
    console.log(e);
    var orderPro = that.data.orderPro;
    var logistics = orderPro.orders.logistics;
    that.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../logistics/logistics?logistics=' + logistics,
    })
  },
  btn_confirm_receipt: function (e) {
    var that = this;
    var activeIndex = that.data.activeIndex;
    var orderId = that.data.orderId;
    that.setData({
      isLoading: false
    })
    wx.request({
      url: app.globalData.urlApi.confirmReceipt,
      data: {
        orderId: orderId
      },
      success: function (res) {
        that.setData({
          isShowToast: false,
          toastData: res.data.msg,
        })
        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })
          if (res.data.code == 1) {
            that.getOrderData(activeIndex);
          } else {
            that.setData({
              isLoading: true
            })
          }
        }, 2000)
      }
    })
  },
  btn_p_j: function (e) {
    var that = this;
    var orderPro = that.data.orderPro;
    that.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../commment/commment?typeNum=' + 2 + '&item=' + JSON.stringify(orderPro),
    })
  },
  btn_delete: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该订单，删除之后您将无法找到此订单',
      success: function (res) {
        if (res.confirm) {
          that.confirm1();
        }
      }
    })
  },
  confirm1: function () {
    var that = this;
    var orderId = that.data.orderId;
    var activeIndex = that.data.activeIndex;
    var distinguish = that.data.distinguish;
    that.setData({
      isLoading: false
    })
    wx.request({
      url: app.globalData.urlApi.cancelOrder,
      data: {
        orderId: orderId,
        type: 1,
        reason: '',
        distinguish: distinguish
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          that.setData({
            isLoading: true
          })
        }
        that.setData({
          isShowToast: false,
          toastData: res.data.msg,
          isShadow: true,
          hidden: true,
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })
        }, 2000)
      }
    })
  },
  ReadyTwoPay: function (e) {//接力读二次支付
    var that = this;
    console.log(e);
    wx.request({
      url: app.globalData.urlApi.ReadyTwoPay,
      data: {
        orderId: that.data.orderPro.orders.orderId
      },
      success: function (res) {
        if (res.data.code == 1) {
          var item = res.data.msg.config;
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
                isLoading: true
              })
              setTimeout(function () {
                that.setData({
                  isShowToast: true,
                })
                that.getOrderData(res.data.data);
              }, 2000)
            },
            'fail': function (result) {
              console.log(result)
              that.setData({
                isShowToast: false,
                toastData: '支付失败',
                isLoading: true
              })
              setTimeout(function () {
                that.setData({
                  isShowToast: true,
                })
              }, 2000)
            }
          })
        }
      }
    })
  }
})