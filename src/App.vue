<template>
    <v-app id="app">
        <v-app-bar app color="primary" height="32" clipped-left>
            <MenuBar />

            <v-spacer/>

            <v-subheader class="white--text">v2.6.0</v-subheader>
        </v-app-bar>

        <!-- 侧边栏或者叫目录 -->
        <v-navigation-drawer app permanent clipped v-if="showNav">
            <v-list>
                <v-list-item @click="open('base-info', 'base-info' + id)">
                        <v-list-item-avatar>
                            <v-icon>mdi-information-outline</v-icon>
                        </v-list-item-avatar>

                    <v-list-item-title>基础信息</v-list-item-title>
                </v-list-item>

                <v-list-item @click="open('res-manager', 'res-manager' + id)">
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
                        v-for="(tab, index) of panels" 
                        :key="tab.id" 
                        size="small"
                    >
                        <v-icon small>{{ tab.icon }}</v-icon>

                        <span class="mx-1">{{ tab.title }}</span>

                        <v-btn x-small icon @click="closePanel({index})">
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
                        v-for="(panel, index) of panels" 
                        :key="panel.id"
                        class="fill-y grey lighten-4"
                    >
                        <component 
                            class="edit-area"
                            :is="panel.component" 
                            :id="panel.id" 
                            @mutate="panel.dirty = true"
                            @delete="close(index)"
                            ref="panels"
                        />
                    </v-tab-item>
                </v-tabs-items>
            </div>
        </v-main>

        <v-footer 
            app 
            dark 
            height="24" 
            class="py-0"
        >
            <span 
                v-if="messages.length" 
                class="font-weight-light"
            >{{ lastMessage.time | localizeDate }} ： {{ lastMessage.text }}</span>
        </v-footer>

        <v-dialog :value="dialog">
            <component v-if="dialog" :is="dialog.component"/>
        </v-dialog>
    </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import MenuBar from "./components/MenuBar";


export default {
    name: "App",

    components: {
        MenuBar,
    },

    data() {
        return {
            showNav: true,
        };
    },

    computed: {
        ...mapState(['id', 'panels', "resources", "roles", "chunks", "data", 'messages', 'dialog']),

        tabIndex: {
            get() {
                return this.$store.state.tabIndex;
            },
            set(index) {
                this.setTabIndex(index);
            }
        },

        lastMessage() {
            return this.messages[this.messages.length - 1];
        },
    },

    watch: {
        id(val) {
            this.closeAllPanels();
            this.openPanel({
                type: 'base-info', 
                id: 'base-info' + val
            });
        }
    },

    methods: {
        ...mapMutations(['openPanel', 'closePanel', 'closeAllPanels', 'setTabIndex', 'setApp',
            'createRole', 'createChunk',
            'savePanel', 'saveAllPanels']),

        createNewRole() {
            this.createRole({cb: role => this.open('role', role.id)});
        },

        createNewChunk() {
            this.createChunk({cb: role => this.open('chunk', role.id)});
        },

        open(type, id) {
            this.openPanel({type, id});
        },
    },

    created() {
        window.addEventListener("keydown", (event) => {
            if ((event.key === 'S' || event.key ==='s') && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
                if (event.shiftKey) {
                    this.saveAllPanels();
                } else {
                    this.savePanel(this.tabIndex);
                }
                this.$forceUpdate();
            }
        });
        this.openPanel({
            type: 'base-info', 
            id: 'base-info' + this.id
        });
        this.setApp(this);
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