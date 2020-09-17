<template>
    <v-card height="86vh">
        <v-container class="fill-y d-flex flex-column">
            <v-row class="flex-grow-1">
                <v-col cols="8" class="d-flex flex-column">
                    <span class="flex-grow-0">{{ prevText }}</span>

                    <v-textarea
                        class="flex-grow-1"
                        multi-line
                        rows="10"
                        v-model="text"
                    />

                    <span class="flex-grow-0">{{ nextText }}</span>
                </v-col>

                <v-col cols="4">
                    <v-switch 
                        label="添加到新文本段"
                        v-model="appendToNewChunk"
                    />

                    <v-select
                        label="目标文本段"
                        :disabled="appendToNewChunk"
                        :items="chunkList"
                        item-value="id"
                        item-text="title"
                        v-model="targetChunk"
                    />

                    <v-text-field 
                        label="插入小节位置"
                        type="number"
                        :min="0"
                        :max="chunk.sections.length"
                        :disabled="appendToNewChunk || !targetChunk"
                        v-model.number="targetSection"
                    />

                    <v-switch
                        label="自动识别发言者"
                        v-model.number="autoDetectSpeaker"
                    />

                    <RoleSelector 
                        label="首选发言者" 
                        :disabled="autoDetectSpeaker"
                        v-model="primarySpeaker"
                    />

                    <RoleSelector 
                        label="次选发言者" 
                        :disabled="autoDetectSpeaker"
                        v-model="secondarySpeaker"
                    />
                </v-col>
            </v-row>

            <v-row class="flex-grow-0 d-flex justify-space-around">
                <v-btn color="primary" @click="doImport">
                    <v-icon>mdi-import</v-icon>导入
                </v-btn>

                <v-btn @click="closeDialog">
                    <v-icon>mdi-cancel</v-icon>取消
                </v-btn>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import RoleSelector from '../RoleSelector';
import { mapMutations, mapState } from "vuex";
export default {
    name: "TextImport",

    components: {
        RoleSelector,
    },

    data() {
        return {
            appendToNewChunk: false,
            targetChunk: null,
            targetSection: -1,
            autoDetectSpeaker: false,
            primarySpeaker: null,
            secondarySpeaker: null,
            text: '',

            prevText: '',
            nextText: '',
        };
    },

    watch: {
        targetChunk(nv, ov) {
            if (nv !== ov) {
                this.targetSection = nv ? this.data[nv].sections.length : -1;
            }
        },

        targetSection(val) {
            if (this.targetChunk) {
                const sections = this.data[this.targetChunk].sections;
                this.prevText = val > 0 ? sections[val - 1].text : '';
                this.nextText = val > 0 && val < sections.length ? sections[val].text : '';
            }
        },
    },

    computed: {
        ...mapState(["data", "chunks"]),

        chunkList() {
            return this.chunks.map((id) => this.data[id]);
        },

        chunk() {
            return this.targetChunk ? this.data[this.targetChunk] : {sections: []};
        },
    },

    methods: {
        ...mapMutations(["importFromText", "closeDialog"]),

        doImport() {
            this.importFromText({
                appendToNewChunk: this.appendToNewChunk,
                targetChunk: this.targetChunk,
                targetSection: this.targetSection,
                autoDetectSpeaker: this.autoDetectSpeaker,
                primarySpeaker: this.primarySpeaker,
                secondarySpeaker: this.secondarySpeaker,
                text: this.text,
            });
            this.closeDialog();
        },
    },
};
</script>