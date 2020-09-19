import Vue from 'vue'
import Vuex from 'vuex'
import {
    cacheState,
    compile,
    downloadProject,
    downloadScript,
    loadProjectFromFile,
    loadProjectFromCache,
    exportToText,
    importFromText,
} from './transfer'
import {
    createResource,
    createRole,
    createChunk,
    removeResource,
    removeRole,
    removeChunk,
    updateData,
} from './data-mutation'
import { v4 as genId } from 'uuid';
import {
    openPanel,
    closePanel,
    closeAllPanels,
    savePanel,
    saveAllPanels,
    bindEl,
} from "./panel";
import {
    openDialog,
    closeDialog,
} from "./dialog";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        id: genId(), // 剧本ID
        lastModified: Date.now(), // 最后修改时间
        name: '未命名', // 剧本的名称
        version: '1.0.0', // 版本
        authors: [], // 作者
        entry: null, // 台词入口
        data: {}, // 所有数据的存储地点
        resources: [], // 资源列表
        roles: [], // 角色列表
        chunks: [], // 台词段

        script: null, // 缓存编译好的剧本

        panels: [],
        tabIndex: -1,

        app: null,

        messages: [],

        dialog: null,
    },
    mutations: {
        openPanel,
        closePanel,
        closeAllPanels,
        savePanel,
        saveAllPanels,
        bindEl,

        openDialog,
        closeDialog,

        cacheState,
        compile,
        downloadProject,
        downloadScript,
        loadProjectFromFile,
        loadProjectFromCache,


        createResource,
        createRole,
        createChunk,

        removeResource,
        removeRole,
        removeChunk,

        updateData,

        exportToText,
        importFromText,

        updateBaseInfo(state, { name, version, authors }) {
            state.name = name || state.name;
            state.version = version || state.version;
            state.authors = authors || state.authors;
        },

        setTabIndex(state, index) {
            state.tabIndex = index;
        },

        setApp(state, app) {
            state.app = app;
        },
    },
})
