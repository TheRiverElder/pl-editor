<template>
    <div class="d-flex pr-10 mt-3">
        <v-select
            chips
            clearable
            deletable-chips
            multiple
			dense
			hide-details
			class="role-list-input my-0 mx-2 pa-0 flex-grow-1 flex-shrik-1"
            label="上场角色"
            :items="roleList"
            item-text="name"
            item-value="id"
            no-data-text="无可用角色"
            @input="onStage"
        />

        <v-select
            chips
            clearable
            deletable-chips
            multiple
			dense
			hide-details
			class="role-list-input my-0 mx-2 pa-0 flex-grow-1 flex-shrik-1"
            label="下场角色"
            :items="roleList"
            item-text="name"
            item-value="id"
            no-data-text="无可用角色"
            @input="outStage"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'RoleMutation',

    props: {
        type: String,
        value: Object,
    },
	
	computed: {
        ...mapState(['roles', 'data']),

        roleList() {
            return this.roles.map(uid => this.data[uid]);
        },
    },
    
    methods: {

        onStage(roles) {
            this.$emit('input', {on: roles});
        },

        outStage(roles) {
            this.$emit('input', {out: roles});
        },

    }

}
</script>

<style scoped>
.role-list-input {
    max-width: 50%;
    width: 50%;
}
</style>