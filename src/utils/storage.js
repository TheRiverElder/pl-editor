
const LS_KEY = "river-galgame-project";

function cacheProject(project) {
    if (project) {
        const data = JSON.stringify(project);
        localStorage.setItem(LS_KEY, data);
    }
}

function loadCachedProject() {
    return JSON.parse(localStorage.getItem(LS_KEY));
}

export {
    LS_KEY,
    cacheProject,
    loadCachedProject,
}