// pages/posting/commentInformation/commentInformation.js
var app = getApp();
let nowTime = require('../../../utils/nowTime.js');
var audioCtx;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    sw: 0,
    id: 0,
    isOhter: true,
    isCollect: false,
    collectId: 0,
    typeNum: 0,
    isPlay: 0
  },

  onLoad: function (options) {

      var that = this;

      that.setData({
        id: options.id,
        
      })

      wx.getSystemInfo({
        success: function (res) {

          that.setData({
            sw: res.windowWidth,
            typeNum: options.typeNum
          })
        },
      })
      
      audioCtx = wx.createInnerAudioContext()
      
  },
  onShow: function () {
    var that = this;

    if (app.globalData.openId){
      that.getASingleCommentData(that.data.id);
    }else{
      app.openIdReadyCallback = res => {
        app.globalData.openId = res;
        that.getASingleCommentData(that.data.id);
      }
    }

    
  },

  onHide: function () {
    audioCtx.stop();
  },
  onUnload:function(){
    audioCtx.stop();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var item = that.data.item;
    return {
      title: item.library_name,
      path: '/pages/posting/commentInformation/commentInformation?id='+item.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  btn_write_comment:function(){
    var that = this;
    var item = that.data.item;

    var parameterStrng = '?id=' + item.id;

    app.navigateWx(that, '../createComment/createComment', parameterStrng);

  },
  btn_video: function (e) {
    console.log(e);
    var that = this;
    var videoName = e.currentTarget.dataset.video;

    var parameterStrng = '?videoPlay=' + videoName;

    app.navigateWx(that, '../../videoPlay/videoPlay', parameterStrng);


  },
  btn_preview: function (e) {
    console.log(e);
    var that = this;

    var item = e.currentTarget.dataset.item;
    var image = e.currentTarget.dataset.image;
    for (var i = 0; i < item.length; i++) {
      item[i] = app.globalData.urlApi.ossImageUrl + item[i]
    }

    wx.previewImage({
      current: image,
      urls: item,
    })
  },
  getASingleCommentData:function(id){
    var that = this;

    wx.showLoading({
      title: '加载中',
    })
    var requestData = {
      id: id,
      openid: app.globalData.openId
    }
    app.requestPost(that, app.globalData.urlApi.aSingleComment, requestData, function (res) {

      if (res.data.code == 1) {
        res.data.data['times'] = nowTime.timeNum(res.data.data['time']);
        that.setData({
          item: res.data.data
        })
      }
      wx.hideLoading();
    })
  },
  btn_go_likes: function (e) {
    var that = this;
    var item = that.data.item;
    var likes = 0;

    if (item.whether_like == 1) {
      likes = -1;
    } else {
      likes = 1
    }
    var requestData = {
      id: item.id,
      openid: app.globalData.openId,
      type: likes
    }
    app.requestPost(that, app.globalData.urlApi.goCreationLikes, requestData, function (res) {

      if (res.data.code == 1) {

        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })

        that.getASingleCommentData(that.data.id);
      }
    })
  },
  btn_play_sound: function (e) {//播放语音
    var info = e.currentTarget.dataset.info;
    var isPlay = this.data.isPlay;

    if (isPlay == 0) {

      isPlay = 1;
      audioCtx.autoplay = true
      audioCtx.src = app.globalData.urlApi.ossImageUrl + info;
      audioCtx.play();

    } else {
      isPlay = 0;

      audioCtx.pause();
    }

    this.setData({
      isPlay: isPlay
    })

    audioCtx.onEnded((res) => {

      this.setData({
        isPlay: 0
      })
    })
  },
  btn_go_bottom: function (e) {//点击向下箭头弹出举报收藏弹框
    var that = this;
    console.log(e);
    var isCollect = that.data.isCollect;
    var item = that.data.item;

    if (item.collection == '0') {
      isCollect = false;
    } else {
      isCollect = true;
    }

    that.setData({
      isOhter: false,
      isCollect: isCollect,
      collectId: item.id
    })
  },
  bind_collect: function () {
    var that = this;
    var collectId = that.data.collectId;
    var isCollect = that.data.isCollect;

    if (!isCollect) {

      var requestData = {
        openid: app.globalData.openId,
        type: 4,
        id: collectId
      }

      app.requestPost(that, app.globalData.urlApi.addFavorites, requestData, function (res) {

        if (res.data.code == 1) {

          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })

          that.setData({
            isOhter: true
          })

          that.getASingleCommentData(that.data.id);
        }
      })
    } else {
      wx.showToast({
        title: '已收藏',
        icon: 'none',
        duration: 2000
      })

      that.setData({
        isOhter: true
      })
    }
  },
  bind_complain: function () {
    var that = this;
    var collectId = that.data.collectId;
    var requestData = {
      id: collectId,
      openid: app.globalData.openId
    }

    app.requestPost(that, app.globalData.urlApi.createCpmplaidts, requestData, function (res) {

      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })

      that.setData({
        isOhter: true
      })
    })
  },
  btn_library: function () {
    var that = this;
    var item = that.data.item;
    console.log(item);
    var typeNum = that.data.typeNum;

    if(typeNum == 1){
      wx.navigateBack({
        delta: 1
      })
    }else{
      
      var parameterStrng = '?id=' + item.library_id;

      app.navigateWx(that, '../../libraryClass/bookLibraryInformation/bookLibraryInformation', parameterStrng);

    }
    
  },
  btn_create_model:function(){
    
    this.setData({
      isOhter: true
    })
  }
})