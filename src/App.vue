<template>
    <v-app id="app">
        <v-app-bar app color="primary" height="32" clipped-left>
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        dark
                        v-bind="attrs"
                        v-on="on"
                        text
                        height="32"
                        tile
                    >文件</v-btn>
                </template>

                <v-list>
                    <v-list-item dense @click="saveTab(tabIndex)" :disabled="!tabs.length">
                        <v-list-item-title>保存当前项目</v-list-item-title>
                    </v-list-item>

                    <v-list-item dense @click="saveAllTabs" :disabled="!tabs.length">
                        <v-list-item-title>保存所有项目</v-list-item-title>
                    </v-list-item>

                    <v-divider/>

                    <v-list-item dense @click="downloadProject">
                        <v-list-item-title>下载工程</v-list-item-title>
                    </v-list-item>

                    <v-list-item dense @click="downloadScript" :disabled="!script">
                        <v-list-item-title>下载脚本</v-list-item-title>
                    </v-list-item>

                    <v-divider/>

                    <v-list-item dense @click="cacheState">
                        <v-list-item-title>缓存至浏览器</v-list-item-title>
                    </v-list-item>

                    <v-list-item dense @click="loadProjectFromCache">
                        <v-list-item-title>从浏览器缓存载入工程</v-list-item-title>
                    </v-list-item>

                    <v-list-item dense>
                        <v-list-item-title class="p-relative">
                            从文件载入工程
                            <input class="invisible-overlay" type="file" @change="loadProjectFromFile($event.target.files[0])"/>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        dark
                        v-bind="attrs"
                        v-on="on"
                        text
                        height="32"
                        tile
                    >工程</v-btn>
                </template>

                <v-list>
                    <v-list-item dense @click="compile">
                        <v-list-item-title>编译为测试版</v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item dense @click="compile" disabled>
                        <v-list-item-title>编译为发行版</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        dark
                        v-bind="attrs"
                        v-on="on"
                        text
                        height="32"
                        tile
                    >脚本</v-btn>
                </template>

                <v-list>
                    <v-list-item dense @click="compile" :disabled="!script">
                        <v-list-item-title>测试脚本（需要先编译）</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        dark
                        v-bind="attrs"
                        v-on="on"
                        text
                        height="32"
                        tile
                    >帮助</v-btn>
                </template>

                <v-list>
                    <v-list-item dense @click="open('doc')">
                        <v-list-item-title>帮助文档</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <!-- 侧边栏或者叫目录 -->
        <v-navigation-drawer app permanent clipped>
            <v-list>
                <v-list-item @click="open('base-info')">
                        <v-list-item-avatar>
                            <v-icon>mdi-information-outline</v-icon>
                        </v-list-item-avatar>

                    <v-list-item-title>基础信息</v-list-item-title>
                </v-list-item>

                <v-list-item @click="open('resource')">
                        <v-list-item-avatar>
                            <v-icon>mdi-folder-outline</v-icon>
                        </v-list-item-avatar>
                    
                    <v-list-item-title>资源管理器</v-list-item-title>
                </v-list-item>

                <v-list-group>
                    <template v-slot:activator>
                        <v-list-item-avatar>
                            <v-icon>mdi-account-outline</v-icon>
                        </v-list-item-avatar>
                        
                        <v-list-item-subtitle>角色</v-list-item-subtitle>
                    </template>

                    <v-list-item v-for="id of roles" :key="id" @click="open('role', id)">
                        <v-list-item-avatar color="grey lighten-2">
                            <v-img :src="data[data[id].avatar]"/>
                        </v-list-item-avatar>

                        <v-list-item-title>{{ data[id].name }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-btn 
                            text 
                            class="mx-auto" 
                            color="primary"
                            @click="createNewRole"
                        >新建角色</v-btn>
                    </v-list-item>
                </v-list-group>

                <v-list-group>
                    <template v-slot:activator>
                        <v-list-item-avatar>
                            <v-icon>mdi-text</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-subtitle>台词段</v-list-item-subtitle>
                    </template>

                    <v-list-item v-for="id of chunks" :key="id" @click="open('chunk', id)">
                        <v-list-item-title>{{ data[id].title }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-btn 
                            text 
                            class="mx-auto" 
                            color="primary"
                            @click="createNewChunk"
                        >新建文本段</v-btn>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>

        <v-main class="fill-y">
            <!-- 正文 -->
            <div class="fill-y flex-grow-1 d-flex flex-column">
                <v-tabs class="flex-grow-0" v-model="tabIndex" height="2em">
                    <v-tab 
                        v-for="(tab, index) of tabs" 
                        :key="tab.id" 
                        size="small"
                    >
                        <v-icon small>{{ getIcon(tab.type) }}</v-icon>

                        <span class="mx-1">{{ tab.title }}</span>

                        <v-btn x-small icon @click="close(index)">
                            <v-icon x-small>{{ tab.dirty ? 'mdi-circle' : 'mdi-close' }}</v-icon>
                        </v-btn>
                    </v-tab>
                </v-tabs>

                <v-divider />

                <v-tabs-items 
                    class="grey lighten-4 flex-grow-1" 
                    v-model="tabIndex"
                    active-class=""
                >
                    <v-tab-item 
                        v-for="(tab, index) of tabs" 
                        :key="tab.id"
                        class="fill-y grey lighten-4"
                    >
                        <component 
                            class="fill-y edit-area"
                            :is="getComponent(tab.type)" 
                            :content="tab.content" 
                            @mutate="markDirty(tab)"
                            @delete="close(index)"
                            ref="tabs"
                        />
                    </v-tab-item>
                </v-tabs-items>
            </div>
        </v-main>
    </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import ResourceManager from "./views/ResourceManager";
import Role from "./components/Role.vue";
import Chunk from "./components/Chunk.vue";
import BaseInfo from "./components/BaseInfo.vue";
import Doc from "./components/Doc.vue";
import { deepCopy } from "./utils/objects";

const tabTypeIconMap = {
    'resource': "mdi-folder-outline",
    'role': "mdi-account-outline",
    'chunk': "mdi-text",
    'base-info': "mdi-information-outline",
    'doc': "mdi-document",
};

const SPECIAL_TABS = new Set(['base-info', 'resource', 'doc']);

export default {
    name: "App",

    components: {
        ResourceManager,
        Role,
        Chunk,
        BaseInfo,
        Doc,
    },

    data() {
        return {
            tabIndex: null,
            tabs: [],
        };
    },

    computed: {
        ...mapState(["resources", "roles", "chunks", "data", 'script']),
    },

    methods: {
        ...mapMutations(['updateData', 'cacheState', 'createRole', 'createChunk',
            'downloadProject', 'downloadScript', 'compile', 'loadProjectFromFile', 'loadProjectFromCache']),

        createNewRole() {
            this.createRole({cb: role => this.open('role', role.id)});
        },

        createNewChunk() {
            this.createChunk({cb: role => this.open('chunk', role.id)});
        },

        getIcon(type) {
            return tabTypeIconMap[type] || 'mdi-help';
        },

        getComponent(type) {
            switch (type) {
                case "resource":
                    return "ResourceManager";
                case "role":
                    return "Role";
                case "chunk":
                    return "Chunk";
                case "doc":
                    return "Doc";
                default:
                    return "BaseInfo";
            }
        },

        open(type, id) {
            if (SPECIAL_TABS.has(type)) {
                id = type;
            }
            const index = this.tabs.findIndex((t) => t.id === id);
            if (index >= 0) {
                this.tabIndex = index;
                return;
            }
            let tab = null;
            if (SPECIAL_TABS.has(type)) {
                tab = {
                    title: null,
                    type,
                    id,
                    dirty: false,
                };
                switch (type) {
                    case 'base-info': tab.title = '基础信息'; break;
                    case 'resource': tab.title = '资源管理器'; break;
                    case 'doc': tab.title = '帮助文档'; break;
                }
            } else {
                const data = deepCopy(this.data[id]);
                tab = {
                    title: null,
                    type,
                    id,
                    content: data,
                    dirty: false,
                };
                switch (type) {
                    case "role": tab.title = data.name; break;
                    case "chunk": tab.title = data.title; break;
                }
            }
            this.tabs.push(tab);
            this.tabIndex = this.tabs.length - 1;
        },

        close(index) {
            const tab = this.tabs[index];
            if (tab) {
                if (!tab.dirty || confirm(`${tab.title}还未保存，确定关闭？`)) {
                    this.tabs.splice(index, 1);
                }
            }
        },

        saveTab(tab, index) {
            if (tab) {
                const el = this.$refs.tabs[index];
                if (el) {
                    el.save();
                }
                tab.dirty = false;
            }
        },

        saveAllTabs() {
            this.tabs.forEach((t, i) => this.saveTab(t, i));
        },

        markDirty(tab) {
            tab.dirty = true;
        },
    },

    created() {
        window.addEventListener("keydown", (event) => {
            if ((event.key === 'S' || event.key ==='s') && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
                if (event.shiftKey) {
                    this.tabs.forEach((tab, index) => this.saveTab(tab, index));
                } else {
                    this.saveTab(this.tabs[this.tabIndex], this.tabIndex);
                }
                this.cacheState();
                this.$forceUpdate();
            }
        });
        this.open('base-info');
    },
};
</script>

<style>
html,
body,
#app {
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

input[type="text"] {
    padding: 5px;
}

.edit-area {
    width: 100%;
    max-width: 64em;
    margin: 0 auto;
}

.p-relative {
    position: relative;
}

.invisible-overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    cursor: pointer;
}
</style>