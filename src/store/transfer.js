

const LS_KEY = 'pl-editor-project';

// 编译剧本
function compile(state) {
    console.log(state);
}

  // 缓存工程
function cacheState(state) {
    localStorage.setItem(LS_KEY, state);
}

  // 下载工程
function downloadProject() {

}

// 下载剧本
function downloadScript() {

}

export {
    compile,
    cacheState,
    downloadProject,
    downloadScript,
}