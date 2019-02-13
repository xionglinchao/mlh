// pages/pay/pay.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: 1,
    money: 0,
    withdraw: 0,
    cash: 0,
    isShowToast: true,
    toastData: '',
    FL: '',
    id:0,
    isShadow: true,
    hidden: true,
    isDisabled: false,
    judgment: 0,
    name: '捐赠',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var name ;
      if (options.judgment == 1){
        name = "捐赠";
      }else{
        name = "捐赠";
      }

      that.setData({
        id: options.id,
        name: name
      })

      wx.request({
        url: app.globalData.urlApi.getWelfareNum,
        data:{
          openid: app.globalData.openId
        },
        success:function(res){
          console.log(res);
          if(res.data.code == 1){
            that.setData({
              withdraw: res.data.data.withdraw
            })
          }
        }
      })
  },
  onShow: function () {

  },
  input_getOut:function(e){
    var that = this;
    that.setData({
      money: e.detail.value
    })
   
  },
  btn_get_out:function(){
    var that = this;
    var money = that.data.money;

    
    
    if(money > 0){
      that.setData({
        isShadow: false,
        hidden: false
      })
    }else{
      that.setData({
        isShowToast: false,
        toastData: '捐赠公益币不能小于0',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })

      }, 2000)
    }
    
  },
  confirm:function(){
    var that = this;
    var money = that.data.money;
    var id = that.data.id;

    that.setData({
      isDisabled: true
    })

    wx.request({
      url: app.globalData.urlApi.getDonateCharity,
      data: {
        openid: app.globalData.openId,
        id: id,
        quantity: money
      },
      success: function (res) {
        console.log(res);

        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: '捐赠成功，感谢您的捐赠',
            isShadow: true,
            hidden: true
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true, 
              isDisabled:false
              
            })

            wx.navigateBack({
              delta: 1
            })

          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true, 
              isDisabled: false, 
              isShadow: true,
              hidden: true
            })

          }, 2000)
        }
      }
    })
  },
  cancel:function(){
    var that = this;
    that.setData({
      isShadow: true,
      hidden: true
    })
  },
  btn_all:function(){
    var that = this;
    var withdraw = that.data.withdraw;

    if (withdraw == undefined){
      withdraw = 0;
    }
    that.setData({
      money: withdraw
    })
  }
})