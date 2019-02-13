// pages/openInformation/openInformation.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
const getTime = require('../../utils/getTime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openDataPro: {},
    isTimeOut: false,
    hours: '',
    minutes: '',
    seconds: '',
    clearid: '',
    id: '',
    orderId: '',
    typeNum: 1,
    isViewDisabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      orderId: options.orderId,
      typeNum: options.typeNum
    })
    that.getOpenData(options.id, options.orderId);
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
    this.setData({
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
    
    clearTimeout(this.data.clearid);
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
    var that = this;
    return {
      title: that.data.openDataPro.shop.name,
      path: '/pages/openInformation/openInformation?id=' + that.data.id + '&orderId=' + that.data.orderId + '&typeNum=2',
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getOpenData: function (id, orderId) {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getOpeninformation,
      data: {
        orderId: orderId,
        id: id
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {

          var item = res.data.data;
          var numTime = res.data.data.shop.price_time;


          that.getTimeData(item.time, numTime);

          that.setData({
            openDataPro: res.data.data
          })

          var article = res.data.data.shop.content;

          WxParse.wxParse('article', 'html', article, that, 5);

        }


      }
    })
  },
  getTimeData: function (time, numTime) {
    var that = this;
    var timeObj = {};
    var clearid = that.data.clearid;
    timeObj = getTime.getTimes(time, numTime);

    if (timeObj.hours == '00') {

      if (timeObj.minutes == '00') {

        if (timeObj.seconds == '00') {

          that.setData({
            isTimeOut: true
          })
        } else {
          that.setData({
            isTimeOut: false,
            hours: timeObj.hours,
            minutes: timeObj.minutes,
            seconds: timeObj.seconds
          })

          clearid = setTimeout(function () {
            that.getTimeData(time, numTime);
          }, 1000)
        }
      } else {
        that.setData({
          isTimeOut: false,
          hours: timeObj.hours,
          minutes: timeObj.minutes,
          seconds: timeObj.seconds
        })

        clearid =   setTimeout(function () {
          that.getTimeData(time, numTime);
        }, 1000)
      }
    } else {
      that.setData({
        isTimeOut: false,
        hours: timeObj.hours,
        minutes: timeObj.minutes,
        seconds: timeObj.seconds
      })

      clearid =  setTimeout(function () {
        that.getTimeData(time, numTime);
      }, 1000)
    }
    that.setData({
      clearid: clearid
    })
  },
  btn_go_open: function (openId){
    var that = this;

    var that = this;


    if (app.globalData.openId) {
      that.getOpenIdData(app.globalData.openId);
    } else {
      app.openIdReadyCallback = res => {
        that.getOpenIdData(res.openId);
      }
    } 


    

   

   
  },
  getOpenIdData: function (openId){

    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        openid: openId
      },
      success: function (res) {
        console.log(res);

        if (res.data.code == 1) {

          var dataInformation = that.data.openDataPro
          var dataPro = [];
          var dataObj = {};


          this.setData({
            isViewDisabled: false
          })

          dataObj['name'] = dataInformation.shop.name;
          dataObj['id'] = dataInformation.shop.id;
          dataObj['litpic'] = dataInformation.shop.litpic;
          dataObj['money'] = dataInformation.shop.money;
          dataObj['moneys'] = dataInformation.shop.price;
          dataObj['people'] = dataInformation.shop.price_people;
          dataObj['num'] = 1;
          dataPro.push(dataObj);

          wx.navigateTo({
            url: '../send/send?typeNum=4&dataPro=' + JSON.stringify(dataPro),
          })

        } else {
          app.globalData.loginSend = 1;
          app.globalData.openPro = dataPro;
          wx.navigateTo({
            url: '../forceLogin/forceLogin',
          })
        }
      }
    })
      
  }
})