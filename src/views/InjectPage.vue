<template>
  <div class="overflow-hidden fill d-flex flex-column">

    <div class="d-flex align-center pa-5">
      <v-chip class="mx-2">
          <span class="text-subtitle-1 mx-2">初选角色</span>
          <RoleSelector v-model="primaryRoleUid"/>
      </v-chip>

      <v-chip class="mx-2">
          <span class="text-subtitle-1 mx-2">次选角色</span>
          <RoleSelector v-model="secondaryRoleUid"/>
      </v-chip>

      <v-chip class="mx-2">
        <span>新文本段</span>
        <v-switch
          v-model="newChunk"
        />
      </v-chip>

      <v-chip class="mx-2">
          <span class="text-subtitle-1 mx-2">插入章节</span>
          <v-select 
            v-model="chunkUid"
            :items="chunkList"
            item-text="title"
            item-value="uid"
            no-data-text="无可用章节"
            :disabled="newChunk"
          />
      </v-chip>
      
      <v-btn-toggle dense rounded>
          <v-btn @click="inject">注入</v-btn>
          <v-btn @click="text = ''">清空</v-btn>
      </v-btn-toggle>
    </div>

    <div class="overflow-auto flex-grow-1 px-5">
      <v-textarea
        class="fill ma-0"
          height="100%"
          auto-grow
          hide-details
          dense
          v-model="text"
          no-resize
      />
    </div>

    <v-snackbar 
      v-model="hasMessage"
      :timeout="2000"
    >{{ message }}</v-snackbar>
  </div>
</template>

<script>
import RoleSelector from '@/components/RoleSelector.vue'

import state from '@/state.js'

export default {
  name: 'InjectPage',

  components: {
    RoleSelector
  },

  data: () => ({
      text: '',
      hasMessage: false,
      message: null,
      newChunk: false,
      chunkUid: null,
      primaryRoleUid: null,
      secondaryRoleUid: null,
  }),

  computed: {
    chunkList() {
      const data = state.project.data;
      return state.project.chunks.map(uid => ({uid, title: data[uid].title}));
    },
  },

  methods: {
      inject() {
          if (/^\s*$/g.test(this.text)) {
            this.showMessage('输入文本不可为空!');
            return;
          }

          const sections = this.text
          .split(/[\n\r](\s*[\n\r])?/)
          .filter(s => s && s.length)
          .map((s, i) => ({speaker: (i % 2) ? this.secondaryRoleUid : this.primaryRoleUid, text: s}))
          ;

          if (this.newChunk) {
            state.project.chunks.push(state.project.addData({
              title: '注入文本',
              subtitle: '',
              background: null,
              bgm: null,
              sections,
              exits: [],
            }));
          } else {
            const chunk = state.project.data[this.chunkUid];
            if (chunk) {
              chunk.sections.push(...sections);
            } else {
              this.showMessage('不存在指定文本段');
              return;
            }
          }

          this.showMessage(`向【${this.newChunk ? '新文本段' : state.project.data[this.chunkUid].title}】注入文本${sections.length}条`);
      },

      showMessage(msg) {
        this.message = msg;
        this.hasMessage = true;
      },
  }
}
</script>

<style scoped>

.fill {
    width: 100%;
    height: 100%;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-auto {
  overflow: auto;
}

</style>
