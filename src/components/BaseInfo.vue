<template>
    <v-container>
        <v-text-field
            label="剧本名称"
            v-model="name"
        />

        <v-text-field
            label="版本"
            v-model="version"
        />

        <v-combobox
            chips
            multiple
            deletable-chips
            label="作者"
            v-model="authors"
        />
    </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { mutateWatcher } from '../utils/vue-util.js'

export default {
    name: "BaseInfo",

    data() {
        return {
            name: this.$store.state.name,
            version: this.$store.state.version,
            authors: this.$store.state.authors,
        };
    },

    computed: {
        ...mapState(['id']),
    },

    watch: {
        ...mutateWatcher(null, 'name', 'version', 'authors'),

        id() {
            this.update();
        },
    },

    methods: {
        ...mapMutations(['updateBaseInfo']),

        save() {
            this.updateBaseInfo({
                name: this.name, 
                version: this.version,
                authors: this.authors,
            });
        },

        update() {
            this.name = this.$store.state.name;
            this.version = this.$store.state.version;
            this.authors = this.$store.state.authors;
        },
    },
};
</script>
