// pages/choiceRecruitComment/choiceRecruitComment.js
var app = getApp();
Page({
  data: {
    typeNum: 1,
    id: 0,
    isDisabled: false,
    pics: [],
    valueData: {},
    typeInfo: 0
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      typeNum: options.typeNum,
      id: options.id,
      typeInfo: options.typeInfo
    })
  },
  onShow: function() {

  },
  btn_submit: function(e) {
    var that = this;
    var typeNum = that.data.typeNum;
    var requestData = {};
    var id = that.data.id;
    var value = e.detail.value;
    var pics = that.data.pics;
    that.setData({
      valueData: value,
    })
    if (typeNum == 5 || typeNum == 2) {
      if (value.information == '') {
        wx.showToast({
          title: '内容不能为空',
          icon: 'none',
          duration: 2000
        })
      } else {
        // that.setData({
        //   isDisabled: true
        // })
        that.publishActivity(pics);
      }
    } else if (typeNum == 6){
      if (value.information == '') {
        wx.showToast({
          title: '内容不能为空',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (pics.length > 0) {
          that.uploadimg();
        } else {
          that.publishActivity(pics);
        }
      }
    } else {
      if (value.name == '') {
        wx.showToast({
          title: '标题不能为空',
          icon: 'none',
          duration: 2000
        })
      } else if (value.information == '') {
        wx.showToast({
          title: '内容不能为空',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (pics.length > 0) {
          that.uploadimg();
        } else {
          that.publishActivity(pics);
        }
      }
    }
  },
  uploadimg1: function(data) {
    console.log(data);
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    var namePics = data.namePics ? data.namePics : [];
    console.log(data.path[i]);
    if (data.path[i].indexOf('meilihua') == -1) {
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'file', //这里根据自己的实际情况改
        success: (resp) => {
          console.log(resp)
          console.log(i);
          var dataName = JSON.parse(JSON.stringify(that.trimKong(resp.data)));
          if (dataName.code == 1) {
            success++;
            namePics.push(dataName.data);
            console.log(namePics);
            i++;
            if (i == data.path.length) { //当图片传完时，停止调用          
              that.publishActivity(namePics);
            } else { //若图片还没有传完，则继续调用函数
              console.log(i);
              data.i = i;
              data.success = success;
              data.fail = fail;
              data.namePics = namePics;
              that.uploadimg1(data);
            }
          } else {
            that.setData({
              isLoading: true,
              isDisabled: false
            })
            wx.showToast({
              title: '图片上传失败',
              icon: 'none',
              duration: 2000
            })
          }
          //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        },
        fail: (res) => {
          fail++;
          console.log('fail:' + i + "fail:" + fail);
        }
      });
    } else {
      i++;
      if (i == data.path.length) {
        var typeName = that.data.typeName;
        var revise = that.data.revise;
        if (typeName == 1) {
          if (revise == 0) {
            that.publishActivity(namePics);
          } else {
            that.reviseActivity(namePics);
          }
        } else {
          if (revise == 0) {
            that.publishArticle(namePics);
          } else {
            that.reviseArticle(namePics);
          }
        }
      } else {
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        data.namePics = namePics;
        that.uploadimg1(data);
      }
    }
  },
  uploadimg: function() { //这里触发图片上传的方法
    var pics = this.data.pics;
    this.uploadimg1({
      url: app.globalData.urlApi.upLoadImage, //这里是你图片上传的接口
      path: pics //这里是选取的图片的地址数组
    });
  },
  btn_image: function() { //这里是选取图片的方法
    var that = this,
      pics = this.data.pics;
    if (pics.length < 9) {
      wx.chooseImage({
        count: 9 - pics.length,
        success: function(res) {
          var imgsrc = res.tempFilePaths;
          pics = pics.concat(imgsrc);
          that.setData({
            pics: pics
          });
          // that.uploadimg(pics);
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    } else {
      wx.showToast({
        title: '只能上传9张图',
        icon: 'none',
        duration: 2000
      })
    }
  },
  trimKong: function(s) {
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
  publishActivity: function(pics) {
    var that = this;
    var typeNum = that.data.typeNum;
    var requestData = {};
    var id = that.data.id;
    var value = that.data.valueData;
    var typeInfo = that.data.typeInfo;
    console.log(value);
    if (typeNum == 5 || typeNum == 2) {
      requestData = {
        'openid': app.globalData.openId,
        'type': typeNum,
        'com_id': id,
        'content': value.information,
        'others': typeInfo,
      }
    } else {
      if (pics.length <= 0) {
        wx.showModal({
          title: '提示',
          content: '评论需要上传一张图片哦',
          showCancel: false
        })
        return
      }
      requestData = {
        'openid': app.globalData.openId,
        'type': typeNum,
        'com_id': id,
        'content': value.information,
        'title': value.name,
        // 'litpic': pics,
        'litpic': pics.length > 0 ? JSON.stringify(pics) : '',
        // 'others': typeInfo,
      }
      console.log(requestData)
    }
    if (that.data.isDisabled) return
    that.setData({
      isDisabled: true
    })
    wx.showLoading({
      title: '正在提交中..',
    })
    app.requestPost(that, app.baseUrl + '/interface/find/add_comments', requestData, function(res) {
      // app.globalData.urlApi.addChioceComment
      wx.hideLoading()
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        })
        that.setData({
          isDisabled: false
        })
      }, 2000)
    })
  },
  // 图片删除
  btn_delete: function(e) {
    console.log(e);
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
  // 图片预览
  btn_preview: function(e) {
    console.log(e)
    let itemUrl = e.currentTarget.dataset.itemUrl,
      itemArr = e.currentTarget.dataset.itemArr
    for (let i = 0; i < itemArr.length; ++i) {
      itemArr[i] = itemArr[i]
    }
    wx.previewImage({
      current: itemUrl,
      urls: itemArr,
    })
  },
})