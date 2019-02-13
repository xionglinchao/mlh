// pages/commentRelay/commentRelay.js
var app = getApp();
Page({
  data: {
    pics: [],
    isShadow: true,
    isBottomModel: true,
    imageVideo: null,
    isVideo: true,
    isCamera: false,
    isDisabled: false,
    information: null,
    videoUrlName: null,
    id: null,
    isShowToast: true,
    toastData: false
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      id: options.id,
    })
  },
  onShow: function() {

  },
  btn_up_load_image: function() {
    var that = this,
      pics = this.data.pics;
    if (pics.length < 9) {
      wx.chooseImage({
        count: 9 - pics.length,
        success: function(res) {
          for (var i = 0; i < res.tempFiles.length; i++) {
            res.tempFiles[i]['type'] = 1;
          }
          var imgsrc = res.tempFiles;
          pics = pics.concat(imgsrc);
          that.setData({
            pics: pics,
            isShadow: true,
            isBottomModel: true
          });
        },
        fail: function() {},
        complete: function() {}
      })
    } else {
      that.setData({
        isShowToast: false,
        toastData: '只能上传9个文件',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    }
  },
  uploadimg: function() {
    var pics = this.data.pics;
    this.uploadimg1({
      url: app.globalData.urlApi.upLoadImage,
      path: pics,
      videoUrl: app.globalData.urlApi.edit_video,
    });
  },
  uploadimg1: function(data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    var namePics = data.namePics ? data.namePics : [];
    var videoUrlName = data.videoUrlName ? data.videoUrlName : null;
    wx.uploadFile({
      url: data.path[i].type == 1 ? data.url : data.videoUrl,
      filePath: data.path[i].path,
      name: 'file',
      success: (resp) => {
        var dataName = JSON.parse(JSON.stringify(that.trimKong(resp.data)));
        if (dataName.code == 1) {
          success++;
          if (data.path[i].type == 1) {
            namePics.push(dataName.data);
          } else {
            videoUrlName = dataName.data;
          }
          i++;
          if (i == data.path.length) {
            if (videoUrlName) {
              that.publishComment(namePics, videoUrlName);
            } else {
              that.publishComment(namePics, 0);
            }
          } else {
            data.i = i;
            data.success = success;
            data.fail = fail;
            data.namePics = namePics;
            if (videoUrlName) {
              data.videoUrlName = videoUrlName;
            }
            that.uploadimg1(data);
          }
        } else {
          that.setData({
            isLoading: true,
            isUpload: false,
            isDisabled: false
          })
        }
      },
      fail: (res) => {
        fail++;
      }
    });
  },
  btn_delete: function(e) {
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
  btn_up_load_video: function() { //上传视频
    var that = this;
    var pics = that.data.pics;
    if (pics.length >= 1) {
      if (pics[0].type == 2) {
        wx.showModal({
          title: '提示',
          content: '一次只能上传一个视频，是否需要更换视频',
          success: function(res) {
            if (res.confirm) {
              that.chooseVideo(1);
            }
          }
        })
      } else {
        that.chooseVideo(0);
      }
    } else {
      that.chooseVideo(0);
    }
  },
  chooseVideo: function(typNum) {
    var that = this;
    var pics = that.data.pics;
    wx.chooseVideo({
      sourceType: ['album'],
      success: function(res) {
        var picsObj = {};
        picsObj['path'] = res.tempFilePath;
        picsObj['type'] = 2;
        if (typNum == 1) {
          pics[0].path = res.tempFilePath;
        } else {
          pics.unshift(picsObj);
        }
        that.setData({
          pics: pics,
          isShadow: true,
          isBottomModel: true
        })
      },
      fail: function() {

      }
    })
  },
  btn_image: function() {
    var that = this;
    that.setData({
      isShadow: false,
      isBottomModel: false
    })
  },
  btn_shadow: function() {
    this.setData({
      isShadow: true,
      isBottomModel: true
    })
  },
  btn_submit: function(e) {
    var that = this;
    var information = e.detail.value;
    var pics = that.data.pics;
    that.setData({
      isDisabled: true,
    })
    // if (information.information == '') {
    //   that.setData({
    //     isDisabled: false,
    //   })
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入评论文字',
    //   })
    // } else {
    that.setData({
      information: information,
    })
    wx.showLoading({
      title: '正在努力提交中',
    })
    if (pics.length > 0) {
      // if (pics.length > 1) {
      that.uploadimg();
      // } else {
      //   if (pics[0].type == 2) {
      //     that.setData({
      //       isDisabled: false,
      //       isLoading: true
      //     })
      //     wx.hideLoading();
      //     wx.showModal({
      //       title: '提示',
      //       content: '亲～，上传视频需要上传一张图片哦',
      //     })
      //   } else {
      //     that.uploadimg();
      //   }
      // }
    } else {
      that.publishComment(pics);
    }
    // }
  },
  publishComment: function(pics, videoImageUrl) {
    var that = this;
    var information = that.data.information;
    var dataRequest = {};
    var id = that.data.id;
    wx.request({
      url: app.globalData.urlApi.addComments,
      data: {
        openid: app.globalData.openId,
        type: 2,
        com_id: id,
        fraction: 1,
        content: information.information,
        litpic: pics.length > 0 ? pics : '',
        video: videoImageUrl != 0 ? videoImageUrl : ''
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.hideLoading();
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isDisabled: false
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
            })
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else {
          wx.hideLoading();
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isDisabled: false
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
            })
          }, 2000)
        }
      }
    })
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
  btn_up_load_cancel: function() {
    this.setData({
      isShadow: true,
      isBottomModel: true
    })
  },
  // 评论/征集 图片预览
  btn_preview: function(e) {
    console.log(e)
    let itemUrl = e.currentTarget.dataset.itemUrl,
      itemArr = e.currentTarget.dataset.itemArr,
      imgUrls = []
    for (let i = 0; i < itemArr.length; ++i) {
      imgUrls.push(itemArr[i].path)
    }
    wx.previewImage({
      current: itemUrl,
      urls: imgUrls,
    })
  },
})