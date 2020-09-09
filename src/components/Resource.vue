<template>
    <v-card class="d-flex flex-column">
        <v-img class="flex-shrink-1" :src="res.src" contain />

        <v-card-title class="name">
            <v-text-field 
                v-if="editName"
                hide-details="auto"
                dense 
                :error-messages="errors"
                v-model="name"
                @blur="editName = false"
                @keydown="handleEnter"
            />

            <span v-else @click="editName = true">{{ name }}</span>
        </v-card-title>

        <v-card-actions>
            <v-btn icon @click="removeResource(id)">
                <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn icon>
                <v-icon>mdi-share</v-icon>
                <input ref="btnReplace" class="fill" type="file" @input="replaceRes" />
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    name: "Resource",

    props: {
        res: Object,
    },

    data() {
        return {
            id: this.res.id,
            name: this.res.name,
            src: this.res.src,
            type: this.res.type,

            editName: false,
            errors: null,
        };
    },

    watch: {
        name(newVal, oldVal) {
            this.errors = newVal.length === 0 ? "名字不可为空" : null;
            if (newVal !== oldVal && newVal) {
                this.updateData({ id: this.id, name: newVal })
            }
        },

        src(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.updateData({ id: this.id, src: this.src, type: this.type })
            }
        },
    },

    methods: {
        ...mapMutations(['removeResource', 'updateData']),

        replaceRes(event) {
            for (const file of event.target.files) {
                const reader = new FileReader();
                reader.onload = () => Object.assign(this, { src: reader.result, type: file.type });
                reader.readAsDataURL(file);
            }
        },

        handleEnter(event) {
            if (event.key === 'Enter') {
                this.editName = false;
                this.updateData({ id: this.id, name: this.name });
            }
        }
    },
};
</script>

<style scoped>
.name > * {
    width: 100%;
}

.fill {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    cursor: pointer;
}
</style>
