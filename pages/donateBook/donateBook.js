// pages/donateBook/donateBook.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataPro:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;

      that.getDonationBookData();
  },
  onShow: function () {
  
  },
  getDonationBookData:function(){
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getDonationBook,
      data:{
        openid: app.globalData.openId
      },
      success:function(res){
        console.log(res);
        if(res.data.code == 1){

          var item = res.data.data;
          if(item){

          for (var i = 0; i < item.length;i++){

            item[i]['isFalse'] = true;
          }
          }
            that.setData({
              dataPro: item
            })
        }else{
          that.setData({
            dataPro: null
          })
          
        }
      }
    })
  },
  btn_z_k:function(e){
    console.log(e);
    var that = this;
    var item = e.currentTarget.dataset.item;
    var dataPro = that.data.dataPro;
    var index = e.currentTarget.dataset.index; 

    if (item.isFalse){

      if(item.view == 0){
        wx.request({
          url: app.globalData.urlApi.editBookStatus,
          data: {
            id: item.id
          },
          success: function (res) {
            if (res.data.code == 1) {

              dataPro[index]['isFalse'] = false;
              dataPro[index]['view'] = '1';

              that.setData({
                dataPro: dataPro
              })
            }
          }
        })
      }else{
        dataPro[index]['isFalse'] = false;
        that.setData({
          dataPro: dataPro
        })
      }
    }else{
      dataPro[index]['isFalse'] = true;
      that.setData({
        dataPro: dataPro
      })
    }
   
  }
})