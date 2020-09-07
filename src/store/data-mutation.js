
import { v4 as genId } from 'uuid'

function create(state, catalog, data, cb) {
    const newData = { id: genId(), ...data };
    state.data[newData.id] = newData;
    state[catalog].push(newData.id);
    if (cb) {
        cb(newData);
    }
}

// 增加资源
function createResource(state, {
    name = '未命名资源',
    src = null,
    type = 'image/*',
    cb,
} = {}) {
    create(state, 'resources', { name, src, type }, cb);
}

// 增加角色
function createRole(state, {
    name = '未命名角色',
    avatar = null,
    pic = null,
    cb,
} = {}) {
    create(state, 'roles', { name, avatar, pic }, cb);
}

// 增加文本段
function createChunk(state, {
    title = '未命名文本段',
    subtitle = '',
    background = null,
    // bgm: null,
    sections = [{ speaker: null, text: '' }],
    exits = [],
    cb,
} = {}) {
    create(state, 'chunks', { title, subtitle, background, sections, exits }, cb);
}


function remove(state, catalog, id) {
    delete state.data[id];
    const c = state[catalog];
    const index = c.findIndex(e => e === id);
    if (index >= 0) {
        c.splice(index, 1);
    }
}

function removeResource(state, id) {
    remove(state, 'resources', id);
}

function removeRole(state, id) {
    remove(state, 'roles', id);
}

function removeChunk(state, id) {
    remove(state, 'chunks', id);
}


// 更新数据
function updateData(state, newData) {
  let oldData = state.data[newData.id];
  if (oldData) {
    Object.assign(oldData, newData);
  } else {
    state.data[newData.id] = newData;
  }
}

export {
    createResource,
    createRole,
    createChunk,

    removeResource,
    removeRole,
    removeChunk,

    updateData,
}