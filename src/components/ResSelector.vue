<template>
    <v-select
        :items="resList"
        v-model="resId"
        item-text="name"
        item-value="id"
        @input="handleInput"
    />
</template>

<script>

import { mapState } from 'vuex';

export default {
    name: 'ResSelector',

    props: {
        value: String,
    },

    data() {
        return {
            resId: this.value,
        };
    },

    watch: {
        value(val) {
            this.resId = val;
        },
    },

    computed: {
        ...mapState(['data', 'resources']),

        resList() {
            return this.resources.map(uid => this.data[uid]);
        },
    },

    methods: {
        handleInput() {
            this.$emit('input', this.resId);
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