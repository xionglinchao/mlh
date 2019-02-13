var app = getApp();
var audioCtx ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    soundUrl: null,
    soundMinute: 0,
    soundSecond: 0,
    id: 0,
    classId: 0,
    isDisabled: false
  },
  onLoad: function (options) {
    var that = this;

    that.setData({
      soundUrl: options.tempFilePath,
      soundSecond: options.soundSecond,
      soundMinute: options.soundMinute,
      id:options.id,
      classId: options.classId
    })
    audioCtx = wx.createInnerAudioContext()

  },
  onShow: function () {

  },
  onUnload:function(){
    audioCtx.stop();
  },
  bindplay:function(){
  },
  btn_play_sound:function(){
    var soundUrl = this.data.soundUrl;
    audioCtx.autoplay = true
    audioCtx.src = soundUrl;
    audioCtx.play();
  },
  btn_submit:function(e){
    var that = this;
    var soundUrl = that.data.soundUrl;
    var soundSecond = that.data.soundSecond;
    var soundMinute = that.data.soundMinute;
    var information = e.detail.value.information;
    var id = that.data.id;
    var classId = that.data.classId;
    that.setData({
      isDisabled: true
    })
    wx.uploadFile({
      url: app.globalData.urlApi.edit_audio,
      filePath: soundUrl,
      name: 'file',
      success:function(res){
        console.log(res);
        var dataName = JSON.parse(JSON.stringify(that.trimKong(res.data)));
        console.log(dataName);
        var requestData = {
          openid: app.globalData.openId,
          library_id: id,
          works_creation_id: classId,
          content: information,
          audio: dataName.data,
          min: soundMinute,
          sec: soundSecond
        };
        app.requestPost(that, app.globalData.urlApi.addCreateComment, requestData, function (res) {

          if (res.data.code == 1) {
              var requestData1 = {
                openid: app.globalData.openId
              }
              app.requestPost(that, app.globalData.urlApi.getBadge, requestData1,function(res){
                if(res.data.code == 1){


                  if (res.data.data.creation_badge1 == 1){
                    var parameterStrng = '?typeNum=1&badgeNum=' + res.data.data.creation_badge2;
                    app.navigateWx(that, '../../badgeShow/badgeShow', parameterStrng);
                  } else if (res.data.data.story_badge1 == 1){
                    var parameterStrng = '?typeNum=2&badgeNum=' + res.data.data.story_badge2;
                    app.navigateWx(that, '../../badgeShow/badgeShow', parameterStrng);
                  } else if (res.data.data.painting_badge1 == 1){
                    var parameterStrng = '?typeNum=3&badgeNum=' + res.data.data.painting_badge2;
                    app.navigateWx(that, '../../badgeShow/badgeShow', parameterStrng);
                  }else{

                    wx.navigateBack({
                      delta: 2
                    })

                    that.setData({
                      isDisabled: false
                    })
                  }
                }
            })
          }
        })
      }
    })
  },
  trimKong: function (s) {//

    return JSON.parse(trim(s));

    function trim(str) {
      str = str.replace(/^(\s|\u00A0)+/, '');
      for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1);
          break;
        }
      }
      return str;
    }
  },
})