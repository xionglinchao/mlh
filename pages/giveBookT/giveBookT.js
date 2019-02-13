// pages/giveBookT/giveBookT.js
var app = getApp();
const isPhone = require('../../utils/isPhone.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    orderId: 0,
    isShowToast: true,
    toastData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      orderId: options.orderId
    })
  },
  onShow: function () {
  
  },
  btn_submit:function(e){
    var that = this;
    var orderId = that.data.orderId;
    var id = that.data.id;
    var item = e.detail.value;

    if(item.name == ''){
      that.setData({
        isShowToast: false,
        toastData: '姓名不能为空',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)

    }else if(item.wx == ''){
      that.setData({
        isShowToast: false,
        toastData: '微信号不能为空',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)

    }else if(item.phone == ''){
      that.setData({
        isShowToast: false,
        toastData: '手机号不能为空',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (!isPhone.phone(item.phone)){
      that.setData({
        isShowToast: false,
        toastData: '手机号格式错误',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    }else{

      wx.request({
        url: app.globalData.urlApi.getDonateBooksT,
        data:{
          openid: app.globalData.openId,
          id: orderId,
          b_id: id,
          wechat: item.wx,
          phone: item.phone,
          name: item.name
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success:function(res){
            console.log(res);

            if(res.data.code == 1){

              that.setData({
                isShowToast: false,
                toastData: res.data.msg,
              })

              setTimeout(function () {
                that.setData({
                  isShowToast: true,
                })

                wx.navigateBack({
                  delta: 2
                })
              }, 2000)
            }else{

              that.setData({
                isShowToast: false,
                toastData: res.data.msg,
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
  }
})