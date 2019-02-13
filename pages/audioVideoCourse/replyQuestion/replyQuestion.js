const app = getApp()

Page({
  data: {
    typeNum: 0,
    isDisabled: false,
    pics: [],
    valueData: {},
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      typeNum: 0,
      'quesId': options.quesId || null,
      'courseId': options.courseId || null
    })
  },
  onShow: function () {
    this.getQuestionInfo()
  },
  // 提交事件
  btn_submit: function (e) {
    console.log(e)
    var that = this;
    var requestData = {};
    var pics = that.data.pics;
    var value = e.detail.value
    that.setData({
      valueData: value,
    })

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

  },
  uploadimg1: function (data) {
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
  //这里触发图片上传的方法
  uploadimg: function () {
    var pics = this.data.pics;
    this.uploadimg1({
      url: app.globalData.urlApi.upLoadImage, //这里是你图片上传的接口
      path: pics //这里是选取的图片的地址数组
    });
  },
  //这里是选取图片的方法
  btn_image: function () {
    var that = this,
      pics = this.data.pics;
    if (pics.length < 3) {
      wx.chooseImage({
        count: 3 - pics.length,
        success: function (res) {
          var imgsrc = res.tempFilePaths;
          pics = pics.concat(imgsrc);
          console.log('111111111', pics)
          that.setData({
            pics: pics
          });
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    } else {
      wx.showToast({
        title: '只能上传3张图',
        icon: 'none',
        duration: 2000
      })
    }
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
  publishActivity: function (pics) {
    var that = this;
    var requestData = {};
    var value = that.data.valueData;
    console.log('value', value);
    // if (pics.length <= 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '评论需要上传一张图片哦',
    //     showCancel: false
    //   })
    //   return
    // }
    requestData = {
      'openid': app.globalData.openId,
      'id': that.data.courseId,
      'content': value.information,
      'litpic': pics.length > 0 ? JSON.stringify(pics) : '',
      'parent_id': that.data.quesId
    }
    console.log(requestData)

    if (that.data.isDisabled) return
    that.setData({
      isDisabled: true
    })
    wx.showLoading({
      title: '正在提交中..',
    })
    app.requestPost(that, app.baseUrl + '/interface/Course/column_audio_question', requestData, function (res) {
      wx.hideLoading()
      if(res.data.err_code == 1) {
        wx.showToast({
          title: '回复成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
          that.setData({
            isDisabled: false
          })
        }, 2000)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 图片删除
  btn_delete: function (e) {
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
  // 获取提问内容
  getQuestionInfo() {
    let self = this, url = `${app.baseUrl}/interface/Course/get_column_audio_question`, data = {}
    data = {
      id: self.data.quesId
    }
    app.wxRequest(url, data, (res) => {
      console.log('提问内容', res)
      if(res.data.err_code == 1) {
        res.data.data.litpic[0] = app.ossImgUrl + res.data.data.litpic[0]
        self.setData({
          'quesCont': res.data.data
        })
      }
    })
  },
})