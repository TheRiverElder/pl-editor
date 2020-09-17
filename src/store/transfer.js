import download from 'downloadjs'
import { v4 as genId } from 'uuid'
import { appendMessage } from './message'
import { createChunk } from './data-mutation'

const LS_KEY = 'pl-editor-project';

// 编译剧本
function compile(state, env = 'development') {
    const doMapping = env === 'development';
    const mapping = {};
    const map = doMapping ? {
        resourceNames: state.resources.map(uid => state.data[uid].name),
        chunkTitles: {},
    } : null;

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
        if (doMapping) {
            map.chunkTitles[instructions.length] = chunk.title;
        }
        instructions.push(
            ['bg', mapping[chunk.background]],
            // ['bgm', mapping[chunk.bgm]],
            ...chunk.sections.reduce((p, s) => 
                (p.push(...s.text
                    .split('\n')
                    .filter(l => !/^\s*$/.test(l))
                    .map(l => ['line', l, mapping[s.speaker]])), p), 
                []),
            ...chunk.exits.map(e => ['option', e.text, e.target]),
        );
    });

    instructions.forEach(ins => {
        if (ins[0] === 'option') {
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

    if (doMapping) {
        script.map = map;
    }

    state.script = script;
    appendMessage(state, `剧本编译完成：${state.name}，ID：${state.id}`);
}

// 缓存工程
function cacheState(state) {
    state.lastModified = Date.now();
    localStorage.setItem(LS_KEY, JSON.stringify({
        id: state.id,
        lastModified: state.lastModified,
        name: state.name,
        version: state.version,
        authors: state.authors,
        data: state.data,
        resources: state.resources,
        roles: state.roles,
        chunks: state.chunks,
    }));
    appendMessage(state, `缓存完成：${state.name}，ID：${state.id}`);
}

// 下载工程
function downloadProject(state) {
    const data = {
        id: state.id,
        lastModified: state.lastModified,
        name: state.name,
        version: state.version,
        authors: state.authors,
        data: state.data,
        resources: state.resources,
        roles: state.roles,
        chunks: state.chunks,
    };
    download(JSON.stringify(data), data.name + '.proj.json', 'application/json');
}

// 从本地文件缓存读取工程
function loadProjectFromCache(state) {
    const json = localStorage.getItem(LS_KEY);
    if (json) {
        overriteState(state, JSON.parse(json));
    }
}

// 从浏览器缓存读取工程
function loadProjectFromFile(state, file) {
    const reader = new FileReader();
    reader.onload = () => {
        overriteState(state, JSON.parse(reader.result));
    }
    reader.readAsText(file);
}

// 下载剧本
function downloadScript(state) {
    const script = state.script;
    if (script) {
        download(JSON.stringify(script), (script.name || '未命名') + '.json', 'application/json');
    }
}

function overriteState(state, obj) {
    Object.assign(state, {
        id: genId(),
        lastModified: Date.now(),
        name: '未命名',
        version: '1.0.0',
        authors: [],
        data: {},
        resources: [],
        roles: [],
        chunks: [],
        script: null,
    }, obj);
    appendMessage(state, `载入剧本完成：${obj.name}，ID：${obj.id}`);
}

function exportToText(state, {selectedChunks, withName, reduceName, withTitle, quotedTitle, withSubtitle}) {
    const text = 
        selectedChunks
        .map(id => state.data[id])
        .filter(c => !!c)
        .reduce((t, c) => {
            if (withTitle) {
                t.push(quotedTitle ? `【${c.title}】` : c.title);
            }
            if (withSubtitle) {
                t.push(c.subtitle);
            }
            t.push('');
            const lines = c.sections.map(s => 
                s.text.split('\n')
                .filter(l => !/^\s*$/.test(l))
                .map(l => [s.speaker, l])
            ).flat();
            if (lines.length) {
                if (withName) {
                    let prevSpeaker = null;
                    for (const line of lines) {
                        if (!reduceName || line[0] !== prevSpeaker) {
                            const role = state.data[line[0]];
                            t.push(`${role ? role.name : '无名氏'}: ${line[1]}`);
                        } else {
                            t.push('    ' + line[1]);
                        }
                        prevSpeaker = line[0];
                    }
                } else {
                    t.push(...lines.map(l => l[1]))
                }
                t.push('');
            }
            return t;
        }, [])
        .join('\n');
    const fileName = state.name + '.txt';
    download(text, fileName, 'text/plain');
    appendMessage(state, '开始导出纯文本：' + fileName);
}

function importFromText(state, {appendToNewChunk, targetChunk, targetSection, autoDetectSpeaker, primarySpeaker, secondarySpeaker, text}) {
    const sections = text.split('\n').filter(e => !/^\s*$/.test(e)).map(text => ({speaker: null, text}));
    if (autoDetectSpeaker) {
        const speakerNames = state.roles.map(id => state.data[id]).reduce((p, r) => (p[r.name] = r.id, p), {})
        sections.forEach(sec => {
            const match = /:|：/.exec(sec.text);
            if (match && match.index > 0) {
                const speakerName = sec.text.slice(0, match.index).trim();
                sec.text = sec.text.slice(match.index + 1).trim;
                sec.speaker = speakerNames[speakerName] || null;
            }
        });
    } else {
        sections.forEach((sec, i) => sec.speaker = i % 2 ? secondarySpeaker : primarySpeaker);
    }
    const chunk = appendToNewChunk ? {sections} : state.data[targetChunk];
    if (chunk) {
        targetSection = targetSection || chunk.sections.length;
        chunk.sections.splice(targetSection, 0, ...sections);
    }
    if (appendToNewChunk) {
        createChunk(state, {...chunk, cb: c => appendMessage(state, `导入${sections.length}行纯文本到：【${c.title}】`)});
    }
}

export {
    compile,
    cacheState,
    downloadProject,
    downloadScript,
    loadProjectFromFile,
    loadProjectFromCache,
    exportToText,
    importFromText,
}