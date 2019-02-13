// pages/readingMeeting/readingMeeting.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sw: 0,
    id: 0,
    isTrue: false,
    meetingPro:{},
    isLoading: false,
    isUser: 1,
    isViewDisabled: true,
    isLogin: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    
    wx.getSystemInfo({
      success: function (res) {

        that.setData({
          sw: res.windowWidth,
          id: options.id
        })

        
      },
    })
    

    that.getMeetingData(options.id);
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
    var that = this;

    if(that.data.id != 0 && that.data.isTrue){
      that.getMeetingData(that.data.id);
    }
    that.get_is_login(that);
    that.setData({
      isViewDisabled: true
    })
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
  btn_rank:function(){
    this.setData({
      isViewDisabled: true
    })
    wx.navigateTo({
      url: '../meetingRankList/meetingRankList?id=' + this.data.id,
    })
  },
  btn_join:function(){
    this.setData({
      isViewDisabled: true
    })

    if (this.data.isLogin == 1) {
      wx.navigateTo({
        url: '../joinMeeting/joinMeeting?type=0&id=' + this.data.id,
      })
    }else{
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
   
  },
  getMeetingData:function(id){
    var that  = this;

    wx.request({
      url: app.globalData.urlApi.getReadMetting,
      data:{
        id: id,
        openid: app.globalData.openId
      },
      success:function(res){
        console.log(res);

        if(res.data.code == 1){

          wx.setNavigationBarTitle({
            title: res.data.data.book.name,
          })

            that.setData({
              meetingPro: res.data.data.book,
              isLoading: true,
              isUser: res.data.data.user
            })
        }

        that.setData({
          isTrue : true,
          isLoading: true
        })
      }
    })
  },
  btn_activityInformation:function(e){

    this.setData({
      isViewDisabled: true
    })
   
    wx.navigateTo({
      url: '../activityInformation/activityInformation?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
    })
  },
  //判断是否登录
  get_is_login: function (that) {


    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({
            isLogin: 1
          })

         
        } else {
          that.setData({
            isLogin: -1
          })
        }

      }
    })

  }
})