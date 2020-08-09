<template>
  <div class="chunk fill">
    <!-- 背景预览 -->
    <v-img
        class="background"
        cover
        width="100%"
        gradient="#ffffffaf 0%, #ffffffaf 50%, #fff 100%"
        :src="backgroundUrl"
    />

    <v-container class="fill pa-0 d-flex flex-column">

        <v-toolbar dense class="topbar flex-grow-0">
            <v-app-bar-nav-icon @click="showInfo = !showInfo"/>
            
            <v-toolbar-title>{{ chunk.title }}</v-toolbar-title>

            <v-spacer/>

            <v-btn icon @click="deleteSelf"><v-icon>mdi-delete</v-icon></v-btn>

            <v-slide-y-transition>
                <div 
                    v-show="showInfo"
                    class="chunkInfo px-15"
                >
                    <!-- 输入标题 -->
                    <v-row align="baseline">
                        <v-col cols="2">标题</v-col>
                        <v-col cols="10">
                            <input 
                                class="text-h4"
                                type="text"
                                v-model="chunk.title"
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
                                v-model="chunk.subtitle"
                                placeholder="此处输入副标题"
                            />
                        </v-col>
                    </v-row>

                    <!-- 选择背景 -->
                    <v-row align="baseline">
                        <v-col cols="2">背景</v-col>
                        <v-col cols="10">
                            <v-autocomplete 
                                dense
                                hide-details="auto"
                                no-data-text="无可用资源"
                                class="text-subtitle-1"
                                :items="resList"
                                item-text="name"
                                item-value="uid"
                                v-model="chunk.background"
                                placeholder="选择背景"
                            />
                        </v-col>
                    </v-row>

                    <!-- 选择BGM -->
                    <v-row align="baseline">
                        <v-col cols="2">BGM</v-col>
                        <v-col cols="10">
                            <v-autocomplete 
                                dense
                                hide-details="auto"
                                no-data-text="无可用资源"
                                class="text-subtitle-1"
                                :items="resList"
                                item-text="name"
                                item-value="uid"
                                v-model="chunk.bgm"
                                placeholder="选择BGM"
                            />
                        </v-col>
                    </v-row>

                    <v-container>
                        <v-row
                            v-for="(exit, index) of chunk.exits"
                            :key="index"
                        >
                            <v-col cols="1">{{ index + 1 }}</v-col>
                            <v-col cols="8"><input v-model="exit.text"/></v-col>
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
                            <v-col cols="1"><v-btn @click="deleteExit(index)">删除</v-btn></v-col>
                        </v-row>
                        <v-row>
                            <v-btn block @click="addExit">新分支</v-btn>
                        </v-row>
                    </v-container>
                </div>
            </v-slide-y-transition>
        </v-toolbar>

        


        <v-divider/>

        <!-- 具体段落 -->
        <v-virtual-scroll 
            class="content overflow-auto ma-0 px-15 py-2 flex-grow-1"
            item-height="35"
            :items="chunk.sections"
        >
            <template v-slot="{ item, index }">
                <Section
                    ref="section"
                    :index="index"
                    :section="item"
                    :is-only="chunk.sections.length === 1"
                    @add-line="addLine"
                    @delete-line="deleteLine"
                />
            </template>
        </v-virtual-scroll>

        <v-row class="flex-grow-0 pa-2">
            <v-btn
                ref="btnAdd"
                block
                @click="addLine"
                elevation="0"
            >
                <v-icon>mdi-plus</v-icon>
                新台词
            </v-btn>
        </v-row>
    </v-container>
  </div>
</template>

<script>
import state from '@/state.js'

const project = state.project;

import Section from '@/components/Section.vue'

  export default {
    name: 'Chunk',

    components: {
        Section
    },

    props: {
        chunk: Object,
        index: Number,
    },

    data() {
        return {
            showInfo: false,
        };
    },

    computed: {
        resList() {
            return project.resources.map(uid => ({uid, ...project.data[uid]}));
        },

        chunkList() {
            return project.chunks.map(uid => ({uid, title: project.data[uid].title}));
        },

        backgroundUrl() {
            if (this.chunk.background) {
                const res = project.data[this.chunk.background];
                return res ? res.src : null;
            }
            return null;
        },

        data: () => project.data,
        roles: () => project.roles,
    },

    methods: {
        addLine(index) {
            if ('number' !== typeof index || index < 0 || index > this.chunk.sections.length) {
                index = this.chunk.sections.length;
            }
            const speaker = index ? this.chunk.sections[index - 1].speaker : null;
            const section = {speaker, text: ''};
            this.chunk.sections.splice(index, 0, section);
            this.$nextTick(() => this.focusOnSection(index));
        },

        deleteLine(index) {
            this.chunk.sections.splice(index, 1);
        },

        addExit() {
            this.chunk.exits.push({
                text: '',
                target: null,
            });
        },

        deleteExit(index) {
            this.chunk.exits.splice(index, 1);
        },

        deleteSelf() {
            const uid = project.chunks[this.index];
            project.chunks.splice(this.index, 1);
            delete project.data[uid];
        },

        focusOnSection(index) {
            this.$refs.section[index].focus();
        },
    }
  }
</script>

<style lang="scss" scoped>
.chunk {
    z-index: 1;
    position: relative;
    overflow: hidden;

    .topbar {
        z-index: 6;
        position: relative;

        * {
            z-index: 6;
        }

        .chunkInfo {
            margin-left: 1em;
            position: absolute;
            top: 100%;
            width: 100%;
            background-color: #FFFFFFD0;
            backdrop-filter: blur(5px);
        }
    }

    .background {
        position: absolute;
    }

    .content {
        z-index: 2;

        * {
            z-index: 2;
        }
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
