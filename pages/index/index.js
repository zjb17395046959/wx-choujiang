// 计数器
var speed=2.0;
let interval = null
// 创建背景音乐
var bgMusic=wx.createInnerAudioContext();
// 创建点击抽奖的音乐
var btn=wx.createInnerAudioContext();
// 创建选中时的音乐
var check_one=wx.createInnerAudioContext();
var check=wx.createInnerAudioContext();
// 创建未中奖或中奖的音乐
var su=wx.createInnerAudioContext();
// 值越大旋转时间约长
let intime =100
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    list: [
      {
        opa:0.9,
        imgUrl: 'http://www.modo5.com/images/gift.png',
        name: "iPad"
      },
      {
        opa: 0.9,
        imgUrl: 'http://www.modo5.com/images/gift.png',
        name: "微信立减金"
      },
      {
        opa: 0.9,
        imgUrl: 'http://www.modo5.com/images/gift.png',
        name: "电视机"
      },
      {
        opa: 0.9,
        imgUrl: 'http://www.modo5.com/images/gift.png',
        name: "冰箱"
      },
      {
        opa: 0.9,
        imgUrl: 'http://www.modo5.com/images/gift.png',
        name: "笔记本"
      },
      {
        opa: 0.9,
        imgUrl: 'http://www.modo5.com/images/gift.png',
        name: "继续努力"
      },
      {
        opa: 0.9,
        imgUrl: 'http://www.modo5.com/images/gift.png',
        name: "擦肩而过"
      },
      {
        opa: 0.9,
        imgUrl: 'http://www.modo5.com/images/gift.png',
        name: "签纸贺"
      },
    ],
    luckPosition: 2,//中奖的位置
    isDisabled: false,//点击按钮不可点
    num:3//抽奖次数
  },
  //点击抽奖按钮
  startLucks() {
    // bgMusic.stop();
    btn.src="/music/btn.mp3";
    btn.play();
    let vm = this
    let {
      luckPosition,
      list,
      isDisabled,
      num
    } = vm.data
    num--;
    luckPosition=parseInt(Math.random()*7);
    console.log(luckPosition)
    if (isDisabled||num<0){
      wx.showToast({
        title: '今日抽奖次数已用完',
        icon:'none'
      })
      return
    }
    if (!isDisabled) {
      btn.stop();
      //判断中奖位置格式
      if (luckPosition == null || isNaN(luckPosition) || luckPosition > 7) {
        wx.showModal({
          title: '提示',
          content: '系统发生错误，请稍后重试',
          showCancel: false
        });
        return;
      }

      //设置按钮不可点击
      vm.setData({
        isDisabled: true,
        num:num
      })
      check_one.src='/music/check_4.mp3';
      // check_one.loop=true;
        // check.play();
        // console.log(check);
      //清空计时器
      clearInterval(interval);
      let index = 0;
      //循环设置每一项的透明度
      interval = setInterval(() => {
        
        if (index > 7) {
          index = 0;
          list[7].opa = 0.9;
          check_one.stop()
        } else if (index != 0) {
          check_one.stop()
          list[index - 1].opa =0.9//这是点击抽奖后，前一个的透明度
        }
        list[index].opa = 1;//当前的是1，透明度
        check_one.play()
        index++;
        vm.setData({
          list
        })
      }, intime);
      //模拟网络请求时间  设为两秒
      var stoptime = 2000;
      setTimeout(() => {
        vm.stop(luckPosition);
      }, stoptime)
    }
  },
  stop(which) {
    let vm = this;
    let {
      list
    } = vm.data

    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    let current = -1;

    for (let i = 0; i < list.length; i++) {
      if (list[i].opa == 1) {
        current = i;
      }
    }
    //下标从1开始
    let index = current + 1;
    vm.stopLuck(which, index, intime, 10);
  },
  stopLuck(which, index, time, splittime) {
    let vm = this;
    let { list } = this.data
   
    //值越大出现中奖结果后减速时间越长
    setTimeout(() => {
      check_one.stop();
      check.src='/music/check_4.mp3';
      // check.playbackRate=1.0
      //重置前一个位置
      if (index > 7) {
        index = 0;
        list[7].opa = 0.9;
        check.stop();
      } else if (index != 0) {
        list[index - 1].opa = 0.9;
        check.stop();
      }
      //当前位置为选中状态
      list[index].opa = 1;
      check.play();
      vm.setData({
        list
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (time < 400 || index != which) {
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        // speed=parseFloat(100/time).toFixed(1);
        // if(speed<0.5){
        //   speed=0.5
        // }
        // console.log(speed+'================sudu');
        // console.log(check);
        /**
         * splittime是后面的动画时间
         */
        vm.stopLuck(which, index, time, splittime);
      } else {
        
        //1秒后显示弹窗
        setTimeout(() => {
          check.stop();
          if (which == 4 || which == 2||which == 0||which == 3||which == 7||which == 1) {//which==this.data.luckPosition就是中奖
            
            su.src="/music/success.mp3";
            su.play();
            //中奖
            wx.showModal({
              content: '恭喜获得：' + list[which].name,
              showCancel: false,
              confirmColor: "#F8C219",
              success: res => {
                if (res.confirm) {
                  //设置按钮可以点击
                  vm.setData({
                    isDisabled: false
                  })
                  list[index].opa = 0.9;
                  su.stop();
                  // vm.loadAnimation();//这是一直转的动画效果
                }
              }
            });
          } else {
            check.stop();
            su.src="/music/success.mp3";
            su.play();
            //未中奖
            wx.showModal({
              content: '很遗憾未中奖',
              showCancel: false,
              confirmColor: "#F8C219",
              success: res => {
                if (res.confirm) {
                  //设置按钮可以点击
                  vm.setData({
                    isDisabled: false
                  })
                  list[index].opa = 0.9;
                  su.stop();
                  // vm.loadAnimation();
                }
              }
            });
          }
        }, 1000);
      }
    }, time);
  },
  loadAnimation() {//就是点击抽奖的动画
    let vm = this;
    let index = 0;
    let {
      list
    } = vm.data

    clearInterval(interval)
    interval = setInterval(() => {
      if (index > 7) {
        index = 0;
        list[7].opa = 0.9
      } else if (index != 0) {
        list[index - 1].opa = 0.9
      }
      list[index].opa = 1;
      index++;
      vm.setData({
        list
      })
    }, 1000);
  },
  // 点击播放图标，显示静音
  bg_play(){
    bgMusic.stop();//停止播放音乐
    this.setData({
      isPlay:true
    })
  },
  //点击静音，播放音乐
  bg_jy(){
    bgMusic.play();//开始播放背景音乐
    this.setData({
      isPlay:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
   this.bg();
  },
  bg(){
    bgMusic.autoplay = true;//自动播放
    bgMusic.loop=true;//循环
    bgMusic.src="/music/bg.mp3";
    bgMusic.onPlay(() => {
      console.log('开始播放')
    })

    bgMusic.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      console.log('播放失败')
    })
  },
  onHide(){
    // bgMusic.stop();
  },
  onShow(){
    if(!this.data.isPlay){
      bgMusic.play();
    }

    
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //清空计时器
    clearInterval(interval);
  }
})