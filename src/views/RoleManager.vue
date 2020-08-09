<template>
  <div
    class="fill d-flex"
  >
      <!-- 侧边角色列表 -->
      <v-navigation-drawer 
        class="role-list"
        permanent
      >
        <v-list>
          <v-list-item-group v-model="roleIndex">
            <v-list-item
              v-for="roleUid of roles"
              :key="roleUid"
            >
              <RAvatar
                class="mr-5"
                :src="getAvatarUrl(roleUid)"
                size="2em"
              />
              {{ data[roleUid].name }}
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <!-- 添加新角色的按键 -->
        <div class="mx-5">
          <v-btn
            block
            @click="addRole"
          >
            <v-icon>mdi-plus</v-icon>
            新角色
          </v-btn>
        </div>
      </v-navigation-drawer>

      <!-- 角色展示 -->
      <div
        v-if="role"
        class="role ma-5 d-flex flex-column align-center"
      >
        <div class="input d-flex align-start">
          <!-- 角色名字 -->
          <label class="mr-2">名字:</label>
          <v-input 
            class="input flex-grow-0"
            messages="必填，最好不要超过三个中文"
            placeholder="角色的名字"
          >
            <input 
              ref="nameInput"
              v-model="role.name"
              autofocus
            />
          </v-input>

          <v-spacer/>

          <!-- 角色头像 -->
          <label class="mr-2">头像:</label>
          <div class="input flex-grow-0">
            <v-autocomplete 
              class="ma-0"
              dense
              messages="无实际用途，仅方便编辑"
              placeholder="角色的头像"
              no-data-text="无可用资源"
              v-model="role.avatar"
              :items="resList"
              item-text="name"
              item-value="uid"
            />
          </div>

          <RAvatar 
            class="ml-3"
            :src="avatarUrl"
            size="3em"
          />
        </div>

        <!-- 角色的立绘 -->
        <v-input class="input flex-grow-0">
          <label class="mr-2">立绘:</label>
          <v-autocomplete 
            placeholder="角色的立绘"
            no-data-text="无可用资源"
            v-model="role.pic"
            :items="resources.map(uid => ({...data[uid], uid}))"
            item-text="name"
            item-value="uid"
          />
        </v-input>
        
        <!-- 立绘预览 -->
        <div class="img-wrapper">
          <img :src="picUrl"/>
        </div>

        <v-btn 
          color="red"
          class="white--text"
          @click="deleteRole"
        >
          <v-icon>mdi-minus</v-icon>
          删除该角色
        </v-btn>
      </div>
  </div>
</template>

<script>
import RAvatar from '@/components/RAvatar.vue'

import state from '@/state.js'

const project = state.project;

export default {
  name: 'RoleManager',

  components: {
    RAvatar
  },

  data: () => ({
    roleIndex: null,
    data: project.data,
    resources: project.resources,
    roles: project.roles,
    role: null,
  }),

  watch: {
    roleIndex(index) {
      const uid = project.roles[index];
      this.role = uid ? project.data[uid] : null;
    },
  },

  computed: {
    resList() {
      return project.resources.map(uid => ({uid, ...this.data[uid]}));
    },

    picUrl() {
      const role = this.role;
      if (role && role.pic) {
        const res = project.data[role.pic];
        return res ? res.src : null;
      }
      return null;
    },

    avatarUrl() {
      const role = this.role;
      if (role && role.avatar) {
        const res = project.data[role.avatar];
        return res ? res.src : null;
      }
      return null;
    },
  },

  methods: {
    addRole() {
      project.roles.push(project.addData({
        name: '未命名角色',
        avatar: null,
        pic: null,
      }));
      this.roleIndex = project.roles.length - 1;
    },

    deleteRole() {
      if (('number' === typeof this.roleIndex) && this.roleIndex >= 0) {
        const uid = project.roles[this.roleIndex];
        project.roles.splice(this.roleIndex, 1);
        delete project.data[uid];
        this.roleIndex = null;
      }
    },

    getAvatarUrl(uid) {
      const role = project.data[uid];
      if (role) {
        const res = project.data[role.avatar || role.pic];
        return res ? res.src : null;
      }
      return null;
    }
  }
}
</script>

<style lang="scss" scoped>


.fill {
  width: 100%;
  height: 100%;
}

.role {
  flex: 1;
  overflow-y: hidden;
}

.input {
  width: 50%;

  input {
    width: 100%;
    padding-top: 0;;
  }

  label {
    word-break: keep-all;
  }
}

.img-wrapper {
  width: 100%;
  height: 10rem;
  flex: 1;
  text-align: center;
  
  img {
    max-width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }
}

</style>