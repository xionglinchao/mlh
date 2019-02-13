var app = getApp();
Page({
  data: {
    tabs: ["正在参与", "参与过的"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    relayPro: [],
    isGap1: false,
    isGap2: false,
    isViewDisabled: true
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: res.windowWidth - (that.data.tabs.length - 0) * res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    
  },
  onShow: function () {
      this.setData({
        isViewDisabled: true
      })

      this.getMyRead();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getMyRead:function(){
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getMyReady,
      data:{
        openid: app.globalData.openId
      },
      success:function(res){
        console.log(res);

        if(res.data.code == 1){

          var dataPro = res.data.data;
          var isGap1 = true;
          var isGap2 = true;
          for(var i = 0 ; i < dataPro.length; i++){
            var j = dataPro[i].time.indexOf(' ');
            if (j > -1){
              dataPro[i].time = dataPro[i].time.substring(0,j);
              console.log(dataPro[i].time);
            }
            if (dataPro[i].status == 0){
              isGap1 = false
            }

            if (dataPro[i].status == 1){
              isGap2 = false;
            }
          }

          that.setData({
            relayPro : res.data.data,
            isGap1: isGap1,
            isGap2: isGap2
          })
        }else{
          that.setData({
            relayPro: [],
            isGap1: true,
            isGap2: true,
          })
        }
      }
    })
  },
  btn_infomartion:function(e){
    var that = this;
    that.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../myRelayReadInformation/myRelayReadInformation?typeNum=1&id=' + e.currentTarget.dataset.id,
    })
  }
})