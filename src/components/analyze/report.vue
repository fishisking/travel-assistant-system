<template>
  <div class="header">
    <div class="icon">
      <i :class="[icon]" :style="{color}"></i>
    </div>
    <div class="title">
      <span>{{title}}</span>
      <span class="num">
        {{num+'人'}}
        <span style="font-size:14px">{{returnText(change)}}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "num", "icon", "color", "change"],
  methods: {
    returnText(num) {
      if (num >= 0) {
        return "(较昨日增加" + num +')';
      } else {
        return "(较昨日减少" + (-num) +')';
      }
    }
  }
};
</script>
<style scoped>
.icon {
  width: 80px;
  font-size: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 22px;
  font-weight: 500;
  width: 220px;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
}
.num {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.header {
  background: #fff;
  width: 300px;
  height: 80px;
  display: flex;
  flex-direction: row;
}
</style>
