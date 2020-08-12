<template>
  <div class="home d-flex flex-column justify-space-around align-center">
    <v-card class="script-info pa-5">
      <v-text-field 
        label="剧本名："
        v-model="info.name"
      />

      <v-text-field 
        label="版本："
        v-model="info.version" 
      />

      <v-combobox
        label="创作者："
        chips
        multiple
        clearable
        deletable-chips
        disable-lookup
        v-model="info.authors"
      />
    </v-card>

    <div>
      <v-btn @click="saveProject">
        <v-icon>mdi-download</v-icon>保存项目
      </v-btn>

      <v-btn @click="compile">
        <v-icon>mdi-arrow-right</v-icon>编译
      </v-btn>

      <v-btn @click="compile">
        <v-icon>mdi-download</v-icon>下载脚本
      </v-btn>

      <v-btn>
        <v-icon>mdi-upload</v-icon>

        <span>导入项目</span>

        <input class="fill" type="file" @input="loadProject" />
      </v-btn>
    </div>

    <article>
      <h1>江奶奶的Galgame编辑器</h1>

      <h2>食用方法</h2>
      
      <h3>开始项目</h3>

      <ol>
        <li>首先在顶部导航栏点击“资源”，上传所需的各种资源（主要是图片），其它资源暂时不支持预览。</li>

        <li>然后再顶部导航栏点击“角色”，在左侧列表中点击“+新角色”按键，然后填充名字、头像、立绘。其中头像只是方便后续文本编辑，并不会对编译后的脚本呢产生影响。</li>

        <li>然后在顶部导航栏点击“台词”，在左侧列表中点击“+新文本段”按键，点击右边面板左上角的三条横杠（<v-app-bar-nav-icon/>）按钮，填充该文本段所需的信息，而后即可收起信息面板，编辑台词</li>

        <li>回到“主页”，点击“保存项目”<del>（或者在任何页面按下 <em>ctrl</em> + <em>S</em>缓存，或者<em>ctrl</em> + <em>shift</em> + <em>S</em>下载）</del>。</li>

        <li>点击“编译”生成脚本，而后可以选择“下载脚本”或者到“演示面板”开始测试。</li>
      </ol>
    </article>
  </div>
</template>

<script>
import state from '@/state.js'

import {
  saveProject,
  compile,
  downloadScript,
  loadProject,
  fillProject,
} from "@/utils/actions.js";

export default {
  name: "Home",

  data: () => state.project,

  methods: {
    saveProject,
    compile,
    downloadScript,
    loadProject,
    fillProject,
  },
}
</script>

<style scoped>
.home {
  height: 100%;
  overflow: auto;
}

.script-info {
  width: 80%;
}

.fill {
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
</style>
