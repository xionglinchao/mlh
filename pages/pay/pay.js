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
    cash : 0,
    isShowToast: true,
    toastData: '',
    FL: '',
    isViewDisabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getWelfareNum();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  btn_all:function(){

  },
  getWelfareNum:function(){

    var that = this;
    wx.request({
      url: app.globalData.urlApi.getWelfareNum,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({
            withdraw: res.data.data.withdraw
          })
        }
      }
    })
  },
  btn_all:function(){
    var that = this;
    var withdraw = that.data.withdraw;

    that.setData({
      money: withdraw
    })
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
    
    that.setData({
      isViewDisabled: false
    })
    if (money >= 1){
      wx.showModal({
        title: '提示',
        content: '您确定要兑换'+ money + '个公益币',
        success:function(e){
          console.log(e);
          if (e.confirm){
            that.payWelfare(money);
          }else{
            that.setData({
              isViewDisabled: true
            })
          }
        }
      })

    }else{

      wx.showModal({
        title: '提示',
        content: '每次最少兑换100个公益币',
      })

      that.setData({
        isViewDisabled: true
      })
    }
    
  },
  payWelfare:function(money){
    var that = this;

    wx.request({
      url: app.globalData.urlApi.payWelfare,
      data:{
        openid: app.globalData.openId,
        amount: money
      },
      success:function(res){
        console.log(res);

        that.setData({
          isViewDisabled: true
        })
        if(res.data.code == 1){

          wx.showToast({
            title: '提现成功',
          })

          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2000)
            
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  }

 
})