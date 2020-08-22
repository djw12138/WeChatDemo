var countTooGetLocation = 0;
var total_micro_second = 0;
var starRun = 0;
var totalSecond = 0;
var oriMeters = 0.0;
var runTimer;//跑步定时器
/* 毫秒级倒计时 */
function count_down(that) {
  console.log("定时执行！");
  if (starRun == 0) {
    return;
  }
  console.log("定时执行2！");
  if (countTooGetLocation >= 100) {
    var time = date_format(total_micro_second);
    that.updateTime(time);
  }

  if (countTooGetLocation >= 5000) { //1000为1s
    that.getLocation();
    countTooGetLocation = 0;
  }
}


// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;


  return hr + ":" + min + ":" + sec + " ";
}


function getDistance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lng1) - toRadians(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;

  function toRadians(d) { return d * Math.PI / 180; }
}

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

// pages/run/run.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mileage: 0,//里程数
    timeInterval: 0,//时间间隔
    latitude: 0,//纬度
    longitude: 0,//经度
    markers: [],
    covers: []
  },

  /**
   * 打开地图
   */
  openLocation: function () {
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        wx.openLocation({
          latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
          longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
          scale: 28, // 缩放比例
        })
      },
    })
  },

  /**
   * 获取本地位置
   */
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log(res, res);

        //make datas 
        var newCover = {
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '/icons/redPoint.png',
        };
        var oriCovers = that.data.covers;

        console.log("oriMeters----------")
        console.log(oriMeters);
        var len = oriCovers.length;
        var lastCover;
        if (len == 0) {
          oriCovers.push(newCover);
        }
        len = oriCovers.length;
        var lastCover = oriCovers[len - 1];

        console.log("oriCovers----------")
        console.log(oriCovers, len);

        var newMeters = getDistance(lastCover.latitude, lastCover.longitude, res.latitude, res.longitude) / 1000;

        if (newMeters < 0.0015) {
          newMeters = 0.0;
        }

        oriMeters = oriMeters + newMeters;
        console.log("newMeters----------")
        console.log(newMeters);


        var meters = new Number(oriMeters);
        var showMeters = meters.toFixed(2);

        oriCovers.push(newCover);

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [],
          covers: oriCovers,
          mileage: showMeters,
        });
      },
    })
  },

  /**
   * 开始跑步
   */
  starRun: function () {
    if (starRun == 1) {
      return;
    }
    starRun = 1;
    //count_down(this);

    console.log("runTimer", runTimer);
    //开启定时
    runTimer = setTimeout(function () {
      countTooGetLocation += 10;
      total_micro_second += 10;
      count_down(this);
    }, 10);

    console.log(runTimer);
    this.getLocation();
  },


  /**
   * 停止跑步
   */
  stopRun: function () {
    starRun = 0;
    count_down(this);
    clearTimeout(runTimer);
  },


  /**
   * 更新时间间隔
   * @param {*} time 
   */
  updateTime: function (time) {

    var data = this.data;
    data.timeInterval = time;
    this.data = data;
    this.setData({
      timeInterval: time,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前位置
    this.getLocation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})