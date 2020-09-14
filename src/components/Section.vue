<template>
    <div
        class="section d-flex align-start"
        align="start"
        @mouseenter="showBtnBar = true"
        @mouseleave="showBtnBar = false"
    >
        <span class="d-flex align-center">
            <!-- 行号 -->
            <span class="line-number text-subtitle-2 mr-3">{{ index + 1 }}</span>
            
            <span class="speaker">
                <RoleSelector v-model="speaker"/>
            </span>
            
            <span>:</span>
        </span>

        <!-- 文本输入 -->
        <span class="text mx-2 flex-grow-1" @click="focus">
            <v-textarea
                v-if="editText"
                rows="1"
                auto-grow
                dense
                hide-details
                ref="textInput"
                class="text-input py-0"
                v-model="text"
                @keydown="handleInputKey"
                @blur="editText = false"
            />

            <p 
                v-else 
                class="pt-2 mb-0"
                v-for="(line, index) of lines"
                :key="index"
            >{{ line }}</p>
        </span>

        <!-- 增减工具 -->
        <v-expand-x-transition>
            <v-btn-toggle 
                v-if="showBtnBar && !editText"
                class="btn-tgl my-0 py-0"
                dense
                rounded
                borderless
            >
                <!-- 在当前行之前插入一行 -->
                <v-btn 
                    icon 
                    height="1.8em"
                    class="delete-btn" 
                    color="green"
                    @click="$emit('add-line', index)"
                ><v-icon>mdi-plus</v-icon></v-btn>
                
                <!-- 删去该行 -->
                <v-btn 
                    v-if="!isOnly"
                    icon 
                    height="1.8em"
                    class="delete-btn" 
                    color="red"
                    @click="$emit('delete-line', index)"
                ><v-icon>mdi-minus</v-icon></v-btn>
            </v-btn-toggle>
        </v-expand-x-transition>
    </div>
</template>

<script>

import RoleSelector from './RoleSelector.vue'
import { mutateWatcher } from '../utils/vue-util'
import { mapState } from 'vuex';

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
            speaker: this.section.speaker,
            text: this.section.text,
            
            showBtnBar: false,
            editText: false,
        };
    },

    watch: {
        ...mutateWatcher('section', 'speaker', 'text'),

        section(val) {
            this.speaker = val.speaker;
            this.text = val.text;
        },
    },

    computed: {
        ...mapState(['data', 'roles']),

        lines() {
            return this.text.split('\n').filter(l => !/^\s*$/.test(l)).map(l => l.trim());
        },

        speakerName() {
            if (this.speaker) {
                const role = this.data[this.speaker];
                if (role && role.pic) {
                    return role.name;
                }
            }
            return '      ';
        },

        speakerPicUrl() {
            if (this.speaker) {
                const role = this.data[this.speaker];
                if (role) {
                    const res = this.data[role.avatar || role.pic];
                    if (res) {
                        return res.src;
                    }
                }
            }
            return null;
        },
    },

    methods: {
        focus(selectionStart = -1, selectionEnd = -1) {
            if (selectionStart < 0) {
                selectionStart = selectionEnd = this.text.length;
            }
            if (selectionEnd < 0) {
                selectionEnd = selectionStart;
            }
            if (this.editText) {
                const ipt = this.$refs.textInput;
                ipt.focus();
            } else {
                this.editText = true;
                this.$nextTick(() => {
                    const ipt = this.$refs.textInput;
                    ipt.focus();
                });
            }
        },

        handleInputKey(event) {
            let doPreventDefault = true;
            if (!event.ctrlKey) {
                return;
            }
            switch(event.key) {
                case 'Enter': {
                    const ipt = event.target;
                    if (/^\s*$/.test(this.section.text)) {
                        this.$emit('add-line', this.index + 1);
                    } else {
                        const start = Math.min(ipt.selectionStart, ipt.selectionEnd);
                        const end = Math.max(ipt.selectionStart, ipt.selectionEnd);
                        const append = this.text.slice(end);
                        this.text = this.text.slice(0, start);
                        this.$emit('add-line', this.index + 1, append);
                    }
                } break;
                case 'Backspace': {
                    const ipt = event.target;
                    if (/^\s*$/.test(this.section.text)) {
                        this.$emit('delete-line', this.index);
                    } else if (this.index > 0 && ipt.selectionStart === 0 && ipt.selectionEnd === 0) {
                        this.$emit('delete-line', this.index, this.text);
                    } else {
                        doPreventDefault = false;
                    }
                } break;
                case 'ArrowUp': this.$emit('focus', this.index - 1); break;
                case 'ArrowDown': this.$emit('focus', this.index + 1); break;
                case 'ArrowLeft': this.toggleRole(-1); break;
                case 'ArrowRight': this.toggleRole(1); break;
                default: doPreventDefault = false;
            }

            if (doPreventDefault) {
                event.preventDefault();
                // event.stopPropagation();
            }
        },

        toggleRole(offset = 1) {
            const currentIndex = this.roles.indexOf(this.speaker);
            if (currentIndex < 0) {
                this.speaker = this.roles.length ? this.roles[0] : null;
                return;
            }
            let index = currentIndex + offset;
            if (index < 0) {
                index += (Math.floor(Math.abs(index) / this.roles.length) + 1) * this.roles.length;
            }
            if (index >= this.roles.length) {
                index %= this.roles.length;
            }
            this.speaker = this.roles[index];
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
    line-height: 1em;
}

.text > p {
    line-height: 1em;
}

.selected {
    background-color: #0000000F;
}

.text {
    min-height: 2.5em;
}
</style>