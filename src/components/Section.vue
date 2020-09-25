<template>
    <div 
        class="d-flex p-relative align-center"
        @mouseenter="showBtnBar = true"
        @mouseleave="showBtnBar = showBtns = false"
    >
        <!-- 行号 -->
        <span class="line-number text-subtitle-2 mr-3">{{ index + 1 }}</span>

        <RoleMutation 
            class="flex-grow-1"
            v-if="type === types.MUTATE_ROLES"
            :value="value"
            @input="handleInput"
        />

        <LineSetting 
            class="flex-grow-1"
            v-else-if="type === types.SET_LINE"
			ref="line"
            :index="index"
            :value="value"
            :manager="manager"
            @input="handleInput"
            @focus="showBtnBar = false"
        />

        <div class="flex-grow-1" v-else>未知类型：{{ value.type }}</div>

        <!-- 工具 -->
        <div
			v-if="showBtnBar"
			class="p-absolute abs-top abs-right d-flex flex-row-reverse"
        >
			<v-btn
				class="my-0 py-0"
                icon
				@click="showBtns = !showBtns"
            ><v-icon>mdi-more</v-icon></v-btn>
		
			<v-expand-x-transition>
				<v-btn-toggle 
					v-if="showBtns"
					rounded
					dense
				>
					<!-- 在当前行之前插入一行 -->
					<v-btn 
						@click="$emit('add-line', index)"
					><v-icon>mdi-plus</v-icon>插入台词</v-btn>
					
					<!-- 删去该行 -->
					<v-btn 
						icon 
						color="warning"
						@click="$emit('delete-line', index)"
					><v-icon>mdi-minus</v-icon></v-btn>
					
					<!-- 改变类型 -->
					<v-btn 
						@click="$emit('add-role-mutation', index)"
					><v-icon>mdi-plus</v-icon>演员调度</v-btn>
				</v-btn-toggle>
			</v-expand-x-transition>
        </div>
    </div>
</template>

<script>
import RoleMutation from './lines/RoleMutation.vue'
import LineSetting from './lines/LineSetting.vue'
import { EditorLineType } from '../common.js'


export default {
    name: 'Section',

    components: {
        RoleMutation,
        LineSetting,
    },

    props: {
        index: Number,
        value: Object,
        type: String,
        manager: Object,
    },

    data() {
        return {
            showBtnBar: false,
            showBtns: false,
        };
    },

    computed: {
        types() {
            return EditorLineType;
        },
    },

    methods: {

        handleInput(d) {
            this.$emit('input', this.index, d)
        },
		
		
        focus(selectionStart = -1, selectionEnd = -1) {
            if (this.$refs.line && this.$refs.line.focus) {
				this.$refs.line.focus(selectionStart, selectionEnd);
			}
        },
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