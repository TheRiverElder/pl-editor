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

                    <v-list-item dense @click="cacheState">
                        <v-list-item-title>缓存至浏览器</v-list-item-title>
                    </v-list-item>

                    <v-divider/>

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
                    <v-list-item dense @click="compile('development')">
                        <v-list-item-title>编译为测试版</v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item dense @click="compile('production')" disabled>
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
                    <v-list-item dense @click="open('demo')" :disabled="!script">
                        <v-list-item-title>开始测试</v-list-item-title>
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
                    >窗口</v-btn>
                </template>

                <v-list>
                    <v-list-item dense @click="showNav = !showNav">
                        <v-list-item-title>开关导航栏</v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item dense @click="closeAll">
                        <v-list-item-title>关闭所有标签</v-list-item-title>
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

            <v-spacer/>

            <v-subheader class="white--text">v2.4</v-subheader>
        </v-app-bar>

        <!-- 侧边栏或者叫目录 -->
        <v-navigation-drawer app permanent clipped v-if="showNav">
            <v-list>
                <v-list-item @click="open('base-info', id)">
                        <v-list-item-avatar>
                            <v-icon>mdi-information-outline</v-icon>
                        </v-list-item-avatar>

                    <v-list-item-title>基础信息</v-list-item-title>
                </v-list-item>

                <v-list-item @click="open('res-manager', id)">
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
                        <v-icon small>{{ tab.icon }}</v-icon>

                        <span class="mx-1">{{ tab.title }}</span>

                        <v-btn x-small icon @click="close(index)">
                            <v-icon x-small>{{ tab.dirty ? 'mdi-circle' : 'mdi-close' }}</v-icon>
                        </v-btn>
                    </v-tab>
                </v-tabs>

                <v-divider />

                <v-tabs-items 
                    class="fill-y inner-fill-y overflow-hidden inner-overflow-auto grey lighten-4 flex-grow-1" 
                    v-model="tabIndex"
                    active-class=""
                >
                    <v-tab-item 
                        v-for="(tab, index) of tabs" 
                        :key="tab.id"
                        class="fill-y grey lighten-4"
                    >
                        <component 
                            class="edit-area"
                            :is="tab.component" 
                            :id="tab.id" 
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
import Demonstration from './views/Demonstration.vue';

const TAB_TYPES = {
    "base-info"(id) {
        return {
            type: "base-info",
            id,
            icon: 'mdi-information-outline',
            title: '基础信息',
            component: 'BaseInfo',
            dirty: false,
        };
    },
    "res-manager"(id) {
        return {
            type: "res-manager",
            id,
            icon: 'mdi-folder-outline',
            title: '资源管理器',
            component: 'ResourceManager',
            dirty: false,
        };
    },
    "doc"() {
        return {
            type: "doc",
            id: "doc",
            icon: 'mdi-document',
            title: '帮助文档',
            component: 'Doc',
            dirty: false,
        };
    },
    "demo"() {
        return {
            type: "demo",
            id: "demo",
            icon: 'mdi-play',
            title: '演示',
            component: 'Demonstration',
            dirty: false,
        };
    },
    "role"(id, data) {
        return {
            type: "role",
            id: id,
            icon: 'mdi-account-outline',
            title: data[id] ? data[id].name : '未知角色',
            component: 'Role',
            dirty: false,
        };
    },
    "chunk"(id, data) {
        return {
            type: "chunk",
            id: id,
            icon: 'mdi-text',
            title: data[id] ? data[id].title : '未知文本段',
            component: 'Chunk',
            dirty: false,
        };
    },
};

export default {
    name: "App",

    components: {
        ResourceManager,
        Role,
        Chunk,
        BaseInfo,
        Doc,
        Demonstration,
    },

    data() {
        return {
            tabIndex: null,
            tabs: [],
            showNav: true,
            Demonstration,
        };
    },

    computed: {
        ...mapState(['id', "resources", "roles", "chunks", "data", 'script']),
    },

    watch: {
        id(val) {
            this.closeAll();
            this.open('base-info', val);
        }
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

        open(type, id) {
            const tab = TAB_TYPES[type] ? TAB_TYPES[type](id, this.data) : null;
            if (tab) {
                const index = this.tabs.findIndex(t => t.id === tab.id);
                if (index >= 0) {
                    this.tabIndex = index;
                } else {
                    this.tabs.push(tab);
                    this.tabIndex = this.tabs.length - 1;
                }
            }
        },

        close(index) {
            const tab = this.tabs[index];
            if (tab) {
                if (!tab.dirty || confirm(`${tab.title}还未保存，确定关闭？`)) {
                    this.tabs.splice(index, 1);
                }
            }
        },

        closeAll() {
            let prev = -1;
            while (this.tabs.length && this.tabs.length !== prev) {
                prev = this.tabs.length;
                this.close(0);
            }
        },

        saveTab(tab, index) {
            if (tab) {
                const el = this.$refs.tabs[index];
                if (el) {
                    el.save();
                }
                tab.dirty = false;
                this.cacheState();
            }
        },

        saveAllTabs() {
            this.tabs.forEach((t, i) => this.saveTab(t, i));
            this.cacheState();
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
                this.$forceUpdate();
            }
        });
        this.open('base-info', this.id);
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

.overflow-hidden {
    overflow: hidden;
}

.overflow-auto,
.inner-overflow-auto > * {
    overflow: auto;
}

.max-width-64em {
    max-width: 64em;
}
</style>