<template>
    <div>
        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" text height="32" tile>文件</v-btn>
            </template>

            <v-list>
                <v-list-item dense @click="savePanel" :disabled="!panels.length">
                    <v-list-item-title>保存当前项目</v-list-item-title>
                </v-list-item>

                <v-list-item dense @click="saveAllPanels" :disabled="!panels.length">
                    <v-list-item-title>保存所有项目</v-list-item-title>
                </v-list-item>

                <v-divider />

                <v-list-item dense @click="downloadProject">
                    <v-list-item-title>下载工程</v-list-item-title>
                </v-list-item>

                <v-list-item dense @click="downloadScript" :disabled="!script">
                    <v-list-item-title>下载脚本</v-list-item-title>
                </v-list-item>

                <v-list-item dense @click="cacheState">
                    <v-list-item-title>缓存至浏览器</v-list-item-title>
                </v-list-item>

                <v-divider />

                <v-list-item dense @click="loadProjectFromCache">
                    <v-list-item-title>从浏览器缓存载入工程</v-list-item-title>
                </v-list-item>

                <v-list-item dense>
                    <v-list-item-title class="p-relative">
                        从文件载入工程
                        <input
                            class="invisible-overlay"
                            type="file"
                            @change="loadProjectFromFile($event.target.files[0])"
                        />
                    </v-list-item-title>
                </v-list-item>

                <v-divider />

                <v-list-item dense @click="openDialog('export-to-text')">
                    <v-list-item-title>导出为纯文本</v-list-item-title>
                </v-list-item>

                <v-list-item dense @click="openDialog('import-from-text')">
                    <v-list-item-title>从纯文本导入</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" text height="32" tile>工程</v-btn>
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
                <v-btn dark v-bind="attrs" v-on="on" text height="32" tile>脚本</v-btn>
            </template>

            <v-list>
                <v-list-item dense @click="open('demo')" :disabled="!script">
                    <v-list-item-title>开始测试</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" text height="32" tile>窗口</v-btn>
            </template>

            <v-list>
                <v-list-item dense @click="app.showNav = !app.showNav">
                    <v-list-item-title>开关导航栏</v-list-item-title>
                </v-list-item>

                <v-list-item dense @click="closeAllPanels">
                    <v-list-item-title>关闭所有标签</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" text height="32" tile>帮助</v-btn>
            </template>

            <v-list>
                <v-list-item dense @click="open('doc')">
                    <v-list-item-title>帮助文档</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
    name: "MenuBar",

    computed: {
        ...mapState(['id', 'tabIndex', 'panels', 'script', 'app']),
    },

    methods: {
        ...mapMutations([
            "openPanel", 'savePanel', 'saveAllPanels', 'closeAllPanels',
            'updateData', 'cacheState',
            'downloadProject', 'downloadScript', 'compile', 'loadProjectFromFile', 'loadProjectFromCache',
            'openDialog']),

        open(type, id = null) {
            this.openPanel({ type, id });
        },
    },
};
</script>