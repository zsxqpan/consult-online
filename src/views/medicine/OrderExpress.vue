<script setup lang="ts">
import { getMedicalOrderLogistics } from '@/api/medicine'
import type { Express } from '@/types/medicine'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
//高德地图依赖
import carImg from '@/assets/car.png'
import startImg from '@/assets/start.png'
import endImg from '@/assets/end.png'

// 获取物流信息
const express = ref<Express>()
const route = useRoute()
onMounted(async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  express.value = res
  console.log('物流信息',res);
})
//绘制高德地图物流轨迹
// v2.0 需要配置安全密钥jscode
window._AMapSecurityConfig = {
  securityJsCode: 'b7f582cb0364f93cf145fa03a9a2090a'
}
onMounted(async () => {
  try {
    const AMap=await AMapLoader.load({
      key: 'c3843242436b9b05f0117349c1599d4f',
      version: '2.0'
    })
    console.log('高德地图',AMap);
    const map = new AMap.Map("map",{ //设置地图容器id
      zoom:12, //初始化地图级别,2-20,越大初始显示越详细，
      center:[116.397428,39.98923],//初始化地图中心点
      mapStyle: 'amap://styles/whitesmoke' // 设置地图样式
    });
    AMap.plugin('AMap.Driving', () => {
      const driving = new AMap.Driving({
        map: map, // 指定轨迹显示地图实例
        showTraffic: false, // 关闭交通状态
        hideMarkers: true//隐藏默认图标
      })

      // var startLngLat = [116.38, 39.87]
      // var endLngLat = [116.37, 40.1]
      // == 替换真实物流坐标数据 ==
      // 第一个是起始坐标，第二个是终点坐标， 第三个是路途中的经纬度坐标， 第四个规划好了的回调函数
      // 1. 使用经纬度数组中的第一个数据：起始坐标
     const start = express.value?.logisticsInfo.shift()
      // 2. 使用经纬度数组中的最后一个数据：结束坐标
      const end = express.value?.logisticsInfo.pop()
     // 3. 途径点坐标：express.value?.logisticsInfo shift和pop后剩余未途经点坐标，处理成二维数据
      const road = express.value?.logisticsInfo.map((item) => [item.longitude, item.latitude])

      // 自定义开始结束位置图片
      const startMarker = new AMap.Marker({
        icon: startImg, // 设置自定义图片
        position: [start?.longitude, start?.latitude] ,// 图片显示的坐标位置
        map:map
      })
      const endMarker = new AMap.Marker({
        icon: endImg,
        position: [end?.longitude, end?.latitude],
        map:map
      })
      driving.search(
       [start?.longitude, start?.latitude],
       [end?.longitude, end?.latitude],
        {
          waypoints: road  // 显示途经点坐标
        },
        function (status: string, result: object) {
          // 未出错时，result即是对应的路线规划方案
          const currentMarker = new AMap.Marker({
            icon: carImg,
            position: [
              express.value?.currentLocationInfo.longitude,
              express.value?.currentLocationInfo.latitude
            ],
            anchor: 'center', // 设置基于坐标点显示的位置
            map:map
          })
          setTimeout(() => {
            map.setFitView([currentMarker,endMarker])
            map.setZoom(10)
          }, 2000)
        }
      )
    })
  } catch (error) {
    console.log(error);
    
  }
})
</script>

<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ express?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">{{ express?.statusValue }}--预计{{express?.estimatedTime}}送达</p>
        <p class="predict">
          <span>{{ express?.name }}</span>
          <span>{{ express?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in express?.list" :key="item.id">
          <p class="status" v-if="item.statusValue">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
