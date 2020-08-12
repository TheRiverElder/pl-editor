import { v4 as uuidv4 } from 'uuid'
import { loadCachedProject } from '@/utils/storage.js'

function prepareProject(project) {
    if (!project) {
        project = {
            info: {
                name: '未命名剧本',
                version: '1.0.0',
                authors: ['RiverElder'],
            },
        
            data: {},
            
            chunks: [],
            roles: [],
            resources: [],
        
            addData(newData) {
                const uid = uuidv4();
                this.data[uid] = newData;
                return uid;
            }
        };
    }
    project.addData = function addData(newData) {
        const uid = uuidv4();
        this.data[uid] = newData;
        return uid;
    };
    return project;
}

const state = {

    project: prepareProject(loadCachedProject()),

    script: null,

    chunkEditorBar: {
        selectState: new Set(),
        primaryRoleUid: null,
        secondaryRoleUid: null,
        fillMode: 'all', // or 'alternate'
        clickMode: 'fill', // or select

        selectRange(fromIndex, toIndex) {
            for(let i = fromIndex; i <= toIndex; i++) {
                this.selectState.add(i);
            }
        },
    },
};

export default state;