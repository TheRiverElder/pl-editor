<template>
    <span 
        v-if="changingRole"
        class="role"
        @blur="changingRole = false"
    >
        <v-select
            class="ma-0"
            dense
            hide-details="auto"
            height="1em"
            :items="roleList"
            v-model="roleUid"
            item-text="name"
            item-value="uid"
            no-data-text="无可用角色"
            @input="handleInput"
        />
    </span>

    <span 
        v-else
        class="role d-flex align-center"
        @click="changingRole = true"
    >
        <RAvatar
            size="2em"
            contain
            :src="rolePicUrl"
        />
        <span>{{ roleName }}</span>
    </span>
</template>

<script>
import state from '@/state.js'

import RAvatar from '@/components/RAvatar.vue'

const project = state.project;

export default {
    name: 'RoleSelector',

    components: {
        RAvatar
    },

    props: {
        value: String,
    },

    data() {
        return {
            roles: project.roles,
            changingRole: false,
            roleUid: this.value,
        };
    },

    watch: {
        value(val) {
            this.roleUid = val;
        },
    },

    computed: {
        roleList() {
            return project.roles.map(uid => ({uid, ...project.data[uid]}));
        },

        roleName() {
            if (this.roleUid) {
                const role = project.data[this.roleUid];
                return role.name;
            }
            return '未指定';
        },

        rolePicUrl() {
            if (this.roleUid) {
                const role = project.data[this.roleUid];
                if (role) {
                    const res = project.data[role.avatar || role.pic];
                    if (res) {
                        return res.src;
                    }
                }
            }
            return null;
        },
    },

    methods: {
        handleInput() {
            this.$emit('input', this.roleUid);
            this.changingRole = false;
        },
    },

}
</script>

<style lang="scss" scoped>
.role-input, 
.role {
    width: 6em;
}

</style>