<template>
  <div>
    <section>
      <div class="container-size">
        <div v-for="item in selectArrays" :key="item.title">
          <div class="title">{{ item.title }}</div>
          <div class="multi-select">
            <el-checkbox-group v-model="item.selected" @change="valueChange">
              <el-checkbox v-for="option in item.multiSelectArray" :key="option" :label="option"/>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="container-size">
        <div class="title">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"/>
          <span>设备列表  (共</span>
          <span>{{ devices.length }}</span>
          <span>台设备)</span>
        </div>
        <div class="multi-select">
          <el-checkbox-group v-model="selectDevice" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="device in devices" :label="device.deviceId" :key="device.deviceId" style="width:100%;">
              <span>{{ device.deviceName }}</span>
              <span style="margin-left: 15px;color: #bfcbd9">{{ device.deviceAndroidVersion }}</span>
              <span style="margin-left: 15px;color: #bfcbd9">{{ device.deviceRatio }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="container-size">
        <div class="title">
          <span>搜索已选</span>
          <span>{{ selectDevice.length }}</span>
          <span>台设备</span>
        </div>
        <div class="multi-select">
          <el-collapse v-for="item in models" :key="item.name" v-model="activeNames">
            <el-collapse-item :title="item.title" :name="item.name">
              <div v-for="device in item.devices" :key="device.deviceId">
                <div class="device">
                  <div>
                    <span>{{ device.deviceName }}</span>
                    <span>{{ device.deviceAndroidVersion }}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </section>
    <section style="margin-top: 15px;">
      <el-button @click="deleteDevice">取消</el-button>
      <el-button type="primary" @click="sureDevice">确定</el-button>
    </section>
  </div>
</template>
<script>
import { deepClone } from '@/utils/common'
import { mapGetters } from 'vuex'
export default {
  props: {
    // 多选传入
    selectArrays: {
      default: function() {
        return []
      },
      type: Array
    },
    // 设备传入
    devices: {
      default: function() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      allDevice: [], // 所有设备ID
      checkAll: false,
      isIndeterminate: false,
      models: [], // 品牌
      activeNames: [],
      modelsName: []
    }
  },
  computed: {
    ...mapGetters([
      'commit',
      'selectDevices'
    ]),
    selectDevice: {
      get() {
        return this.selectDevices
      },
      set(val) {
        this.$store.dispatch('SetDevices', val)
      }
    }
  },
  watch: {
    devices(val) {
      this.getAllDeviceId()
    }
  },
  mounted() {
    this.getAllDeviceId()
    this.modelsName = this.selectArrays[0].multiSelectArray
    this.handleCheckedCitiesChange(this.selectDevices)
  },
  methods: {
    // 取消时删除设备
    deleteDevice() {
      this.handleCheckAllChange(false)
      this.checkAll = false
      this.$emit('closeDevice')
    },
    // 确认选择设备
    sureDevice() {
      this.$emit('closeDevice')
    },
    // 多选选择值改变
    valueChange() {
      this.$emit('valueChange', this.selectArrays)
      this.modelsName = []
      if (this.selectArrays[0].selected.length === 0) {
        this.modelsName = this.selectArrays[0].multiSelectArray
      } else {
        this.modelsName = this.selectArrays[0].selected
      }
    },
    // 全选或者全不选
    handleCheckAllChange(val) {
      this.selectDevice = val ? this.allDevice : []
      this.isIndeterminate = false
      this.filterModel()
    },
    // 多选值改变时执行
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.allDevice.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allDevice.length
      this.filterModel()
    },
    // 获取所有的设备ID
    getAllDeviceId() {
      this.allDevice = []
      for (let i = 0; i < this.devices.length; i++) {
        this.allDevice.push(this.devices[i].deviceId)
      }
    },
    // 为展示筛选并生成所需的对象数组
    filterModel() {
      var modelsArray = []
      var sort = 1
      for (let i = 0; i < this.modelsName.length; i++) {
        var total = 0
        var deviceModel = {
          name: sort,
          devices: []
        }
        for (let j = 0; j < this.devices.length; j++) {
          for (let k = 0; k < this.selectDevice.length; k++) {
            if (this.selectDevice[k] === this.devices[j].deviceId && this.modelsName[i] === this.devices[j].deviceManufacturer) {
              deviceModel.devices.push(this.devices[j])
              total += 1
            }
          }
        }
        deviceModel.title = '共有' + total + '台' + this.modelsName[i]
        if (deviceModel.devices.length > 0) {
          modelsArray.push(deepClone(deviceModel))
          sort += 1
        }
      }
      this.models = modelsArray
    }
  }
}
</script>
<style lang="scss" scoped>
section{
  display: flex;
  flex-direction: row;
  justify-content: center;
  max-height: 500px;
  .container-size{
    flex: 1;
    margin: 0px 7.5px;
    border: 1px solid #aaa;
    border-radius: 4px;
    overflow-y: auto;
    overflow-x: hidden;
    .title{
      width: 100%;
      height: 45px;
      line-height: 45px;
      padding-left: 15px;
      background-color: grey;
    }
    .multi-select{
      padding-left: 15px;
      .el-checkbox-group{
        display: flex;
        align-items: center;
        flex-flow: row wrap;
        .el-checkbox{
          margin:7.5px 0px;
          width: 33%;
        }
      }
      .el-collapse{
        .el-collapse-item{
          .device{
            margin: 7.5px 0px;
            width: 100%;
            span{
              margin-left: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
