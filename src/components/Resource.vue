<template>
  <v-card class="d-flex flex-column">
      <v-img
        class="flex-shrink-1"
        :src="res.src"
        contain
      />

      <v-card-title class="name">
        <v-input
          hide-details="auto"
          :error-messages="errors"
        >
          <input 
            ref="nameInput"
            v-model="res.name"
            @input="handleNameChange"
          />
        </v-input>
      </v-card-title>

      <v-card-actions>
        <v-btn 
          icon
          @click="deleteSelf"
        ><v-icon>mdi-delete</v-icon></v-btn>

        <v-btn 
          icon
        >
          <v-icon>mdi-share</v-icon>
          <input 
            ref="btnReplace"
            class="fill"
            type="file"
            @input="replaceRes"
          />
        </v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
import state from '@/state.js'

const project = state.project;

export default {
  name: 'Resource',

  props: {
    uid: String,
    res: Object,
  },

  data: () => ({
    data: project.data,
    resources: project.resources,
    errors: null,
  }),

  methods: {
    handleNameChange(event) {
      if (event.target.value.length === 0) {
        this.errors = '名字不可为空';
      } else {
        this.errors = null;
      }
    },

    deleteSelf() {
      const index = project.resources.indexOf(this.uid);
      project.resources.splice(index, 1);
      delete project.data[this.uid];
    },

    replaceRes(event) {
      this.res.src = URL.createObjectURL(event.target.files[0]) || this.res.src;
      this.$forceUpdate();
    },
  }

}
</script>

<style scoped>
.name > * {
  width: 100%;
}

.fill {
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
</style>
