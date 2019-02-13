// pages/posting/createComment/createComment.js
var app = getApp();
Page({
  data: {
    id: 0,
    isDisabled: false,
    typeNum: 0
  },
  onLoad: function (options) {
      var that  = this;

      var typeNum = that.data.typeNum;

      if(options.typeNum){
        typeNum = options.typeNum;
      }

      that.setData({
        id: options.id,
        typeNum: typeNum
      })
  },

  btn_submit:function(e){
    var that = this;
    var information = e.detail.value.information;
    var id = that.data.id;
    var typeNum = that.data.typeNum;

    that.setData({
      isDisabled: true
    })
    
    if(information == ''){
      wx.showToast({
        title: '请输入文字',
        icon: 'none',
        duration: 2000
      })

      that.setData({
        isDisabled: false
      })
      
    }else{

      

      if(typeNum == 0){

        var requestData = {
          id: id,
          openid: app.globalData.openId,
          content: information
        }
        that.go_comment(requestData, app.globalData.urlApi.addTwoCreateComment,that);
      }else if(typeNum == 1){
        var requestData = {
          id: id,
          openid: app.globalData.openId,
          content: information
        }
        that.go_comment(requestData, app.globalData.urlApi.toChatSend, that);
      }else if(typeNum == 2){
        var requestData = {
          id: id,
          openid: app.globalData.openId,
          content: information
        }
        that.go_comment(requestData, app.globalData.urlApi.replyMessage, that);
      }
      
    }
    
  },
  go_comment: function (requestData, url,that){

    app.requestPost(that, url, requestData, function (res) {

      if (res.data.code == 1) {
        wx.navigateBack({
          delta: 1
        })
        that.setData({
          isDisabled: false
        })
      }
    })
  }

})