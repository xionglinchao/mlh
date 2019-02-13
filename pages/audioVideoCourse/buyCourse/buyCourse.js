const app = getApp()

Page({
  data: {
    isUseCoupon: false, // 是否选择使用优惠券
  },
  onLoad: function(options) {
    this.setData({
      'courseId': options.courseId || null,
      'type': options.type,
      'distribute_id': options.distribute_id || null
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getBuyCourseDetail()
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

  },
  // 获取购买课程页面详情
  getBuyCourseDetail() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/buy_course`,
      data = {}
    data = {
      'id': this.data.courseId,
      'type': this.data.type,
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('购买课程信息', res)
      if (res.data.err_code == 1) {
        res.data.data.course.cover = app.ossImgUrl + res.data.data.course.cover
        let original_price = res.data.data.course.original_free
        self.setData({
          'user': res.data.data.user,
          'course': res.data.data.course,
          'coupon': res.data.data.coupon,
          'original_price': original_price
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  //显示对话框
  showModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  // 选择智慧券
  useCoupon(e) {
    let couponId = e.currentTarget.dataset.item.id
    let couponValue = e.currentTarget.dataset.item.coupon_info
    if (couponValue) {
      var pay_price = parseInt((this.data.original_price*100 - couponValue*100) + 0.5)/100
    }
    this.setData({
      'isUseCoupon': true,
      'showModalStatus': false,
      'couponId': couponId,
      'couponValue': couponValue,
      'pay_price': pay_price >= 0 ? pay_price:0
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
  // 购买课程
  buyCourse() {
    let self = this,
      url = app.baseUrl + '/interface/Pay/purchaseColumn',
      data = {}
    data = {
      'id': self.data.courseId,
      'openid': app.globalData.openId,
      'type': self.data.type,
      'order_money': self.data.original_price,
      'c_id': self.data.couponId,
      'distribute_id': 0
    }
    app.wxRequest(url, data, (res) => {
      console.log('购买课程', res)
      if (res.data.code == 1) {
        var item = res.data.msg.config
        wx.requestPayment({
          'timeStamp': item.timestamp,
          'nonceStr': item.nonceStr,
          'package': item.package,
          'signType': item.signType,
          'paySign': item.paySign,
          'success': function(result) {
            wx.showModal({
              title: '购买成功',
              content: '请前往我的课程查看！',
            })
          },
          'fail': function(result) {
            console.log(result, 3132131312313131)
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
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
})