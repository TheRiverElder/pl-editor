<template>
    <div
        class="d-flex justify-center align-center"
    >
        <span class="text-subtitle-1 mx-2">工具</span>
        <v-btn-toggle 
            v-model="clickMode"
            dense
            rounded
        >
            <v-btn value="fill">填充</v-btn>
            <v-btn value="select">选择</v-btn>
        </v-btn-toggle>

        <v-chip class="mx-2">
            <span class="text-subtitle-1 mx-2">初选角色</span>
            <RoleSelector v-model="primaryRoleUid"/>
        </v-chip>

        <v-chip class="mx-2">
            <span class="text-subtitle-1 mx-2">次选角色</span>
            <RoleSelector v-model="secondaryRoleUid"/>
        </v-chip>


        <v-btn-toggle 
            dense
            rounded
        >
            <v-btn value="fill">全选</v-btn>
            <v-btn value="select">全不选</v-btn>
        </v-btn-toggle>
        
        <span class="text-subtitle-1 mx-2">填充</span>
        <v-btn-toggle 
            dense
            rounded
        >
            <v-btn value="fill">全部</v-btn>
            <v-btn value="select">交替</v-btn>
        </v-btn-toggle>
    </div>
</template>

<script>
import RoleSelector from '@/components/RoleSelector.vue'

import state from '@/state.js'

const chunkEditorBar = state.chunkEditorBar;

export default {
    name: 'ChunkEditorBar',

    components: {
        RoleSelector,
    },

    data:() => chunkEditorBar,

    methods: {
    }

}
</script>

<style scoped>

</style>