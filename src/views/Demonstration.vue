<template>
    <div class="relative fill">
        <img 
            class="background fill absolute"
            :src="background"
        />

        <audio 
            ref="bgm"
            :src="bgm"
            loop
        />

        <img 
            class="speaker fill absolute"
            :src="speakerPic"
        />

        <v-toolbar 
            class="debuger absolute"
            :collapse="openDebuger"
            extension-height="200"
        >
            <v-app-bar-nav-icon @click="openDebuger = !openDebuger"/>

            <v-toolbar-title>调试工具</v-toolbar-title>

            <template class="d-flex align-start" v-slot:extension>
                <div class="align-self-start d-flex align-center">
                    <label>指令指针：</label>

                    <input
                        type="number"
                        :min="0"
                        :max="script.instructions.length - 1"
                        v-model.number="pointer"
                    />

                    <v-btn text small @click="forceRun">执行</v-btn>
                </div>

                <ul class="align-self-start fill-y overflow-auto flex-grow-1">
                    <li
                        v-for="(log, index) of logger"
                        :key="index"
                    >{{ log }}</li>
                </ul>
            </template>
        </v-toolbar>

        <div class="content fill pa-3 d-flex flex-column justify-end">
            <div class="text oculus mb-3 pa-2">
                {{ speakerName }}：{{ line }}
            </div>

            <ul class="options oculus pa-2">
                <li 
                    class="option pa-2"
                    v-for="(option, index) of options"
                    :key="index"
                    @click="handleClickOption(index)"
                >{{ option.text }}</li> 

                <li 
                    v-if="!options.length" 
                    class="option"
                    @click="handleClickDefaultOption"
                >...</li>
            </ul>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Demonstration',

    data() {
        return {
            pointer: 0,
            background: null,
            bgm: null,
            speakerName: '',
            speakerPic: null,
            line: '',
            options: [],
            
            hasSetText: false,
            logger: [],
            openDebuger: false,
        };
    },

    watch: {
        bgm(nv, ov) {
            if (nv !== ov && 'string' === typeof nv && nv.length > 0) {
                this.$refs.bgm.play();
            }
        },
    },

    computed: {
        ...mapState(['script']),
    },

    methods: {
        run() {
            while (this.pointer < this.script.instructions.length && this.canStepIn(this.script.instructions[this.pointer])) {
                this.apply(this.script.instructions[this.pointer]);
                this.pointer++;
            }
        },

        forceRun() {
            this.hasSetText = false;
            this.run();
        },

        apply(instruction) {
            const script = this.script;
            switch (instruction[0]) {
                case 'bg': {
                    const resIndex = instruction[1];
                    this.background = script.resources[resIndex];
                    this.log('设置背景', script.map ? script.map.resourceNames[resIndex] : this.background.slice(-32));
                } break;
                case 'bgm': 
                    this.bgm = script.resources[instruction[1]];
                    break;
                case 'line': {
                    this.line = instruction[1];
                    const role = script.roles[instruction[2]];
                    this.speakerPic = script.resources[role.pic];
                    this.speakerName = role.name;
                    this.options = [];
                    this.hasSetText = true;
                    this.log('说台词', this.speakerName, this.line);
                } break;
                case 'option': {
                    const option = {
                        text: instruction[1],
                        target: instruction[2],
                    };
                    this.options.push(option);
                    this.log('添加选项', option.text, script.map ? script.map.chunkTitles[option.target] : option.target);
                } break;
            }
        },

        canStepIn(instruction) {
            switch (instruction[0]) {
                case 'bg': return true;
                case 'bgm': return true;
                case 'line': return !this.hasSetText;
                case 'option': return this.hasSetText;
            }
        },

        jumpTo(target) {
            this.pointer = target;
        },

        handleClickOption(optIndex) {
            this.hasSetText = false;
            const option = this.options[optIndex];
            this.jumpTo(option.target);
            this.run();
        },

        handleClickDefaultOption() {
            this.hasSetText = false;
            this.run();
        },

        log(...msgs) {
            if (this.logger.length >= 10) {
                this.logger.shift();
            }
            this.logger.push(`[${msgs[0]}] ` + msgs.slice(1).join(' '));
        },
    },

    created() {
        this.run();
    },
}
</script>

<style scoped>

.relative {
    position: relative;
}

.fill {
    width: 100%;
    height: 100%;
}

.absolute {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.background {
    z-index: 1;
    object-fit: cover;
}

.absolute * {
    z-index: inherit;
}

.speaker {
    z-index: 2;
    object-fit: contain;
}

.content {
    z-index: 5;
}

.content * {
    z-index: 5;
}

.oculus {
    background-color: #FFFFFFE0;
}

.text {
    max-height: 5em;
    min-height: 1em;
    overflow-x: hidden;
    overflow-y: auto;
}

.options {
    height: 35%;
    overflow-x: hidden;
    overflow-y: auto;
}

.option {
    user-select: none;
    cursor: pointer;
}

.option:hover {
    background-color: #FFFFFF;
}

.debuger {
    z-index: 100;
    opacity: 50%;
}

</style>
