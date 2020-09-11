

import BaseInfo from '../components/panels/BaseInfo';
import Chunk from '../components/panels/Chunk';
import Demonstration from '../components/panels/Demonstration';
import Doc from '../components/panels/Doc';
import ResourceManager from '../components/panels/ResourceManager';
import Role from '../components/panels/Role';
import { cacheState } from './transfer';

const PANEL_TYPES = {
    "base-info"(id) {
        return {
            id,
            icon: 'mdi-information-outline',
            title: '基础信息',
            component: BaseInfo,
        };
    },
    "res-manager"(id) {
        return {
            id,
            icon: 'mdi-folder-outline',
            title: '资源管理器',
            component: ResourceManager,
        };
    },
    "doc"() {
        return {
            id: "doc",
            icon: 'mdi-document',
            title: '帮助文档',
            component: Doc,
        };
    },
    "demo"() {
        return {
            id: "demo",
            icon: 'mdi-play',
            title: '演示',
            component: Demonstration,
        };
    },
    "role"(id, data) {
        return {
            id: id,
            icon: 'mdi-account-outline',
            title: data[id] ? data[id].name : '未知角色',
            component: Role,
        };
    },
    "chunk"(id, data) {
        return {
            id: id,
            icon: 'mdi-text',
            title: data[id] ? data[id].title : '未知文本段',
            component: Chunk,
        };
    },
};

//#region 一些工具方法

/**
 * 寻找到一个合理的索引
 * 若指定了index，则返回该index
 * 若未指定index，但是指定了id，则根据ID寻找index，未找到则返回-1
 * 若未指定index，也未指定id，则返回当前打开的面板的索引
 * @param {Object} state 仓库状态
 * @param {Number} index 该面板的索引
 * @param {String} id 该面板的ID
 * @returns {Number} 找到的索引 
 */
function findPanelIndex(state, index = -1, id = null) {
    if (index < 0) {
        return id ? state.panels.findIndex(p => p.id === id) : state.tabIndex;
    }
    return index;
}

/**
 * 关闭一个面板
 * @param {Object} state 仓库
 * @param {Number} index 要关闭面板的索引
 */
function close(state, index = -1) {
    index = findPanelIndex(state, index);
    const panel = state.panels[index];
    if (panel) {
        if (!panel.dirty || confirm(`${panel.title}还未保存，确定关闭？`)) {
            state.panels.splice(index, 1);
        }
    }
}

//#endregion


/**
 * 打开一个面板，若已经有相同的id，则专挑到该id所对应的面板，否则新建一个面板并添加到最后
 * @param {Object} state 仓库
 * @param {String} type 面板类型
 * @param {String} id 指定的id
 * @param {Number} index 要插入的位置，若未指定则默认插入到最后
 */
function openPanel(state, { type, id, index = null }) {
    index = index !== null ? index : state.panels.length;
    const panel = PANEL_TYPES[type] ? 
        Object.assign({}, PANEL_TYPES[type](id, state.data), {
            type,
            dirty: false,
            el: null,
        }) : 
        null;
    if (panel) {
        const alreadyExistIndex = state.panels.findIndex(t => t.id === panel.id);
        if (alreadyExistIndex >= 0) {
            state.tabIndex = alreadyExistIndex;
        } else {
            state.panels.splice(index, 0, panel);
            state.tabIndex = index;
        }
    }
}

/**
 * 关闭一个面板
 * @param {Object} state 仓库
 * @param {Number} index 面板的索引
 * @param {String} id 面板的id
 */
function closePanel(state, { index = null, id = null }) {
    index = findPanelIndex(state, index, id);
    if (index >= 0) {
        close(state, index);
    }
}

/**
 * 关闭所有面板
 * @param {Object} state 仓库
 */
function closeAllPanels(state) {
    let prev = -1;
    while (state.panels.length && state.panels.length !== prev) {
        prev = state.panels.length;
        close(state, 0);
    }
}

/**
 * 保存面板
 * @param {Object} state 仓库
 * @param {Number} index 面板的索引
 */
function savePanel(state, index = -1) {
    index = findPanelIndex(state, index);
    if (index >= 0) {
        const panel = state.panels[index];
        if (panel) {
            if (panel.el && panel.el.save) {
                panel.el.save();
                cacheState(state);
            }
            panel.dirty = false;
            const np = PANEL_TYPES[panel.type](panel.id, state.data);
            panel.title = np.title;
        }
        // appendMessage(state, `项目保存完成：${panel.title}`);
    }
}

/**
 * 保存所有面板
 * @param {Object} state 仓库
 */
function saveAllPanels(state) {
    for (let index = 0; index < state.panels.length; index++) {
        savePanel(state, index);
    }
    cacheState(state);
    // appendMessage(state, `所有可保存项目保存完成`);
}

/**
 * 将一个DOM绑定到相应面板
 * @param {Object} state 仓库
 * @param {Number} index 面板的索引
 * @param {String} id 面板的id
 * @param {Vue.Component} el 面板所对应的元素
 */
function bindEl(state, {index, id, el}) {
    index = findPanelIndex(state, index, id);
    state.panels[index].el = el;
}

export {
    openPanel,
    closePanel,
    closeAllPanels,
    savePanel,
    saveAllPanels,
    bindEl,
}