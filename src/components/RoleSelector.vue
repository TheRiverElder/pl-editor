<template>
    <span 
        v-if="changingRole"
        class="role"
        @blur="changingRole = false"
    >
        <v-select
            dense
            hide-details
            :items="roleList"
            :label="label"
            :disabled="disabled"
            v-model="roleUid"
            item-text="name"
            item-value="id"
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
            size="1.6em"
            contain
            :src="rolePicUrl"
        />
        <span class="ml-1">{{ roleName }}</span>
    </span>
</template>

<script>

import RAvatar from '@/components/RAvatar.vue'
import { mapState } from 'vuex';

export default {
    name: 'RoleSelector',

    components: {
        RAvatar
    },

    props: {
        value: String,
        disabled: Boolean,
        label: String,
    },

    data() {
        return {
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
        ...mapState(['roles', 'data', 'resources']),

        roleList() {
            return [{id: null, name: '【无角色】'}, ...this.roles.map(uid => this.data[uid])];
        },

        roleName() {
            if (this.roleUid) {
                const role = this.data[this.roleUid];
                return role.name;
            }
            return '';
        },

        rolePicUrl() {
            if (this.roleUid) {
                const role = this.data[this.roleUid];
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
    min-height: unset;
}

</style>