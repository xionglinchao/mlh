// pages/personalInformation/personalInformation.js
var app = getApp();
let nowTime = require('../../utils/nowTime.js');
var audioCtx;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    focusOnPro: {},
    focusOnContenPro: [],
    notContentPro: {
      windowHeight1: 'calc(100% - 199px)',
      isContent: true,
    },
    sw: 0,
    typeNum: 1,
    isOhter: true,
    isCollect: true,
    collectId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);

    that.setData({
      id: options.id
    })

    if(options.typeNum){
      that.setData({
        typeNum: 2
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sw: res.windowWidth,
        })
      },
    })
    audioCtx = wx.createInnerAudioContext()
  },
  onShow: function () {
    var that = this;

    that.getFocusOnInformationData(that.data.id);
    that.getFocusOnContentData(that.data.id);
  },
  onHide: function () {
    audioCtx.stop();
  },
  onUnload:function(){
    audioCtx.stop();
  },
  getFocusOnInformationData:function(id){
    var that = this;
    var requestData = {
      id: id,
      s_openid: app.globalData.openId
    };

    app.requestPost(that, app.globalData.urlApi.focusOnInformation, requestData, function (res) {

      if (res.data.code == 1) {

        that.setData({
          focusOnPro: res.data.data
        })
      }
    })
  },
  getFocusOnContentData:function(id){
    var that = this;

    var requestData = {
      openid: app.globalData.openId,
      id: id
    };

    app.requestPost(that, app.globalData.urlApi.focusOnContent, requestData, function (res) {
      
      var notContentPro = that.data.notContentPro;
      if (res.data.code == 1) {

        for(var i = 0 ; i < res.data.data.length; i++){

          res.data.data[i]['times'] = nowTime.timeNum(res.data.data[i].time);
          res.data.data[i]['isPlay'] = 0;
        }
        if(res.data.data.length == 0){
          notContentPro.isContent = false;
        }else{
          notContentPro.isContent = true;
        }
        
          console.log(res);
          that.setData({
            focusOnContenPro: res.data.data,
            notContentPro: notContentPro
          })
      }else{

        notContentPro.isContent = false;

        console.log(notContentPro);

        that.setData({
          notContentPro: notContentPro,
          focusOnContenPro: []
        })
      }
    })
  },
  btn_library: function (e) {//跳转文库详情

    var that = this;
    var item = e.currentTarget.dataset.item;

    var parameterStrng = '?id=' + item.library_id;
    app.navigateWx(that, '../libraryClass/bookLibraryInformation/bookLibraryInformation', parameterStrng);
  },
  btn_go_likes: function (e) {//评论点赞

    var that = this;
    var item = e.currentTarget.dataset.item;
    var likes = 0;
    console.log(item);
    if (item.whether_like == 1) {
      likes = -1;
    } else {
      likes = 1
    }
    var requestData = {
      id: item.id,
      openid: app.globalData.openId,
      s_openid: that.data.id,
      type: likes
    }
    app.requestPost(that, app.globalData.urlApi.goCreationLikes, requestData, function (res) {

      if (res.data.code == 1) {

        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })

        that.getFocusOnContentData(that.data.id);
      }
    })
  },
  btn_go_comment: function (e) {//跳转评论页

    var that = this;
    var item = e.currentTarget.dataset.item;

    var parameterStrng = '?id=' + item.id;
    app.navigateWx(that, '../posting/createComment/createComment', parameterStrng);
  },
  btn_video: function (e) {//跳转播放视频

    var that = this;
    var videoName = e.currentTarget.dataset.video;

    var parameterStrng = '?videoPlay=' + videoName;
    app.navigateWx(that, '../videoPlay/videoPlay', parameterStrng);
  },
  btn_preview: function (e) {//图片预览

    if (!app.globalData.isNetwork) {
      return;
    }
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
  btn_go_comment_information: function (e) {//进入评论详情页
    var that = this;

    var item = e.currentTarget.dataset.item;

    var parameterStrng = '?id=' + item.id;
    app.navigateWx(that, '../posting/commentInformation/commentInformation', parameterStrng);
  },
  btn_attention: function () {
    var that = this;
    var item = that.data.focusOnPro;

    if (item.sigin_attention == 0){

      var requestData = {
        openid: app.globalData.openId,
        type: 5,
        id: item.id
      }
      app.requestPost(that, app.globalData.urlApi.addFavorites, requestData, function (res) {

        if (res.data.code == 1) {

          wx.showToast({
            title: '关注成功',
            icon: 'none',
            duration: 2000
          })
          that.getFocusOnInformationData(that.data.id);

        }
      })
    }else{

      wx.showToast({
        title: '已关注',
        icon: 'none',
        duration: 2000
      })
    }

    
  },
  btn_leave_comments:function(){//留言
    var id = this.data.id;
    var parameterStrng = '?id=' + id;
    app.navigateWx(this, '../leaveComments/leaveComments', parameterStrng);
  },
  btn_go_bottom: function (e) {//点击向下箭头弹出举报收藏弹框
    var that = this;
    var isCollect = that.data.isCollect;
    var item = e.currentTarget.dataset.item;

    if (item.collection == '0') {
      isCollect = false
    } else {
      isCollect = true
    }

    that.setData({
      isOhter: false,
      isCollect: isCollect,
      collectId: item.id
    })
  },
  btn_create_model:function(){
    this.setData({
      isOhter: true
    })
  },
  bind_collect: function () {//点击收藏

    var that = this;
    var collectId = that.data.collectId;
    var isCollect = that.data.isCollect;

    if (!isCollect) {

      var requestData = {
        openid: app.globalData.openId,
        type: 4,
        id: collectId
      }

      app.requestPost(that, url.addFavorites, requestData, function (res) {

        if (res.data.code == 1) {

          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })

          that.setData({
            isOhter: true
          })

          that.getFocusOnContentData(that.data.id);
        }
      })
    } else {
      wx.showToast({
        title: '已收藏',
        icon: 'none',
        duration: 2000
      })
    }
  },
  bind_complain: function () {//点击投诉

    var that = this;
    var collectId = that.data.collectId;
    var requestData = {
      id: collectId,
      openid: app.globalData.openId
    }

    app.requestPost(that, url.createCpmplaidts, requestData, function (res) {

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
  bind_delete:function(){

    var that = this;

    var collectId = that.data.collectId;
    var requestData = {
      id: collectId,
      openid: app.globalData.openId
    }
    app.requestPost(that, app.globalData.urlApi.deleteCommentCreate, requestData, function (res) {

      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })

      that.getFocusOnContentData(that.data.id);
      that.setData({
        isOhter: true
      })
    })
  },
  btn_play_sound: function (e) {//播放语音
    var that = this;
    if (!app.globalData.isNetwork) {
      wx.showModal({
        title: '提示',
        content: '当前网络状态不佳，请检查您的网络',
        showCancel: false,
        confirmText: '我知道了',
        success: function (res) {

        }
      })
      return;
    }
    var info = e.currentTarget.dataset.info;
    var index = e.currentTarget.dataset.index;
    var commentBookPro = that.data.focusOnContenPro;
    console.log(commentBookPro);
    for (var i = 0; i < commentBookPro.length; i++) {

      if (i != index) {
        commentBookPro[i]['isPlay'] = 0;
      }
    }



    if (commentBookPro[index]['isPlay'] == 0) {

      commentBookPro[index]['isPlay'] = 1;
      audioCtx.autoplay = true
      audioCtx.src = app.globalData.urlApi.ossImageUrl + info;
      audioCtx.play();

    } else {
      commentBookPro[index]['isPlay'] = 0;

      audioCtx.pause();
    }
    that.setData({
      focusOnContenPro: commentBookPro
    })

    audioCtx.onEnded((res) => {

      var commentBookPro1 = that.data.focusOnContenPro;
      for (var i = 0; i < commentBookPro1.length; i++) {
        commentBookPro1[i]['isPlay'] = 0;
      }

      that.setData({
        focusOnContenPro: commentBookPro1
      })
    })
  },
})