const EXIT = 0x00; // no param
const SET_BACKGROUND = 0x01; // params: bgAddr
const SET_BGM = 0x02; // params: bgmAddr
const SET_PIC = 0x03; // params: picAddr
const SET_LINE = 0x03; // params: textAddr, nameAddr
const ADD_OPTION = 0x04; // params: textAddr, targetAddr

function compile({data, roles, resources, chunks, name, version, authors, entry, tip}) {
    const doMapping = tip === 'development';
	
	const mapping = {};
    const strings = [...roles.map(r => r.name), ...chunks.map(c => c.map())]; // 字符串常量池
    const files = []; // 文件池
    const instructions = chunks // 指令
        .map(id => data[id])
        .map(chunk => {
            return [
                [SET_BACKGROUND, chunk.background],
            ]
        });

    const ids = {}; // id对应的地址





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
}

export {
    compile,
}