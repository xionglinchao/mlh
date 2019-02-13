// pages/soundRecord/soundRecord.js
var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
var recorderManager;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createBookId: 0,
    createBookName: null,
    soundMinute: 0,
    soundSecond: 0,
    isSoundStart: false,
    options : {
      duration: 600000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
    },
    isConfirm: false,
    getTimeInt: 0,
    id: 0,
    classId: 0,
    typeNum: 0,
    isViewDisabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    recorderManager = wx.getRecorderManager()

    that.soundMethod();
    app.globalData.createBookId = 0;
    app.globalData.createBookName = null;

    if(options.name){

      that.setData({
        createBookName: options.name,
        createBookId: options.id,
        classId: options.classId,
        typeNum: options.typeNum
      })

      that.get_book_data(options.id);
    }else{
      that.setData({
        classId: options.classId
      })
    }
    
    
    
  },
  onShow: function () {
    
    var that = this;

    that.setData({
      isViewDisabled: true
    })

    if (app.globalData.createBookId != 0){

      

      if (app.globalData.createBookId != that.data.createBookId ){

        that.setData({
          createBookId: app.globalData.createBookId,
          createBookName: app.globalData.createBookName
        })

        that.get_book_data(app.globalData.createBookId);
      }
      
    }
      
  },
  btn_choose_book:function(){

    var that = this;
    var typeNum = that.data.typeNum;

    that.setData({
      isViewDisabled: false
    })

    if (typeNum == 0){
      wx.navigateTo({
        url: '../chooseBook/chooseBook',
      })
    }

    
  },
  get_book_data: function (id) {
    var that = this;
    var requestData = { id: id, openid: app.globalData.openId };
    app.requestPost(that, app.globalData.urlApi.getLibraryInformation, requestData, function (res) {

      if (res.data.code == 1) {

        that.setData({
          libraryInformationPro: res.data.data,
          
        })

        var article = res.data.data.text_story;
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    })
  },
  btn_start_recording:function(){
    var that = this;
    var isSoundStart = that.data.isSoundStart;
    var createBookId = that.data.createBookId;
    var soundMinute = that.data.soundMinute;
    var soundSecond = that.data.soundSecond;

    if (createBookId != 0){
      if (isSoundStart) {
        recorderManager.pause();
        isSoundStart = false;
      } else {
        if (soundMinute == 0 && soundSecond == 0){
          recorderManager.start(that.data.options);
        }else{
          recorderManager.resume();
        }
       
        isSoundStart = true;
      }
      that.setData({
        isSoundStart: isSoundStart
      })
    }else{
      
      wx.showToast({
        title: '请选择文学作品',
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  soundMethod:function(){
    var that = this;

    recorderManager.onStart(() => {
      console.log('recorder start');

        that.soundTimeCount();
    
    })
    recorderManager.onResume(() => {
      console.log('recorder resume')
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    recorderManager.onStop((res) => {
      
      var isConfirm = that.data.isConfirm;
      var getTimeInt = that.data.getTimeInt;
      clearTimeout(getTimeInt);

      that.setData({
        isSoundStart: false
      })
 
      if (isConfirm) {
        
        var soundMinute = that.data.soundMinute;
        var soundSecond = that.data.soundSecond;
        var id = that.data.createBookId;
        var classId = that.data.classId;
        wx.navigateTo({
          url: '../confirmRecording/confirmRecording?tempFilePath=' + res.tempFilePath + '&soundMinute=' + soundMinute + '&soundSecond=' + soundSecond + '&id=' + id + '&classId=' + classId,
        })
      }
    })
    recorderManager.onFrameRecorded((res) => {
      console.log(res);

      
    })

  },
  btn_cancel_recording:function(){
    var that = this;
    var isSoundStart = that.data.isSoundStart;
    var soundMinute = that.data.soundMinute;
    var soundSecond = that.data.soundSecond;

    if (!isSoundStart & soundSecond == 0 && soundMinute == 0) {
      wx.showToast({
        title: '还没有录音噢～',
        icon: 'none',
        duration: 2000
      })
    }else{
      recorderManager.stop();

      that.setData({
        isSoundStart: false,
        soundMinute: 0,
        soundSecond: 0,
      })
    }
    
  },
  btn_confirm_recording:function(){
    var that = this;
    var isSoundStart = that.data.isSoundStart;
    var createBookId = that.data.createBookId;
    var soundMinute = that.data.soundMinute;
    var soundSecond = that.data.soundSecond;

    if (!isSoundStart && soundMinute == 0 && soundSecond == 0){
      wx.showToast({
        title: '还没有录音噢～',
        icon:'none',
        duration: 2000
      })
    } else if (createBookId == 0){
      wx.showToast({
        title: '请选择文学作品',
        icon: 'none',
        duration: 2000
      })
    }else{

      that.setData({
        isViewDisabled: false
      })

        recorderManager.stop();
      
      that.setData({
        isSoundStart: false,
        isConfirm: true
      })
    }

    
  },
  soundTimeCount:function(){
    var that = this;
    var soundMinute = that.data.soundMinute;
    var soundSecond = that.data.soundSecond;
    var isSoundStart = that.data.isSoundStart;
  

    if(isSoundStart){

      soundSecond++;

      if (soundSecond == 60) {
        soundSecond = 0;
        soundMinute++;
      }

      that.setData({
        soundSecond: soundSecond,
        soundMinute: soundMinute
      })

      if (soundMinute < 10) {

        var getTimeInt = setTimeout(function () {
          that.soundTimeCount()
        }, 1000)

        that.setData({
          getTimeInt: getTimeInt
        })
      }
    }
    
  }
})