<template>
  <v-app id="app">
    <v-app-bar app color="primary">
      <v-tabs 
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
    </v-app-bar>

    <v-main class="fill-y">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

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
  }),

};
</script>

<style>
  html, body, #app {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .fill-y {
    height: 100%;
  }

  input[type=text] {
    padding: 5px;
  }
</style>