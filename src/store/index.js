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

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    name: '未命名', // 剧本的名称
    
    version: '1.0.0', // 版本

    authors: [], // 作者

    data: {
      'res-1': { id: 'res-1', src: null, name: 'Unnamed' },
      'role-1': { id: 'role-1', name: '内啥', avatar: null, pic: null },
      'chunk-1': { id: 'chunk-1', title: '未命名章节', subtitle: '', background: null, sections: [], exits: [] },
    }, // 所有数据的存储地点

    resources: ['res-1'], // 资源列表

    roles: ['role-1'], // 角色列表

    chunks: ['chunk-1'], // 台词段

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
