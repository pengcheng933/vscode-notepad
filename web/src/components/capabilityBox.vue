<template>
  <div class='capabilityBox'>
    <template v-for="item in itemArr" :key="item.startLine+ '' + item.endLine ">
        <div class="note" v-if="item.note">{{ item.note }}</div>
        <div>{{ item.startLine }}</div>
        <div>{{ item.endLine }}</div>
        <button @click="deleteAnnotation(item.startLine, item.endLine)">删除</button>
    </template>
  </div>
</template>

<script setup lang="ts">
import {inject} from 'vue'
const props = defineProps({
    itemArr:Array<{
        startLine:number,
        endLine:number,
        note: string
    }>,
    annotationType: String,
    filePath: String
})
const vscode = inject('vscode') as any
const deleteAnnotation = (startLine:number, endLine:number) => {
    // 发送消息给插件
    vscode.postMessage({ command: 'delete',arg:{
        annotationType: props.annotationType,
        filePath: props.filePath,
        startLine,
        endLine
    }})
}
</script>
<style scoped lang='less'>
</style>