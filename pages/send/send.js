const app = getApp();
Page({
  data: {
    isAddress: 0,
    orderRemark: "填写订单备注",
    orderRemarkPre: "",
    hiddenModal: true,
    typeNum: 1,
    defaultAddressPro: {},  // 收货地址
    dataPro: [],
    money: 0,
    Integral: 0,
    isShowToast: true,
    toastData: '',
    couponId: 0,
    couponPro: [],
    couponObj: {},
    integralCheck: false,
    isSend: true,
    isLoading1: true,
    isLoading2: false,
    isLoading3: false,
    integralNum: 0,
    moneys: 0,
    sendPrice: 0,
    u_id: 0, // 推荐人id
    isUseCoupon: false, // 是否选择使用优惠券
  },
  onLoad: function(options) {
    var that = this;
    var u_id = options.dataPro ? JSON.parse(options.dataPro)[0].u_id : 0;
    var bookId = JSON.parse(options.dataPro)[0].id
    that.setData({
      libId: options.libId || '',
      u_id: u_id,
      bookId: bookId || null
    })
    app.requestGet(that, app.globalData.urlApi.getSendPrice, function(res) {
      if (res.data.code == 1) {
        var sendPrice = parseInt(res.data.data * 100)
        if (options.typeNum == 1 || options.typeNum == 4 || options.typeNum == 5) {
          if (JSON.parse(options.dataPro)[0].moneys) {
            var money = JSON.parse(options.dataPro)[0].moneys * 100;
          } else {
            var money = JSON.parse(options.dataPro)[0].contact * 100;
          }
          console.log(money, JSON.parse(options.dataPro), '1111111111111')
          // var money = options.money * 100;
          var isSend = that.data.isSend;
          if (money < 2800) {
            money += sendPrice;
            isSend = false
          }
          that.setData({
            money: money>0 ? money:0,
            isSend: isSend
          })
        } else if (options.typeNum == 2 || options.typeNum == 3 || options.typeNum == 6) {
          console.log('1111', JSON.parse(options.dataPro));
          that.getIntergrl(JSON.parse(options.dataPro), sendPrice)
        }
        that.setData({
          typeNum: options.typeNum,
          dataPro: JSON.parse(options.dataPro),
          sendPrice: sendPrice
        })
        that.getNewCouponData()
      }
    })
  },
  onShow: function() {
    var that = this;
    var money = that.data.money;
    var isSend = that.data.isSend;
    var sendPrice = that.data.sendPrice;
    that.getDelaultAddress();
    // that.getCouponData();
    

    if (app.globalData.couponObj.c_id) {
      if (that.data.couponObj.c_id) {
        money = money - app.globalData.couponObj.value * 100 + that.data.couponObj.value * 100;
      } else {
        money = money - app.globalData.couponObj.value * 100;
      }

      if (isSend) {
        if (money < 2800) {
          money += sendPrice;

          that.setData({
            isSend: false
          })
        }
      }
      that.setData({
        money: money,
        couponObj: app.globalData.couponObj
      })
      app.globalData.couponObj = null;
    }
  },
  // 新优惠券选择
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  // 选择智慧券
  useCoupon(e) {
    console.log(e)
    let couponId = e.currentTarget.dataset.item.id
    let couponValue = e.currentTarget.dataset.item.value
    // if (couponValue) {
    //   var pay_price = parseInt((this.data.money * 100 - couponValue * 100) + 0.5) / 100
    // }
    this.setData({
      'isUseCoupon': true,
      'showModalStatus': false,
      'couponId': couponId,  // 优惠券id
      'couponValue': couponValue,  // 优惠券价值
      // 'pay_price': pay_price > 0 ? pay_price : 0  // 实付价格
    })
  },

  // 取消选择
  cancelBtnClick() {
    this.setData({
      'isUseCoupon': false,
      'showModalStatus': false,
      'couponId': 0
    })
  },


  editRemark: function() {
    this.setData({
      hiddenModal: false,
      orderRemarkPre: this.data.orderRemark
    })
  },
  editRemarkCancel: function() {
    var orderRemarkTemp = this.data.orderRemarkPre;
    this.setData({
      hiddenModal: true,
      orderRemark: orderRemarkTemp
    })
  },
  editRemarkConfirm: function() {
    var orderRemarkTemp = this.data.orderRemark;
    if (orderRemarkTemp == "") orderRemarkTemp = "填写订单备注";
    this.setData({
      hiddenModal: true,
      orderRemark: orderRemarkTemp
    })
  },
  remarkInputChange: function(event) {
    this.setData({
      orderRemark: event.detail.value
    })
  },
  // 立即付款
  btn_send1: function() {
    var that = this;
    var orderRemark = that.data.orderRemark;
    var dataPro = that.data.dataPro;
    var money = that.data.money;
    var defaultAddressPro = that.data.defaultAddressPro;
    var isSend = that.data.isSend;
    var sendPrice = 0;
    var integralNum = that.data.integralNum;
    var integralCheck = that.data.integralCheck;
    var integral = 0;
    if (integralCheck) {
      integral = integralNum;
    }
    if (orderRemark == "填写订单备注") {
      orderRemark = "";
    }
    if (!isSend) {
      sendPrice = that.data.sendPrice;
    }
    if (!defaultAddressPro.id) {
      that.setData({
        isShowToast: false,
        toastData: '没有选择地址',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      that.setData({
        isLoading1: false
      })
      wx.request({
        url: app.globalData.urlApi.getPayRead,
        data: {
          openid: app.globalData.openId,
          a_id: defaultAddressPro.id,  // 地址
          s_id: dataPro[0].id,  // 书本id
          remark: orderRemark,  // 订单备注
          money: money,
          costs: sendPrice
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function(res) {
          if (res.data.code == 1) {
            var item = res.data.msg.config;
            wx.requestPayment({
              'timeStamp': item.timestamp,
              'nonceStr': item.nonceStr,
              'package': item.package,
              'signType': item.signType,
              'paySign': item.paySign,
              'success': function(result) {
                that.setData({
                  isShowToast: false,
                  toastData: '支付成功',
                })
                app.globalData.goodsPro = {};
                app.globalData.goodsNum = 0;
                setTimeout(function() {
                  that.setData({
                    isShowToast: true,
                    isLoading1: true
                  })
                  wx.navigateTo({
                    url: "../relayReadClassify/myRelayReadInformation/myRelayReadInformation?id=" + res.data.data + "&typeNum=1&info=0"
                  })
                }, 2000)
              },
              'fail': function(result) {
                that.setData({
                  isShowToast: false,
                  toastData: '支付失败',
                  isLoading1: true
                })
                setTimeout(function() {
                  that.setData({
                    isShowToast: true,
                  })
                  wx.redirectTo({
                    url: "../orderInformation/orderInformation?info=" + res.data.data + "&typeNum=1&distinguish=0"
                  })
                }, 2000)
              }
            })
          } else {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
              isLoading1: true
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    }
  },
  // 提交订单  type 2,3,6
  sendOrder: function() {
    var that = this;
    if (that.data.u_id) {
      that.sendOrder4()
      console.log(33333)
      return
    }
    console.log(44444)
    var orderRemark = that.data.orderRemark;
    var dataPro = that.data.dataPro;
    var money = that.data.money;
    var defaultAddressPro = that.data.defaultAddressPro;
    var couponId = 0;
    var couponObj = that.data.couponObj;
    var isSend = that.data.isSend;
    var sendPrice = 0;
    var integralNum = that.data.integralNum;
    var integralCheck = that.data.integralCheck;
    var integral = 0;
    // console.log('aaaaaaaaaaa', couponObj)
    if (integralCheck) {
      integral = integralNum;
    }
    if (couponObj.id) {
      couponId = couponObj.id;
    } else {
      couponId = 0;
    }
    if (orderRemark == "填写订单备注") {
      orderRemark = "";
    }
    if (!isSend) {
      sendPrice = that.data.sendPrice;
    }
    if (!defaultAddressPro.id) {
      that.setData({
        isShowToast: false,
        toastData: '没有选择地址',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      that.setData({
        isLoading1: false
      })
      console.log(that.data.couponId,'使用的优惠券id')
      wx.request({
        url: app.globalData.urlApi.getPay,
        data: {
          openid: app.globalData.openId,
          a_id: defaultAddressPro.id,
          s_id: JSON.stringify(dataPro),  // 商品id
          library_id: this.data.libId,
          remark: orderRemark,
          c_id: that.data.couponId,
          integral: integral,
          delegation: 0,
          delegation_id: 0,
          money: that.data.couponId ? ((money - that.data.couponValue * 100 > 0 ? money - that.data.couponValue * 100 : 0)) : money,
          costs: sendPrice
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function(res) {
          console.log(res);
          if (res.data.code == 1) {
            var item = res.data.msg.config;
            wx.requestPayment({
              'timeStamp': item.timestamp,
              'nonceStr': item.nonceStr,
              'package': item.package,
              'signType': item.signType,
              'paySign': item.paySign,
              'success': function(result) {
                that.setData({
                  isShowToast: false,
                  toastData: '支付成功',
                })
                app.globalData.goodsPro = {};
                app.globalData.goodsNum = 0;
                setTimeout(function() {
                  that.setData({
                    isShowToast: true,
                    isLoading1: true
                  })
                  wx.redirectTo({
                    url: "../orderInformation/orderInformation?info=" + res.data.data + "&typeNum=1&distinguish=1"
                  })
                }, 2000)
              },
              'fail': function(result) {
                wx.redirectTo({
                  url: "../orderInformation/orderInformation?info=" + res.data.data + "&typeNum=1&distinguish=1"
                })
              }
            })
          } else if(res.data.code == 2) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1000
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          } else {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
              isLoading1: true
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    }
  },
  // 提交订单
  sendOrder4: function() {
    var that = this;
    var orderRemark = that.data.orderRemark;
    var dataPro = that.data.dataPro;
    var money = that.data.money;
    var defaultAddressPro = that.data.defaultAddressPro;
    var couponId = 0;
    var couponObj = that.data.couponObj;
    var isSend = that.data.isSend;
    var sendPrice = 0;
    var integralNum = that.data.integralNum;
    var integralCheck = that.data.integralCheck;
    var integral = 0;
    if (integralCheck) {
      integral = integralNum;
    }
    if (couponObj.c_id) {
      couponId = couponObj.c_id;
    } else {
      couponId = 0;
    }
    if (orderRemark == "填写订单备注") {
      orderRemark = "";
    }
    if (!isSend) {
      sendPrice = that.data.sendPrice;
    }
    if (!defaultAddressPro.id) {
      that.setData({
        isShowToast: false,
        toastData: '没有选择地址',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      that.setData({
        isLoading1: false
      })
      var url = `${app.baseUrl}/interface/Pay/book`
      wx.request({
        url: url,
        data: {
          openid: app.globalData.openId,
          a_id: defaultAddressPro.id,
          s_id: JSON.stringify(dataPro),
          remark: orderRemark,
          c_id: that.data.couponId,
          integral: integral,
          money: that.data.couponId ? ((money - that.data.couponValue * 100 > 0 ? money - that.data.couponValue * 100 : 0)) : money,
          costs: sendPrice,
          distribute_id: that.data.u_id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function(res) {
          console.log(res);
          if (res.data.code == 1) {
            var item = res.data.msg.config;
            wx.requestPayment({
              'timeStamp': item.timestamp,
              'nonceStr': item.nonceStr,
              'package': item.package,
              'signType': item.signType,
              'paySign': item.paySign,
              'success': function(result) {
                that.setData({
                  isShowToast: false,
                  toastData: '支付成功',
                })
                app.globalData.goodsPro = {};
                app.globalData.goodsNum = 0;
                setTimeout(function() {
                  that.setData({
                    isShowToast: true,
                    isLoading1: true
                  })
                  wx.redirectTo({
                    url: "../orderInformation/orderInformation?info=" + res.data.data + "&typeNum=1&distinguish=1"
                  })
                }, 2000)
              },
              'fail': function(result) {
                wx.redirectTo({
                  url: "../orderInformation/orderInformation?info=" + res.data.data + "&typeNum=1&distinguish=1"
                })
              }
            })
          } else {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
              isLoading1: true
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    }
  },
  getDelaultAddress: function() {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getDefaultAddress,
      data: {
        openid: app.globalData.openId
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            isAddress: 1,
            defaultAddressPro: res.data.data,
            isLoading3: true
          })
        } else {
          that.setData({
            isAddress: -1,
            isLoading3: true
          })
        }
      }
    })
  },
  getIntergrl: function(namePro, sendPrice) {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getUserInfoIntegral,
      data: {
        openid: app.globalData.openId,
      },
      success: function(res) {
        console.log()
        if (res.data.code == 1) {
          that.setData({
            Integral: parseInt(res.data.data.Integral)
          })
          var integralNum = 0;
          var money = 0;
          var moneys = 0;
          for (var i = 0; i < namePro.length; i++) {
            integralNum += parseInt(namePro[i].integral);
            console.log(namePro[i].integral);
            money += namePro[i].money * 100 * namePro[i].num;
            moneys += namePro[i].moneys * 100 * namePro[i].num;
          }
          var isSend = that.data.isSend;
          if (money < 2800) {
            money += sendPrice;
            moneys += sendPrice;
            isSend = false;
          } else {
            isSend = true;
          }
          if (integralNum < parseInt(res.data.data.Integral)) {
            that.setData({
              money: moneys,
              isSend: isSend,
              isLoading1: true,
              integralNum: integralNum,
              integralCheck: true,
              moneys: money
            })
          } else {
            that.setData({
              money: money,
              isSend: isSend,
              isLoading1: true,
              integralNum: integralNum,
              integralCheck: false,
              moneys: moneys
            })
          }
        }
      }
    })
  },
  // 优惠券
  // getCouponData: function(money) {
  //   var that = this;
  //   wx.request({
  //     url: app.globalData.urlApi.getCoupon,
  //     data: {
  //       openid: app.globalData.openId,
  //       type: 1
  //     },
  //     success: function(res) {
  //       console.log('优惠券', res)
  //       if (res.data.code == 1) {
  //         that.setData({
  //           couponPro: res.data.data.coupon,
  //           isLoading2: true
  //         })
  //       } else {
  //         that.setData({
  //           isLoading2: true
  //         })
  //       }
  //     }
  //   })
  // },

  // 优惠券
  getNewCouponData() {
    let self = this,
      url = `${app.baseUrl}/interface/Coupon/getNewCouponJson`,
      data = {}
    let dataPro = self.data.dataPro, book_id = []
    for (let i of dataPro) {
      // data.book_id.push(i.id)
      book_id.push({
        id: i.id,
        num: i.num
      })
    }
    data = {
      'openid': app.globalData.openId,
      'book_id': JSON.stringify(book_id)
    }
    console.log('优惠券2参数', data)
    app.wxRequest(url, data, (res) => {
      console.log('优惠券2', res)
      if(res.data.code == 1) {
        self.setData({
          'couponPro2': res.data.data.coupon,
          'isLoading2': true
        })
      } else {
        self.setData({
          isLoading2: true
        })
      }
    })
  },
  btn_address: function() {
    wx.navigateTo({
      url: '../address/address?info=2',
    })
  },
  btn_coupon: function() {
    var that = this;
    if (that.data.couponPro2.length > 0) {
      wx.navigateTo({
        url: '../coupon/coupon?typeNum=2&money=' + that.data.money / 100,
      })
    }
  },
  btn_Integral1: function(e) {
    var that = this;
    var integralNum = that.data.integralNum;
    var Integral = that.data.Integral;
    var integralCheck = that.data.integralCheck;
    var moneys = that.data.moneys;
    var money = that.data.money;
    if (integralNum > Integral) {
      integralCheck = false;
    } else {
      that.setData({
        moneys: money
      })
      if (integralCheck) {
        integralCheck = false;
      } else {
        integralCheck = true;
      }
      money = moneys;
    }
    that.setData({
      integralCheck: integralCheck,
      money: money,
    })
  },
  // typeNum == 4 提交订单
  sendOrder1: function() {
    var that = this;
    var dataPro = that.data.dataPro;
    var defaultAddressPro = that.data.defaultAddressPro;
    var orderRemark = that.data.orderRemark;
    var isSend = that.data.isSend;
    var money = that.data.money;
    var sendPrice = 0;
    var integralNum = that.data.integralNum;
    var integralCheck = that.data.integralCheck;
    var integral = 0;
    if (integralCheck) {
      integral = integralNum;
    }
    if (orderRemark == "填写订单备注") {
      orderRemark = "";
    }
    if (!isSend) {
      sendPrice = that.data.sendPrice;
    }
    if (!defaultAddressPro.id) {
      that.setData({
        isShowToast: false,
        toastData: '没有选择地址',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      that.setData({
        isLoading1: false
      })
      wx.request({
        url: app.globalData.urlApi.getPay,
        data: {
          openid: app.globalData.openId,
          a_id: defaultAddressPro.id,
          s_id: JSON.stringify(dataPro),
          library_id: this.data.libId,
          remark: orderRemark,
          c_id: 0,
          integral: integral,
          delegation: 1,
          delegation_id: dataPro[0].delegation_id,
          money: money,
          costs: sendPrice
        },
        success: function(res) {
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
                app.globalData.goodsPro = {};
                app.globalData.goodsNum = 0;
                setTimeout(function () {
                  that.setData({
                    isShowToast: true,
                    isLoading1: true
                  })
                  wx.redirectTo({
                    url: '../openInformation/openInformation?id=' + dataPro[0].id + '&orderId=' + res.data.data,
                  })
                }, 2000)
              },
              'fail': function (result) {
                wx.redirectTo({
                  url: "../orderInformation/orderInformation?info=" + res.data.data + "&typeNum=1&distinguish=1"
                })
              }
            })
          } else {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
              isLoading1: true
            })
            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    }
  },

  sendOrder2: function() {
    var that = this;
    var dataPro = that.data.dataPro;
    var defaultAddressPro = that.data.defaultAddressPro;
    var orderRemark = that.data.orderRemark;
    var isSend = that.data.isSend;
    var sendPrice = 0;
    var money = that.data.money;
    var integralNum = that.data.integralNum;
    var integralCheck = that.data.integralCheck;
    var integral = 0;
    if (integralCheck) {
      integral = integralNum;
    }
    if (orderRemark == "填写订单备注") {
      orderRemark = "";
    }
    if (!isSend) {
      sendPrice = that.data.sendPrice;
    }
    if (!defaultAddressPro.id) {
      that.setData({
        isShowToast: false,
        toastData: '没有选择地址',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      that.setData({
        isLoading1: false
      })
      wx.request({
        url: app.globalData.urlApi.getPay,
        data: {
          openid: app.globalData.openId,
          a_id: defaultAddressPro.id,
          s_id: JSON.stringify(dataPro),
          library_id: this.data.libId,
          remark: orderRemark,
          c_id: 0,
          integral: integral,
          delegation: 1,
          delegation_id: -1,
          money: money,
          costs: sendPrice
        },
        success: function(res) {
          if (res.data.code == 1) {
            var item = res.data.msg.config;
            wx.requestPayment({
              'timeStamp': item.timestamp,
              'nonceStr': item.nonceStr,
              'package': item.package,
              'signType': item.signType,
              'paySign': item.paySign,
              'success': function(result) {
                that.setData({
                  isShowToast: false,
                  toastData: '支付成功',
                })
                app.globalData.goodsPro = {};
                app.globalData.goodsNum = 0;
                setTimeout(function() {
                  that.setData({
                    isShowToast: true,
                    isLoading1: true
                  })
                  wx.redirectTo({
                    url: '../openInformation/openInformation?id=' + dataPro[0].id + '&orderId=' + res.data.data,
                  })
                }, 2000)
              },
              'fail': function(result) {
                wx.redirectTo({
                  url: "../orderInformation/orderInformation?info=" + res.data.data + "&typeNum=1&distinguish=1"
                })
              }
            })
          } else {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
              isLoading1: true
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    }
  },
})