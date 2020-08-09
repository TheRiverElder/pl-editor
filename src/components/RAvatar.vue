<template>
    <v-avatar :size="size">
        <v-img
            v-if="src"
            :src="src"
            contain
        />
        <v-icon 
            v-else
            size="normal"
        >{{ emptyIcon }}</v-icon>
    </v-avatar>
</template>

<script>
export default {
    name: 'RAvatar',

    props: {
        src: String,
        size: {
            type: [String, Number],
            default: '1em'
        },
        emptyIcon: {
            type: String,
            default: 'mdi-account-alert-outline'
        }
    },

    data() {
        return {
            text: this.value,
        };
    },

}
</script>

<style scoped>

</style>