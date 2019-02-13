var app = getApp();
Page({
  data: {
    id: 0,
    personPro: [],
    name: null,
    t_id: null,
    toastData: '',
    isShowToast: true,
  },
  onLoad: function (options) {
      var that = this;

      that.setData({
        id: options.id
      })

      that.getPersonData(options.id);
  },
  onShow: function () {
  
  },
  getPersonData:function(id){
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getClubNamePerson,
      data:{
        id: id
      },
      success:function(res){

        if(res.data.code == 1){
          
          that.setData({
            personPro: res.data.data
          })
        }
      }
    })
  },
  btn_city:function(e){
    var that = this;
    console.log(that.data.personPro);
    that.setData({
      name: that.data.personPro[e.detail.value].username,
      t_id: that.data.personPro[e.detail.value].id
    })
  },
  btn_q:function(){
    var that = this;

    var id = that.data.id;
    var t_id = that.data.t_id;
    if (!t_id){
      that.setData({
        isShowToast: false,
        toastData: '请选择转让人',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })

      }, 2000)
    }else{
      wx.request({
        url: app.globalData.urlApi.transferBookclub,
        data:{
          id: id,
          t_id: t_id
        },
        success:function(res){
          if(res.data.code == 1){
            that.setData({
              isShowToast: false,
              toastData: '转让成功',
            })

            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })

              wx.navigateBack({
                delta: 2
              })

            }, 2000)
          }else{
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
            })

            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })

            }, 2000)
          }
        }
      })
    }
  }
})