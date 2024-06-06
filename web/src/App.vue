<script setup lang="ts">
import { provide, reactive } from "vue";
import fileBox from "./components/fileBox.vue";
declare function acquireVsCodeApi(): any;

const workspaceDate:{
  [key:string]:{
    [key:string]: Array<{
      startLine: number,
      endLine: number,
      note: string
    }>
  }
} = reactive({});
// 删除结果处理
interface Arg{
  filePath: string,
  startLine: number,
  endLine: number,
  annotationType:string,
  msg: string
}
const deleteResult = (arg:Arg) => {
  if(arg.msg){
    console.log(arg.msg);
  }
}
// 监听插件发送的消息
window.addEventListener("message", (event) => {
  // 处理消息
  console.log(event);
  
  const arg = event.data.arg
  switch (event.data.command) {
    case "locality":
      Object.assign(workspaceDate, arg);
      break;
    case "updateDate":
      Object.assign(workspaceDate,{
        [arg.filePath]:arg.data
      });
      console.log(workspaceDate, 'workspaceDate');
      
      break;
    case "deleteDate":
      delete workspaceDate[arg.filePath]
      break;
    case "deleteResult":
      deleteResult(arg)
      break;
  }
});

const vscode = acquireVsCodeApi();
// 发送消息给插件
vscode.postMessage({ command: "getLocality" });
provide("vscode", vscode);
</script>

<template>
  <div class="main">
    <template v-for="(item, key) in workspaceDate" :key="key">
      <div class="annotationBox">
        <div class="title">{{ key }}</div>
        <fileBox :itemObj="item" :filePath="key as string" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 360px;
  .annotationBox{
    width: 340px;
    margin: 0 auto 20px;
    .title{
      word-break: break-all;
    }
  }

}
</style>
