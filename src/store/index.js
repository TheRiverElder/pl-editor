import Vue from 'vue'
import Vuex from 'vuex'
import { 
    cacheState, 
    compile, 
    downloadProject, 
    downloadScript,
    loadProjectFromFile,
    loadProjectFromCache,
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

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    id: genId(),

    name: '未命名', // 剧本的名称
    
    version: '1.0.0', // 版本

    authors: [], // 作者

    data: {}, // 所有数据的存储地点

    resources: [], // 资源列表

    roles: [], // 角色列表

    chunks: [], // 台词段

    script: null, // 缓存编译好的剧本

  },
  mutations: {
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

    updateBaseInfo(state, { name, version, authors }) {
      state.name = name || state.name;
      state.version = version || state.version;
      state.authors = authors || state.authors;
    },

  },
  actions: {
  },
})
