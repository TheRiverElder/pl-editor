<template>
    <div
        :class="'section d-flex align-start' + (selected ? ' selected' : '')"
        align="start"
        @mouseenter="showBtnBar = true"
        @mouseleave="showBtnBar = false"
        @click.shift.exact.stop="handleClick"
    >
        <span class="mt-2 d-flex align-center">
            <!-- 行号 -->
            <span class="line-number text-subtitle-2 mr-3">{{ index + 1 }}</span>
            
            <span class="speaker">
                <RoleSelector v-model="speaker"/>
            </span>
            
            <span>:</span>
        </span>

        <!-- 文本输入 -->
        <span class="mx-2 flex-grow-1">
            <v-textarea
                rows="1"
                auto-grow
                dense
                hide-details
                ref="textInput"
                class="text-input py-1"
                v-model="text"
                @keyup="handleInputKey"
            />
        </span>

        <!-- 增减工具 -->
        <v-expand-x-transition>
            <v-btn-toggle 
                v-if="showBtnBar"
                class="btn-tgl mt-2"
                dense
                rounded
                borderless
            >
                <!-- 在当前行之前插入一行 -->
                <v-btn 
                    icon 
                    height="2em"
                    class="delete-btn" 
                    color="green"
                    @click="$emit('add-line', index)"
                ><v-icon>mdi-plus</v-icon></v-btn>
                
                <!-- 删去该行 -->
                <v-btn 
                    v-if="!isOnly"
                    icon 
                    height="2em"
                    class="delete-btn" 
                    color="red"
                    @click="$emit('delete-line', index)"
                ><v-icon>mdi-minus</v-icon></v-btn>
            </v-btn-toggle>
        </v-expand-x-transition>
    </div>
</template>

<script>
import state from '@/state.js'

import RoleSelector from './RoleSelector.vue'

const project = state.project;

export default {
    name: 'Section',

    components: {
        RoleSelector,
    },

    props: {
        index: Number,
        section: Object,
        isOnly: Boolean,
    },

    data() {
        return {
            showBtnBar: false,
            speaker: null,
            text: '',
        };
    },

    watch: {
        speaker(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.$emit('mutate');
            }
        },
        
        text(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.$emit('mutate');
            }
        },
    },

    computed: {
        data: () => project.data,
        
        roleList() {
            return project.roles.map(uid => ({uid, ...project.data[uid]}));
        },

        speakerName() {
            if (this.section.speaker) {
                const role = project.data[this.section.speaker];
                if (role && role.pic) {
                    return role.name;
                }
            }
            return '      ';
        },

        speakerPicUrl() {
            if (this.section.speaker) {
                const role = project.data[this.section.speaker];
                if (role) {
                    const res = project.data[role.avatar || role.pic];
                    if (res) {
                        return res.src;
                    }
                }
            }
            return null;
        },

        selected() {
            return state.chunkEditorBar.selectState.has(this.index);
        },
    },

    methods: {
        focus() {
            this.$refs.textInput.focus();
        },

        handleClick() {
            if (state.chunkEditorBar.clickMode === 'select') {
                if (state.chunkEditorBar.selectState.has(this.index)) {
                    state.chunkEditorBar.selectState.delete(this.index);
                } else {
                    state.chunkEditorBar.selectState.add(this.index);
                }
            } else if (state.chunkEditorBar.clickMode === 'fill') {
                this.section.speaker = state.chunkEditorBar.primaryRoleUid || this.section.speaker;
            }
        },

        handleInputKey(event) {
            let doPreventDefault = true;
            if (!event.ctrlKey) {
                return;
            }
            switch(event.key) {
                case 'Enter': this.$emit('add-line', this.index + 1); break;
                case 'ArrowUp': this.$emit('focus', this.index - 1); break;
                case 'ArrowDown': this.$emit('focus', this.index + 1); break;
                case 'Backspace': {
                    if (/^\s*$/.test(this.section.text)) {
                        this.$emit('delete-line', this.index);
                    }
                } break;
                default: doPreventDefault = false;
            }

            if (doPreventDefault) {
                event.preventDefault();
            }
        }
    },

}
</script>

<style lang="scss" scoped>
.section {
    width: 100%;

    * {
        z-index: inherit;
    }
}

.line-number {
    width: 2.5em;
    text-align: right;
}

.speaker-input, 
.speaker {
    width: 6em;
}

.speaker {
    text-overflow: ellipsis;
}

.inline {
    display: inline;
}

.text-input {
    width: 100%;
    resize: none;
    outline: none;
}

.selected {
    background-color: #0000000F;
}
</style>