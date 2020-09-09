import download from 'downloadjs'

const LS_KEY = 'pl-editor-project';

// 编译剧本
function compile(state) {
    const mapping = {};

    const resources = state.resources.map(uid => state.data[uid].src);
    state.resources.forEach((uid, index) => mapping[uid] = index);

    const roles = state.roles.map(uid => {
        const role = state.data[uid]
        return {
            name: role.name,
            avatar: mapping[role.avatar],
            pic: mapping[role.pic],
        };
    });
    state.roles.forEach((uid, index) => mapping[uid] = index);


    const instructions = [];
    state.chunks.forEach(uid => {
        const chunk = state.data[uid];
        mapping[uid] = instructions.length;
        instructions.push(
            ['bg', mapping[chunk.background]],
            // ['bgm', mapping[chunk.bgm]],
            ...chunk.sections.reduce((p, s) => 
                (p.push(...s.text
                    .split('\n')
                    .filter(l => !/^\s*$/.test(l))
                    .map(l => ['line', l, mapping[s.speaker]])), p), 
                []),
            ...chunk.exits.map(e => ['exit', e.text, mapping[e.target]]),
        );
    });

    instructions.forEach(ins => {
        if (ins[0] === 'exit') {
            ins[2] = mapping[ins[2]];
        }
    });

    const script = {
        name: state.name,
        version: state.verion,
        authors: state.authors,
        instructions,
        resources,
        roles,
    };

    state.script = script;
}

// 缓存工程
function cacheState(state) {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
}

// 下载工程
function downloadProject(state) {
    const data = {
        name: state.name,
        version: state.version,
        authors: state.authors,
        resources: state.resources,
        roles: state.roles,
        chunks: state.chunks,
        data: state.data,
    };
    download(JSON.stringify(data), data.name + '.egg.proj.json', 'application/json');
}

// 从本地文件缓存读取工程
function loadProjectFromCache(state) {
    const json = localStorage.getItem(LS_KEY);
    if (json) {
        Object.assign(state, JSON.parse(json));
    }
}

// 从浏览器缓存读取工程
function loadProjectFromFile(state, file) {
    const reader = new FileReader();
    reader.onload = () => {
        Object.assign(state, JSON.parse(reader.result));
    }
    reader.readAsText(file);
}

// 下载剧本
function downloadScript(state) {
    const script = state.script;
    if (script) {
        download(JSON.stringify(script), (script.name || '未命名') + '.egg.json', 'application/json');
    }
}

export {
    compile,
    cacheState,
    downloadProject,
    downloadScript,
    loadProjectFromFile,
    loadProjectFromCache,
}