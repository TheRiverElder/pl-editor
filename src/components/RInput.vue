<template>
    <textarea
        v-if="multiline"
        ref="input"
        v-model="text"
        :placeholder="placeholder"
        @focus="$emit('focus')"
        @blur="handleBlur"
    ></textarea>
    <input
        v-else
        ref="input"
        type="text"
        v-model="text"
        :placeholder="placeholder"
        @keyup="handleKeyUp"
        @focus="$emit('focus')"
        @blur="handleBlur"
    />
</template>

<script>
export default {
    name: 'RInput',

    props: {
        // 多行
        multiline: {
            type: Boolean,
            default: false,
        },
        // 提示文本
        placeholder: {
            type: String,
            default: '',
        },
        // 按住shift时按下enter键才触发confirm，否则仅仅按下enter即可触发confirm
        shiftToConfirm: {
            type: Boolean,
            default: false,
        },
        // 在blur时触发confirm事件
        confirmOnBlur: {
            type: Boolean,
            default: false,
        },
        // 初始数据值
        value: {
            type: String,
            default: '',
        }
    },

    data() {
        return {
            text: this.value,
        };
    },

    methods: {
        handleKeyUp(event) {
            if (event.key === 'Enter') {
                if (this.shiftToConfirm && !event.shiftKey) return;
                this.confirm();
                this.blur();
            }
        },

        handleBlur() {
            if (this.confirmOnBlur) {
                this.confirm();
            } else {
                this.reset();
            }
        },

        confirm() {
            this.$emit('confirm', this.text);
        },

        reset() {
            this.text = this.value;
        },

        focus() {
            this.$refs.input.focus();
        },

        blur() {
            this.$refs.input.blur();
        },
    }

}
</script>

<style scoped>

</style>