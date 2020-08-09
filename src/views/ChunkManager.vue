<template>
  <div class="fill d-flex">

    <!-- 左侧文本段列表 -->
    <v-navigation-drawer permanent>
      <v-list>
        <v-list-item-group v-model="chunkIndex">
          <v-list-item
            v-for="chunkTitle of chunkTitleList"
            :key="chunkTitle.uid"
          >{{ chunkTitle.title }}</v-list-item>
        </v-list-item-group>
      </v-list>

      <!-- 添加新文本段的按键 -->
      <div class="mx-5">
          <v-btn
            block
            @click="addChunk"
          >
            <v-icon>mdi-plus</v-icon>
            新文本段
          </v-btn>
        </div>
    </v-navigation-drawer>
    

    <div class="content flex-grow-1 d-flex flex-column">
      <!-- 文本段主体 -->
      <div class="chunk-wrapper flex-grow-1">
        <Chunk 
          v-if="chunk"
          class="chunk"
          :chunk="chunk"
          :index="chunkIndex"
        />
      </div>
      
      <!-- 上一页 -->
      <div 
        v-if="hasPrevPage"
        class="page-changer prev-page px-2 d-flex align-center"
        @click="toPrevPage"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </div>

      <!-- 下一页 -->
      <div 
        v-if="hasNextPage"
        class="page-changer next-page px-2 d-flex align-center"
        @click="toNextPage"
      >
        <v-icon>mdi-arrow-right</v-icon>
      </div>

      <!-- 编辑器工具栏 -->
      <!-- <ChunkEditorBar
        v-if="chunkIndex !== null"
        class="chunk-editor-bar pa-2"
      /> -->
    </div>
  </div>
</template>

<script>
import Chunk from '@/components/Chunk.vue'
// import ChunkEditorBar from '@/components/ChunkEditorBar.vue'

import state from '@/state.js'

const project = state.project;

export default {
  name: 'ChunkManager',

  components: {
    Chunk,
    // ChunkEditorBar
  },

  data:() => ({
    chunkIndex: null,
    chunk: null,
    chunks: project.chunks,
    data: project.data,
  }),

  watch: {
    chunkIndex(index) {
      if ('number' === typeof index) {
        const uid = project.chunks[index];
        if (uid) {
          this.chunk = project.data[uid];
          return;
        }
      }
      this.chunk = null;
    }
  },

  computed: {
    chunkTitleList() {
      return this.chunks.map(uid => ({uid, title: this.data[uid].title}));
    },

    hasPrevPage() {
      return 'number' === typeof this.chunkIndex && this.chunkIndex > 0;
    },

    hasNextPage() {
      return 'number' === typeof this.chunkIndex && this.chunkIndex < project.chunks.length - 1;
    },
  },

  methods: {

    addChunk() {
      this.chunks.push(project.addData({
        title: '文本段标题',
        subtitle: '',
        background: null,
        bgm: null,
        sections: [{speaker: null, text: ''}],
        exits: [],
      }));
      this.$forceUpdate();
    },

    toPrevPage() {
      this.chunkIndex--;
    },

    toNextPage() {
      this.chunkIndex++;
    },
  },
}
</script>

<style scoped>

.fill {
  width: 100%;
  height: 100%;
}

.content {
  overflow: hidden;
  position: relative;
}

.content > .chunk-wrapper {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.content > .chunk-wrapper > * {
  width: 100%;
}

.page-changer {
  height: 75%;
  position: absolute;
  top: 5em;
  z-index: 2;
  cursor: pointer;
  transition: background-color 500ms;
}

.page-changer:hover {
  background-color: #0000000F;
}

.prev-page {
  left: 0;
}

.next-page {
  right: 0;
}

.chunk-editor-bar {
  z-index: 4;
  background-color: #FFFFFF;
}
</style>