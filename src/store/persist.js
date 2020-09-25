
import { v4 as genId } from 'uuid'

function serialize(state) {
    return JSON.stringify(toObject(state));
}

function toObject(state) {
    return {
        id: state.id,
        lastModified: state.lastModified,
        name: state.name,
        version: state.version,
        authors: state.authors,
        entry: state.entry,
        data: state.data,
        resources: state.resources,
        roles: state.roles,
        chunks: state.chunks,
    };
}

function createEmptyState() {
    return {
        id: genId(),
        lastModified: Date.now(),
        name: '未命名',
        version: '1.0.0',
        authors: [],
        entry: null,
        data: {},
        resources: [],
        roles: [],
        chunks: [],
        script: null,
        tabIndex: -1,
        dialog: null,
    };
}

function fromObject(state, object) {
    Object.assign(state, createEmptyState(), object);
}

function deserialize(state, string) {
    if ('string' !== typeof string) {
        return "该数据不是合法的JSON字符串";
    }
    try {
        const object = JSON.parse(string);
        fromObject(state, object);
        return null;
    } catch(e) {
        return e.message;
    }
}

export {
    serialize,
    deserialize,
    toObject,
    fromObject,
    createEmptyState,
}