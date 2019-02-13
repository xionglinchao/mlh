// pages/order/order.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部", "待付款", "待发货", "待收货", "待评价"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    datapro: [],
    isShowToast: true,
    toastData: '',
    isShadow: true,
    hidden: true,
    reasonPro: [{ 'id': 1, 'name': '我不想买了', 'isFalse': true }, { 'id': 2, 'name': '信息填写错误，重新拍', 'isFalse': false }, { 'id': 3, 'name': '卖家缺货', 'isFalse': false }, { 'id': 4, 'name': '其他原因', 'isFalse': false }],
    orderId: '',
    isLoading: false,
    isViewDisabled: true,
    distinguish: 1,
    orderNum: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      orderNum: options.order
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: res.windowWidth - (that.data.tabs.length - options.order) * res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * options.order,
          activeIndex: options.order
        });
      }
    });

    
    that.getOrderData(options.order);

    if (options.order == 0) {
      wx.setNavigationBarTitle({
        title: '全部',
      })
    } else if (options.order == 1) {
      wx.setNavigationBarTitle({
        title: '待付款',
      })
    } else if (options.order == 2) {
      wx.setNavigationBarTitle({
        title: '待发货',
      })
    } else if (options.order == 3) {
      wx.setNavigationBarTitle({
        title: '待收货',
      })
    } else if (options.order == 4) {
      wx.setNavigationBarTitle({
        title: '待评价',
      })
    }
  },
  onShow: function () {
    var that = this;

    var activeIndex = that.data.activeIndex;
    
    that.getOrderData(activeIndex);

    that.setData({
      isViewDisabled: true
    })
  },
  tabClick: function (e) {
    var that = this;

    that.getOrderData(e.currentTarget.id);
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      isLoading: false
    });
  },
  btn_send: function (e) {
    console.log(e);
    let distinguish = e.currentTarget.dataset.item.distinguish
    this.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../orderInformation/orderInformation?info=' + e.currentTarget.dataset.item.orderId + '&typeNum=2&distinguish=' + distinguish,
    })
  },
  getOrderData: function (id) {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getOrder,
      data: {
        openid: app.globalData.openId,
        type: id,
      },
      success: function (res) {
        console.log(res);

        if (res.data.code == 1) {
          console.log(res.data.data[0].shop);

          if (res.data.data.length > 0){
            that.setData({
              datapro: res.data.data,
              isLoading: true,
              distinguish: res.data.data.distinguish,
              orderNum: -1
            })
          }else{
            that.setData({
              datapro: [],
              isLoading: true,
              orderNum: -1
            })
          }
          
        } else {
          that.setData({
            datapro: [],
            isLoading: true,
            orderNum: -1
          })
        }
      }
    })
  },
  btn_go_pay: function (e) {
    console.log(e);
    var that = this;

    if (e.currentTarget.dataset.item.distinguish == 1) {
      wx.request({
        url: app.globalData.urlApi.orderPay,
        data: {
          orderId: e.currentTarget.dataset.item.orderId
        },
        success: function (res) {
          console.log(res);

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

                  if (e.currentTarget.dataset.item.delegation == 1) {
                    var com_id = '';

                    for (var i in e.currentTarget.dataset.item.shop) {
                      com_id = e.currentTarget.dataset.item.shop[i].id
                    }
                    wx.navigateTo({
                      url: "../openInformation/openInformation?orderId=" + res.data.data + "&id=" + com_id
                    })
                  } else {
                    wx.navigateTo({
                      url: "../orderInformation/orderInformation?info=" + res.data.data + '&typeNum=1&distinguish=' + e.currentTarget.dataset.item.distinguish,
                    })
                  }

                }, 2000)
              },
              'fail': function (result) {
                console.log(result)

                that.setData({
                  isShowToast: false,
                  toastData: '支付失败',
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
      that.ReadyTwoPay(e);
    }


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
        console.log(res);

        if (res.data.code == 1) {
          that.getOrderData(activeIndex);
        }

        that.setData({
          isShowToast: false,
          toastData: res.data.msg,
          isShadow: true,
          hidden: true,
          isLoading: true
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,

          })

        }, 2000)

      }
    })

  },
  btn_cancel: function (e) {
    var that = this;

    that.setData({
      orderId: e.currentTarget.dataset.item.orderId,
      isShadow: false,
      hidden: false,
      distinguish: e.currentTarget.dataset.item.distinguish
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
    var logistics = e.currentTarget.dataset.item.logistics;
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

    that.setData({
      isLoading: false
    })
    wx.request({
      url: app.globalData.urlApi.confirmReceipt,
      data: {
        orderId: e.currentTarget.dataset.item.orderId,
        distinguish: e.currentTarget.dataset.item.distinguish
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
  btn_p_j: function (e) {//评价
    var that = this;
    var item = e.currentTarget.dataset.item;
    that.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../commment/commment?typeNum=' + 1 + '&item=' + JSON.stringify(item),
    })
  },
  ReadyTwoPay: function (e) {//接力读二次支付
    var that = this;
    console.log(e);
    wx.request({
      url: app.globalData.urlApi.ReadyTwoPay,
      data: {
        orderId: e.currentTarget.dataset.item.orderId
      },
      success: function (res) {
        console.log(res);

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
                wx.navigateTo({
                  url: "../orderInformation/orderInformation?info=" + res.data.data + "&typeNum=1&distinguish=" + e.currentTarget.dataset.item.distinguish
                })
              }, 2000)
            },
            'fail': function (result) {
              console.log(result)

              that.setData({
                isShowToast: false,
                toastData: '支付失败',
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