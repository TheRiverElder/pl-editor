import download from 'downloadjs'

const LS_KEY = 'pl-editor-project';

// 编译剧本
function compile(state) {
    console.log(state);
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