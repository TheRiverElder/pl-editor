

import state from '@/state.js'
import download from "downloadjs";
import { cacheProject } from "@/utils/storage.js";

const project = state.project;

function saveProject(doDoanload = false) {
    const data = cacheProject(project);
    state.messages.push("已缓存工程");
    if (doDoanload) {
        if (data) {
            const fileName = state.project.info.name + '.proj.json';
            state.messages.push("开始下载工程文件：" + fileName);
            download(data, fileName, 'application/json');
        } else {
            state.messages.push("未下载工程文件");
        }
    }
}

function compile() {
    const mapping = {};

    const resources = project.resources.map(uid => project.data[uid].src);
    project.resources.forEach((uid, index) => mapping[uid] = index);

    const roles = project.roles.map(uid => {
        const role = project.data[uid]
        return {
            name: role.name,
            avatar: mapping[role.avatar],
            pic: mapping[role.pic],
        };
    });
    project.roles.forEach((uid, index) => mapping[uid] = index);


    const instructions = [];
    project.chunks.map(uid => {
        const chunk = project.data[uid];
        mapping[uid] = instructions.length;
        instructions.push(
            ['bg', mapping[chunk.background]],
            ['bgm', mapping[chunk.bgm]],
            ...chunk.sections.map(s => ['line', s.text, mapping[s.speaker]]),
            ...chunk.exits.map(e => ['exit', e.text, mapping[e.target]]),
        );
    });

    instructions.forEach(ins => {
        if (ins[0] === 'exit') {
            ins[2] = mapping[ins[2]];
        }
    });

    const data = {
        info: project.info,
        instructions,
        resources,
        roles,
    };

    state.script = data;
    state.messages.push("编译完成，可以演示或者下载脚本");
}

function downloadScript() {
    if (state.script) {
        const fileName = state.script.info.name + '.json'
        state.messages.push("开始下载：" + fileName);
        download(JSON.stringify(state.script), fileName, 'application/json');
    } else {
        state.messages.push("无可用的编译后脚本");
    }
}

function loadProject(event) {
    const reader = new FileReader();
    reader.onload = () => fillProject(JSON.parse(reader.result));
    reader.readAsText(event.target.files[0]);
}

function fillProject(proj) {
    if (proj) {
        Object.assign(project, proj);
    }
}

export {
    saveProject,
    compile,
    downloadScript,
    loadProject,
    fillProject,
}