<template>
    <div class="chunk max-width-64em px-5">
        <v-container class="pa-0 d-flex flex-column">
            <div class="chunk-info pa-5">
                <!-- 背景预览 -->
                <img
                    class="background"
                    cover
                    width="100%"
                    gradient="#ffffffaf 0%, #ffffffaf 50%, #fff 100%"
                    :src="backgroundUrl"
                />

                <div class="text-right ma-1" @mouseleave="openMenu = false">
                    <v-slide-x-reverse-transition>
                        <span v-show="openMenu">
                            <v-btn small text color="warning" @click="deleteSelf">
                                <v-icon>mdi-delete</v-icon>删除
                            </v-btn>
                        </span>
                    </v-slide-x-reverse-transition>

                    <v-app-bar-nav-icon 
                        @click="openMenu = !openMenu"
                    />
                </div>

                <!-- 输入标题 -->
                <v-row align="baseline">
                    <v-col cols="2">标题</v-col>
                    <v-col cols="10">
                        <input
                            class="text-h4"
                            type="text"
                            v-model="title"
                            placeholder="此处输入标题"
                        />
                    </v-col>
                </v-row>

                <!-- 输入副标题 -->
                <v-row align="baseline">
                    <v-col cols="2">副标题</v-col>
                    <v-col cols="10">
                        <input
                            class="text-subtitle-1"
                            type="text"
                            v-model="subtitle"
                            placeholder="此处输入副标题"
                        />
                    </v-col>
                </v-row>

                <!-- 选择背景 -->
                <v-row align="baseline">
                    <v-col cols="2">背景</v-col>
                    <v-col cols="10">
                        <ResSelector 
                            placeholder="选择背景"
                            v-model="background"
                        />
                    </v-col>
                </v-row>

                <v-container>
                    <v-row v-for="(exit, index) of exits" :key="index">
                        <v-col cols="1">{{ index + 1 }}</v-col>
                        <v-col cols="8">
                            <input v-model="exit.text" />
                        </v-col>
                        <v-col cols="2">
                            <v-select
                                dense
                                hide-details
                                v-model="exit.target"
                                :items="chunkList"
                                item-text="title"
                                item-value="uid"
                            />
                        </v-col>
                        <v-col cols="1">
                            <v-btn @click="deleteExit(index)">删除</v-btn>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-btn text class="mx-auto" @click="addExit">新出口</v-btn>
                    </v-row>
                </v-container>
            </div>
        </v-container>

        <v-divider />

        <!-- 具体段落 -->
        <div class="content">
            <Section
                ref="section"
                v-for="(sec, index) of sections"
                :key="index"
                :index="index"
                :section="sec"
                :is-only="sections.length === 1"
                @add-line="addLine"
                @delete-line="deleteLine"
                @focus="focusOnSection"
                @mutate="$emit('mutate')"
            />
        </div>
        <!-- <v-virtual-scroll 
            class="content overflow-auto ma-0 px-15 py-2 flex-grow-1"
            item-height="35"
            :items="sections"
        >
            <template v-slot="{ item, index }">
                <Section
                    ref="section"
                    :index="index"
                    :section="item"
                    :is-only="sections.length === 1"
                    @add-line="addLine"
                    @delete-line="deleteLine"
                    @focus="focusOnSection"
                />
            </template>
            </v-virtual-scroll>-->

        <v-row class="flex-grow-0 pa-2">
            <v-btn 
                class="mx-auto"
                ref="btnAdd" 
                color="primary" 
                @click="addLine" 
                elevation="0"
            >
                <v-icon>mdi-plus</v-icon>新小节
            </v-btn>
        </v-row>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { mutateWatcher } from '../utils/vue-util'
import ResSelector from './ResSelector'

import Section from "./Section.vue";

export default {
    name: "Chunk",

    components: {
        Section,
        ResSelector
    },

    props: {
        id: String,
    },

    data() {
        const chunk = this.$store.state.data[this.id];
        return {
            title: chunk.title,
            subtitle: chunk.subtitle,
            background: chunk.background,
            // bgm: null,
            sections: chunk.sections,
            exits: chunk.exits,

            openMenu: false,
        };
    },
    

    watch: {
        ...mutateWatcher(null, 'title', 'subtitle', 'background'),
    },

    computed: {
        ...mapState(["data", "chunks"]),

        chunkList() {
            return this.chunks.map((uid) => this.data[uid]);
        },

        backgroundUrl() {
            if (this.background) {
                const res = this.data[this.background];
                return res ? res.src : null;
            }
            return null;
        },
    },

    methods: {
        ...mapMutations(["removeChunk", 'updateData']),

        addLine(index) {
            if ("number" !== typeof index || index < 0 || index > this.sections.length) {
                index = this.sections.length;
            }
            const speaker = index ? this.sections[index - 1].speaker : null;
            const section = { speaker, text: "" };
            this.sections.splice(index, 0, section);
            this.$emit('mutate');
            this.$nextTick(() => this.focusOnSection(index));
        },

        deleteLine(index) {
            this.sections.splice(index, 1);
            this.$emit('mutate');
            this.$nextTick(() => this.focusOnSection(index - 1));
        },

        addExit() {
            this.exits.push({
                text: "",
                target: null,
            });
            this.$emit('mutate');
        },

        deleteExit(index) {
            this.exits.splice(index, 1);
            this.$emit('mutate');
        },

        deleteSelf() {
            this.removeChunk(this.id);
            this.$emit('delete', this.id);
        },

        focusOnSection(index) {
            index = Math.max(0, Math.min(index, this.sections.length - 1));
            const list = this.$refs.section;
            if (list.length && index < list.length) {
                // this.$vuetify.goTo(list[index].$el);
                list[index].focus();
            }
        },

        save() {
            this.updateData({
                id: this.id,
                title: this.title,
                subtitle: this.subtitle,
                background: this.background,
                // bgm: null,
                sections: this.sections,
                exits: this.exits,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.chunk {
    z-index: 1;
    position: relative;
    overflow: hidden;
}

.chunk-info {
    background-color: #ffffff80;
    position: relative;
    overflow: hidden;
    z-index: 2;

    * {
        z-index: 2;
    }

    .background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 0;
        filter: opacity(20%);
    }
}

input {
    width: 100%;
}

p {
    padding: 0;
    margin: 0;
}

.fill {
    width: 100%;
    height: 100%;
}

.overflow-auto {
    overflow: auto;
}
</style>
