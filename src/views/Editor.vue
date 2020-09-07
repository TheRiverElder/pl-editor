<template>
    <div class="d-flex">
        <!-- 侧边栏或者叫目录 -->
        <div class="fill-y list">
            <v-list>
                <v-list-item @click="open('resource')">
                    <v-list-item-title>资源</v-list-item-title>
                </v-list-item>
                
                <v-list-group dense>
                    <template v-slot:activator>
                        <v-list-item-subtitle>角色</v-list-item-subtitle>
                    </template>

                    <v-list-item
                        v-for="id of roles"
                        :key="id"
                        dense
                        @click="open('role', id)"
                    >
                        <v-list-item-title>{{ data[id].name }}</v-list-item-title>
                    </v-list-item>
                </v-list-group>
                
                <v-list-group dense>
                    <template v-slot:activator>
                        <v-list-item-subtitle>台词段</v-list-item-subtitle>
                    </template>

                    <v-list-item
                        v-for="id of chunks"
                        :key="id"
                        dense
                        @click="open('chunk', id)"
                    >
                        <v-list-item-title>{{ data[id].title }}</v-list-item-title>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </div>

        <v-divider vertical/>

        <!-- 正文 -->
        <div class="fill-y flex-grow-1 d-flex flex-column">
            <v-tabs 
                class="flex-grow-0" 
                v-model="tabIndex"
                height="2em"
            >
                <v-tab
                    v-for="tab of tabs"
                    :key="tab.id" 
                    size="small"
                >
                    <v-icon small>{{ getIcon(tab.type) }}</v-icon>

                    <span class="mx-1">{{ tab.title }}</span>
                    
                    <v-btn x-small icon>
                        <v-icon x-small>mdi-circle</v-icon>
                    </v-btn>
                </v-tab>
            </v-tabs>

            <v-divider/>

            <v-tabs-items class="flex-grow-1 overflow-auto" v-model="tabIndex">
                <v-tab-item
                    v-for="tab of tabs"
                    :key="tab.id" 
                >
                    <component 
                        :is="getComponent(tab.type)" 
                        :content="tab.content"
                    />
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ResourceManager from './ResourceManager';
import Role from '../components/Role.vue';
import Chunk from '../components/Chunk.vue';
import { deepCopy } from '../utils/objects'

export default {
    name: 'Editor',

    components: {
        ResourceManager,
        Role,
        Chunk,
    },

    data() {
        return {
            tabIndex: null,
            tabs: [],
        };
    },

    computed: {
        ...mapState(['resources', 'roles', 'chunks', 'data']),
    },

    methods: {
        getIcon(type) {
            switch(type) {
                case 'resource': return 'mdi-file-outline';
                case 'role': return 'mdi-account-outline';
                case 'chunk': return 'mdi-text';
                default: return 'mdi-help';
            }
        },

        getComponent(type) {
            switch(type) {
                case 'resource': return 'ResourceManager';
                case 'role': return 'Role';
                case 'chunk': return 'Chunk';
                default: return 'mdi-help';
            }
        },

        open(type, id) {
            if (type === 'resource') {
                id = 'resource';
            }
            if (this.tabs.findIndex(t => t.id === id) >= 0) {
                return;
            }
            let tab = null;
            if (type === 'resource') {
                tab = {
                    title: '资源管理器',
                    type,
                    id,
                };
            } else {
                const data = deepCopy(this.data[id]);
                tab = {
                    title: null,
                    type,
                    id,
                    content: data,
                };
                switch(type) {
                    case 'resource': tab.title = data.name; break
                    case 'role': tab.title = data.name; break
                    case 'chunk': tab.title = data.title; break
                }
            }
            this.tabs.push(tab);
            this.tabIndex = this.tabs.length - 1;
        }
    },

}
</script>

<style scoped>
.list {
    width: 16em;
}

</style>