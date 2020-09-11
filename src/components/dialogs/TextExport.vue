<template>
    <v-card>
        <v-container>
            <v-row>
                <v-select
                    label="文本段"
                    chips
                    deletable-chips
                    multiple
                    :items="chunkList"
                    item-value="id"
                    item-text="title"
                    v-model="selectedChunks"
                />
            </v-row>

            <v-row class="d-flex justify-space-around">
                <v-switch label="显示发言者" v-model="withName" />

                <v-switch
                    label="缩减姓名数量"
                    hint="一个角色说了很多话也只显示一次名字"
                    v-model="reduceName"
                    :disabled="!withName"
                />
            </v-row>

            <v-row class="d-flex justify-space-around">
                <v-switch label="显示标题" v-model="withTitle" />

                <v-switch
                    label="给标题加括号"
                    hint="例如：【第一章】"
                    v-model="quotedTitle"
                    :disabled="!withTitle"
                />
                
                <v-switch label="显示副标题" v-model="withSubtitle" />
            </v-row>

            <v-row class="d-flex justify-space-around">
                <v-btn color="primary" @click="doExport">
                    <v-icon>mdi-export</v-icon>导出
                </v-btn>

                <v-btn @click="closeDialog">
                    <v-icon>mdi-cancel</v-icon>取消
                </v-btn>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
    name: "TextExport",

    data() {
        return {
            selectedChunks: [],
            withName: true,
            reduceName: true,
            quotedTitle: true,
            withTitle: true,
            withSubtitle: true,
        };
    },

    computed: {
        ...mapState(["data", "chunks"]),

        chunkList() {
            return this.chunks.map((id) => this.data[id]);
        },
    },

    methods: {
        ...mapMutations(["exportToText", "closeDialog"]),

        doExport() {
            this.exportToText({
                selectedChunks: this.selectedChunks,
                withName: this.withName,
                reduceName: this.reduceName,
                quotedTitle: this.quotedTitle,
                withTitle: this.withTitle,
                withSubtitle: this.withSubtitle,
            });
            this.closeDialog();
        },
    },
};
</script>