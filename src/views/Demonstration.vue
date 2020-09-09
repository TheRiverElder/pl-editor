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

        <div class="content fill pa-3 d-flex flex-column justify-end">
            <div class="text oculus mb-3 pa-2">
                {{ speakerName }}：{{ text }}
            </div>

            <ul class="options oculus pa-2">
                <li 
                    class="option pa-2"
                    v-for="(option, index) of options"
                    :key="index"
                    @click="handleClickOption"
                >
                   {{ option.text }}
                </li> 

                <li 
                    v-if="!options.length" 
                    class="option"
                    @click="handleClickDefaultOption"
                >...</li>
            </ul>

        </div>

        <div class="debug-panel absolute pa-3">
            <div class="d-flex justify-center">
                <v-input
                    label="指针："
                >
                    <input
                        type="number"
                        :min="0"
                        :max="script.instructions.length - 1"
                        v-model.number="pointer"
                    />
                </v-input>

                <v-btn @click="forceRun">执行</v-btn>
            </div>

            <ul>
                <li
                    v-for="(log, index) of logger"
                    :key="index"
                >{{ log }}</li>
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
            this.log(instruction.join(' '));
            switch (instruction[0]) {
                case 'bg': 
                    this.background = this.script.resources[instruction[1]];
                    break;
                case 'bgm': 
                    this.bgm = this.script.resources[instruction[1]];
                    break;
                case 'line': {
                    this.text = instruction[1];
                    const role = this.script.roles[instruction[2]];
                    this.speakerPic = this.script.resources[role.pic];
                    this.speakerName = role.name;
                    this.options = [];
                    this.hasSetText = true;
                } break;
                case 'option': 
                    this.options.push({
                        text: instruction[1],
                        target: instruction[2],
                    });
                    break;
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

        log(msg) {
            if (this.logger.length >= 10) {
                this.logger.shift();
            }
            this.logger.push(msg);
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

.debug-panel {
    top: 0;
    z-index: 10;
    width: 100%;
    max-height: 50%;
    background-color: #FFFFFF80;
}

</style>
