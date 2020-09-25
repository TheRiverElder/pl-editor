<template>
    <div
        class="section d-flex align-start"
        align="start"
        @mouseenter="showBtnBar = true"
        @mouseleave="showBtnBar = false"
    >
        <span class="speaker">
            <RoleSelector v-model="speaker"/>
        </span>
        
        <span>:</span>

        <!-- 文本输入 -->
        <span class="text mx-2 flex-grow-1" @click="focus">
            <v-text-field
                v-if="editText"
                dense
                hide-details
                ref="textInput"
                class="text-input py-0"
                v-model="text"
                @keydown="handleInputKey"
                @focus="$emit('focus')"
                @blur="editText = false"
            />

            <p 
                v-else 
                class="pt-2 mb-0"
            >{{ text }}</p>
        </span>
    </div>
</template>

<script>

import RoleSelector from '../RoleSelector.vue'
import { mapState } from 'vuex';

export default {
    name: 'LineSetting',

    components: {
        RoleSelector,
    },

    props: {
        index: Number,
        value: Object,
        manager: Object,
    },

    data() {
        return {
            speaker: this.value.speaker,
            text: this.value.text,
            editText: false,
        };
    },

    watch: {

        speaker(val) {
            this.$emit('input', {speaker: val});
        },

        text(val) {
            this.$emit('input', {text: val});
        },

        value(val) {
            this.speaker = val.speaker;
            this.text = val.text;
        },
    },

    computed: {
        ...mapState(['data', 'roles']),

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
            this.$emit('focus');
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
            // if (!event.ctrlKey) {
            //     return;
            // }
            switch(event.key) {
                case 'Enter': {
                    const ipt = event.target;
                    if (/^\s*$/.test(this.value.text)) {
                        this.manager.addLine(this.index + 1);
                    } else {
                        const start = Math.min(ipt.selectionStart, ipt.selectionEnd);
                        const end = Math.max(ipt.selectionStart, ipt.selectionEnd);
                        const append = this.text.slice(end);
                        this.text = this.text.slice(0, start);
                        this.manager.addLine(this.index + 1, append);
                    }
                } break;
                case 'Backspace': {
                    const ipt = event.target;
                    if (/^\s*$/.test(this.value.text)) {
                        this.manager.deleteSection(this.index);
                    } else if (this.index > 0 && ipt.selectionStart === 0 && ipt.selectionEnd === 0) {
                        this.manager.deleteSection(this.index, this.text);
                    } else {
                        doPreventDefault = false;
                    }
                } break;
                case 'ArrowUp': this.manager.focusOnSection(this.index - 1); break;
                case 'ArrowDown': this.manager.focusOnSection(this.index + 1); break;
                case 'ArrowLeft': if (event.ctrlKey) {
                    this.toggleRole(-1);
                } else {
                    doPreventDefault = false;
                } break;
                case 'ArrowRight': if (event.ctrlKey) {
                    this.toggleRole(1);
                } else {
                    doPreventDefault = false;
                } break;
                case ' ': if (event.ctrlKey) {
                    this.manager.addRoleMutation(this.index + 1);
                } else {
                    doPreventDefault = false;
                } break;
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