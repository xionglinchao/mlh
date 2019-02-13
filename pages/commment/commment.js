// pages/commment/commment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeNum: 1,
    id: '',
    isShowToast: true,
    toastData: '',
    others: 0,
    goodsNum: 0,
    goodsImage: '',
    hpNum: 5,
    pics: [],
    information: '',
    isUpload: false,
    isLoading: true,
    isDisabled: false
  },

  onLoad: function (options) {
    var that = this;

    if (options.typeNum == 3) {
      that.setData({
        typeNum: options.typeNum,
        id: options.id,
      })
    } else if (options.typeNum == 4) {
      that.setData({
        typeNum: options.typeNum,
        id: options.id,
        others: options.others
      })
    } else if (options.typeNum == 1) {
      var item = JSON.parse(options.item);
      var goodsNum = 0;
      var goodsImage = '';
      for (var i in item.shop) {
        goodsNum++;
        goodsImage = item.shop[i].litpic;
      }

      that.setData({
        typeNum: options.typeNum,
        id: item.id,
        goodsNum: goodsNum,
        goodsImage: goodsImage
      })
    } else if(options.typeNum == 2){
      var item = JSON.parse(options.item);
      var goodsNum = 0;
      var goodsImage = '';
      for (var i in item.shops) {
        goodsNum++;
        goodsImage = item.shops[i].litpic;
      }

      that.setData({
        typeNum: options.typeNum,
        id: item.orders.id,
        goodsNum: goodsNum,
        goodsImage: goodsImage
      })
    }else if(options.typeNum == 5){
      that.setData({
        typeNum: options.typeNum,
        id: options.id,
      })
    }
  },
  onShow: function () {

  },
  btn_submit: function (e) {
    var that = this;
    var id = that.data.id;
    var typeNum = that.data.typeNum;
    var information = e.detail.value.information;

    that.setData({
      isDisabled: true
    })

    if (typeNum == 3) {
      if (information == '') {
        that.setData({
          isShowToast: false,
          toastData: '请输入评论内容',
          isDisabled: false
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,

          })


        }, 2000)
      } else {
        that.setData({
          isLoading: false,
          isUpload: true,
        })
        that.addActivityComment(id, information)
      }
    } else if (typeNum == 5) {
      if (information == '') {
        that.setData({
          isShowToast: false,
          toastData: '请输入评论内容',
          isDisabled: false
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,

          })


        }, 2000)
      } else {
        that.setData({
          isLoading: false,
          isUpload: true,
        })
        that.addActivityJLComment(id, information)
      }
    }else if (typeNum == 2) {
      var pics = that.data.pics;
      if (information == '') {
        that.setData({
          isShowToast: false,
          toastData: '请输入评论内容',
          isDisabled:false
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,

          })


        }, 2000)
      } else {
        that.setData({
          information: information
        })

        that.setData({
          isLoading: false,
          isUpload: true,
        })
        if (pics.length > 0) {
          that.uploadimg();
        } else {
          that.setData({
            isLoading: false,
            isUpload: true,
          })
          that.publishActivity(pics);
        }

      }
    } else if (typeNum == 4) {
      if (information == '') {
        that.setData({
          isShowToast: false,
          toastData: '请输入评论内容',
          isDisabled: false
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,

          })


        }, 2000)
      } else {
        that.setData({
          isLoading: false,
          isUpload: true,
        })
        var others = that.data.others;

        that.addActivityHFComment(id, information, others)
      }
    } else if (typeNum == 1) {
      var pics = that.data.pics;
      if (information == '') {
        that.setData({
          isShowToast: false,
          toastData: '请输入评论内容',
          isDisabled: false
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,

          })


        }, 2000)
      }else {
        
        that.setData({
          information: information,
          isLoading: false,
          isUpload: true,
        })
        if (pics.length > 0){
          that.uploadimg();
        }else{
          that.publishActivity(pics);
        }
        
      }
    }
  },
  addActivityComment: function (id, information) {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.addComments,
      data: {
        openid: app.globalData.openId,
        type: 2,
        com_id: id,
        fraction: 1,
        content: information
      },
      success: function (res) {
       
        if (res.data.code == 1) {


          that.setData({
            isShowToast: false,
            toastData: '评论成功',
            isLoading: true,
            isUpload: false,
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true,
              isDisabled: false
            })

            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isLoading: true,
            isUpload: false,
            isDisabled: false
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true,
            })

          }, 2000)
        }
      }
    })
  },
  addActivityHFComment: function (id, information, others) {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.addComments,
      data: {
        openid: app.globalData.openId,
        type: 2,
        com_id: id,
        fraction: 2,
        content: information,
        others: others
      },
      success: function (res) {
     
        if (res.data.code == 1) {


          that.setData({
            isShowToast: false,
            toastData: '回复成功',
            isLoading: true,
            isUpload: false,
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true,

              
              isDisabled: false

            })

            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isLoading: true,
            isUpload: false,
            isDisabled: false
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true,
            })

          }, 2000)
        }
      }
    })
  },
  btn_image_h_p: function (e) {
    var that = this;

    that.setData({
      hpNum: e.currentTarget.dataset.info
    })
  },
  btn_image: function () {

    var that = this,
      pics = this.data.pics;

      if(pics.length < 9){
        wx.chooseImage({
          count: 9 - pics.length,
          success: function (res) {
            console.log(res);
            var imgsrc = res.tempFilePaths;
            pics = pics.concat(imgsrc);
            that.setData({
              pics: pics
            });

            // that.uploadimg(pics);
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
      }else{
        that.setData({
          isShowToast: false,
          toastData: '只能上传9张图片',
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,

          })
        }, 2000)
      }
    
  },
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.pics;
    this.uploadimg1({
      url: app.globalData.urlApi.upLoadImage,//这里是你图片上传的接口
      path: pics//这里是选取的图片的地址数组
    });
  },
  uploadimg1: function (data) {
    
    var that = this,

      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    var namePics = data.namePics ? data.namePics : [];
   
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改

      success: (resp) => {

        var dataName = JSON.parse(JSON.stringify(that.trimKong(resp.data)));

        if (dataName.code == 1) {
          success++;

          namePics.push(dataName.data);

          i++;
          if (i == data.path.length) {   //当图片传完时，停止调用          

            that.publishActivity(namePics);

          } else {//若图片还没有传完，则继续调用函数
            console.log(i);
            data.i = i;
            data.success = success;
            data.fail = fail;
            data.namePics = namePics;
            that.uploadimg1(data);
          }
        }else{
          that.setData({
            isLoading: true,
            isUpload: false,
            isDisabled: false
          })
        }
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;
        console.log('fail:' + i + "fail:" + fail);
      }
    });
  },
  btn_delete: function (e) {

    var that = this;
    var index = e.target.dataset.index;
    var pics = that.data.pics;
   

    for (var i = 0; i < pics.length; i++) {

      if (i == index) {
        pics.splice(i, 1);
        break;
      }
    }

    that.setData({
      pics: pics
    })


  },
  publishActivity: function (namePics) {
    var that = this;
    var information = that.data.information;
    var id = that.data.id;
    var dataRequset = {};
    var hpNum = that.data.hpNum;
    if (namePics.length > 0){
      dataRequset = {
        openid: app.globalData.openId,
        content: information,
        litpic: JSON.stringify(namePics),
        type: 3,
        com_id: id,
        fraction: hpNum
      }
    }else{
      dataRequset = {
        openid: app.globalData.openId,
        content: information,
        type: 3,
        com_id: id,
        fraction: hpNum
      }
    }
    

    wx.request({
      url: app.globalData.urlApi.addComments,
      data: dataRequset,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {

        that.setData({
          isShowToast: false,
          toastData: res.data.msg,
          isLoading: true,
          isUpload: false,

        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
            
            isDisabled: false
          })
          if (res.data.code == 1) {
            wx.navigateBack({
              delta: 1
            })
          }
        }, 2000)


      }
    })
  },
  trimKong: function (s) {

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
  addActivityJLComment: function (id, information) {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.addComments,
      data: {
        openid: app.globalData.openId,
        type: 1,
        com_id: id,
        fraction: 2,
        content: information,
      },
      success: function (res) {
   
        if (res.data.code == 1) {


          that.setData({
            isShowToast: false,
            toastData: '评论成功',
            isLoading: true,
            isUpload: false,
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true,
              isDisabled: false

            })

            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isLoading: true,
            isUpload: false,
            isDisabled: false
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true,
            })

          }, 2000)
        }
      }
    })
  },
})