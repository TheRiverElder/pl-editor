<template>
  <v-app id="app">
    <v-app-bar 
      app 
      color="primary"
    >
      <!-- <v-tabs 
        class="flex-grow-0 flex-shrink-1 width-fit"
        style="width: fit-content"
        v-model="currentPageIndex" 
        color="white"
      >
        <v-tab 
          v-for="link of links"
          :key="link.to"
          :to="link.to"
          class="white--text"
        >{{ link.text }}</v-tab>
      </v-tabs>

      <v-card 
        class="flex-grow-1 pa-2 ma-2"
        flat
      >
        <v-icon class="mr-2">mdi-information-outline</v-icon>
        <span class="grey--text">{{ messages[messages.length - 1] }}</span>
      </v-card> -->
    </v-app-bar>

    <v-main class="fill-y">
      <!-- <router-view/> -->
      <Editor class="fill-y" />
    </v-main>
  </v-app>
</template>

<script>
import state from '@/state.js';
import { saveProject } from '@/utils/actions.js';
import Editor from './views/Editor.vue';

export default {
  name: 'App',

  components: {
    Editor,
  },

  data: () => ({
    links: [
      {to: '/', text: '主页'},
      {to: '/resource-manager', text: '资源'},
      {to: '/role-manager', text: '角色'},
      {to: '/chunk-manager', text: '台词'},
      {to: '/inject-page', text: '注入'},
      {to: '/demonstration', text: '演示'},
    ],

    currentPageIndex: 0,

    messages: state.messages,
  }),

  created() {
    window.addEventListener('keydown', (event) => {
      if(event.key === 's' && event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();
        saveProject(event.shiftKey);
      }
    })
  }
};
</script>

<style>

  html, body, #app {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .width-fit {
    width: fit-content;
  }

  .fill-y,
  .inner-fill-y > * {
    height: 100%;
  }

  input[type=text] {
    padding: 5px;
  }
</style>