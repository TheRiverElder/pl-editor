<template>
  <v-container 
    class="resource-manager d-flex flex-wrap"
    @dragover="overlay = true"
    @dragend="overlay = false"
    @drop="handleDrop"
  >
      <Resouece 
        class="resource ma-3"
        v-for="uid of resources"
        :key="uid"
        :uid="uid"
        :res="data[uid]"
      />
      <v-card class="resource ma-3 d-flex flex-column">
        <div class="input-wrapper flex-grow-1 flex-shrink-1 d-flex justify-center align-center">
          <v-icon x-large>mdi-file-multiple</v-icon>
          <input 
            type="file"
            multiple 
            @change="inputFiles"
          />
        </div>
        <v-card-subtitle>拖拽或点击输入文件</v-card-subtitle>
      </v-card>

      <v-overlay
        :value="false"
        class="fill ma-auto"
        absolute
      >
        <div class="overlay input-wrapper d-flex flex-column justify-center align-center">
          <v-icon size="100">mdi-file-multiple</v-icon>

          <p class="mt-10">松开鼠标以输入文件</p>

          <input 
            type="file"
            multiple 
            @change="inputFiles"
          />
        </div>
      </v-overlay>
  </v-container>
</template>

<script>
import Resouece from '@/components/Resource.vue'

import state from '@/state.js'

const project = state.project;

export default {
  name: 'ResourceManager',

  components: {
    Resouece
  },

  data: () => ({
    resources: project.resources,
    data: project.data,
    overlay: false,
  }),

  methods: {
    inputFiles(event) {
      event.target.files.forEach(file => {
        const dotIndex = file.name.lastIndexOf('.');
        const name = dotIndex >= 0 ? file.name.slice(0, dotIndex) : file.name;

        const reader = new FileReader();
        reader.onload = () => {
          project.resources.push(project.addData({
            name,
            src: reader.result
          }));
        }
        reader.readAsDataURL(file);
      });
    },

    handleDrop(event) {
      console.log('ecent', event);
      this.overlay = false;
    }
  },
}
</script>

<style scoped>

.resource-manager > * {
  width: 10rem;
  height: 16em;
}

.input-wrapper {
  position: relative;
}

.input-wrapper > input[type=file] {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  user-select: none;
  cursor: pointer;
}

.fill {
  width: 100%;
  height: 100%;
}

.overlay {
  width: 90vw;
  height: 80vh;
  border: #FFFFFF dashed .1em;
  border-radius: 1em;
}
</style>