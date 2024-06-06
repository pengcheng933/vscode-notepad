<template>
  <div class='fileBox'>
    <template v-for="(itemArr,key) in itemObj" :key="key">
        <div>
            <div>{{key}}</div>
            <capabilityBox :itemArr="itemArr" :annotationType="key" :filePath="filePath"/>
        </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import capabilityBox from './capabilityBox.vue'
defineProps({
    itemObj:Object,
    filePath: String
})
</script>
<style scoped lang='less'>
</style>