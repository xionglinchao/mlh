// pages/leaveComments/leaveComments.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    leaveComments: []
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
  },
  onShow: function () {
    var that = this;
    
    that.getCommentsData(that.data.id);
  },
  getCommentsData:function(id){
    var that  = this;

    var requestData = {
      openid: app.globalData.openId,
      id: id
    }

    app.requestPost(that, app.globalData.urlApi.sendMessage, requestData, function (res) {

      if (res.data.code == 1) {

        that.setData({
          leaveComments: res.data.data
        })
      } 
    })
  },
  btn_go_comment:function(){
    
    var parameterStrng = '?typeNum=1&id=' + this.data.id;
    app.navigateWx(this, '../posting/createComment/createComment', parameterStrng);
  },
  btn_replay:function(e){

    var id = e.currentTarget.dataset.item.id;

    var parameterStrng = '?typeNum=2&id=' + id;
    app.navigateWx(this, '../posting/createComment/createComment', parameterStrng);
  },
  // 跳转个人主页
  toPersonalHomepage(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item.u_id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  }
})