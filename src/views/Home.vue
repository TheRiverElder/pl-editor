<template>
  <div class="home d-flex flex-column justify-space-around align-center">

    <v-card class="script-info pa-5">
      <v-input
        label="剧本名："
      >
        <input v-model="info.name"/>
      </v-input>
      
      <v-input
        label="版本："
      >
        <input v-model="info.version"/>
      </v-input>

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
      <v-btn @click="saveProject"><v-icon>mdi-download</v-icon>保存项目</v-btn>

      <v-btn @click="compile"><v-icon>mdi-arrow-right</v-icon>编译</v-btn>

      <v-btn>
        <v-icon>mdi-upload</v-icon>导入项目
        
        <input
          class="fill"
          type="file"
          @input="loadProject"
        />
      </v-btn>
    </div>
  </div>
</template>

<script>
import download from 'downloadjs'
import state from '@/state.js'

const project = state.project;

export default {
  name: 'Home',

  data: () => state.project,

  methods: {
    saveProject() {
      download(JSON.stringify(state.project), state.project.info.name + '.proj.json', 'application/json');
    },

    compile() {
      const mapping = {};

      const resources = project.resources.map(uid => project.data[uid].src);
      project.resources.forEach((uid, index) => mapping[uid] = index);

      const roles = project.roles.map(uid => {
        const role = project.data[uid]
        return {
          name: role.name,
          avatar: mapping[role.avatar],
          pic: mapping[role.pic],
        };
      });
      project.roles.forEach((uid, index) => mapping[uid] = index);


      const instructions = [];
      project.chunks.map(uid => {
        const chunk = project.data[uid];
        mapping[uid] = instructions.length;
        instructions.push(
          ['bg', mapping[chunk.background]],
          ['bgm', mapping[chunk.bgm]],
          ...chunk.sections.map(s => ['line', s.text, mapping[s.speaker]]),
          ...chunk.exits.map(e => ['exit', e.text, mapping[e.target]]),
        );
      });

      instructions.forEach(ins => {
        if (ins[0] === 'exit') {
          ins[2] = mapping[ins[2]];
        }
      });

      const data = {
        info: project.info,
        instructions,
        resources,
        roles,
      };

      state.script = data;

      download(JSON.stringify(data), state.project.info.name + '.json', 'application/json');
    },

    loadProject(event) {
      const reader = new FileReader();
      reader.onload = () => this.fillProject(JSON.parse(reader.result));
      reader.readAsText(event.target.files[0]);
    },

    fillProject(proj) {
      if (proj) {
        Object.assign(project, proj);
        this.$forceUpdate();
      }
    },
  },
}
</script>

<style scoped>
.home {
  height: 100%;
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
