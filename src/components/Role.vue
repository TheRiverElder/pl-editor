<template>
    <!-- 角色展示 -->
    <div class="ma-5 d-flex">
        <div class="form d-flex flex-column align-center">
            <!-- 头像预览 -->
            <v-avatar 
                size="160"
                color="grey"
            >
                <img v-if="avatar" :src="avatarUrl" />

                <span v-else class="white--text text-h3">{{ name.slice(0, 2) }}</span>
            </v-avatar>

            <!-- 角色名字 -->
            <v-text-field
                label="名字"
                class="input flex-grow-0"
                messages="必填，最好不要超过三个中文"
                placeholder="角色的名字"
                v-model="name"
            />

            <!-- 角色头像 -->
            <ResSelector label="头像" messages="无实际用途，仅方便编辑" v-model="avatar" />

            <!-- 角色的立绘 -->
            <ResSelector label="立绘" v-model="pic" />
        </div>

        <!-- 立绘预览 -->
        <div class="img-wrapper flex-grow-1">
            <img :src="picUrl" />
        </div>
    </div>
</template>

<script>
import ResSelector from "./ResSelector.vue";
import { mapState } from "vuex";

export default {
    name: "Role",

    components: {
        ResSelector,
    },

    props: {
        content: Object,
    },

    data() {
        return {
            name: this.content.name,
            avatar: this.content.avatar,
            pic: this.content.pic,
        };
    },

    watch: {
        name(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.$emit('mutate');
            }
        },

        avatar(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.$emit('mutate');
            }
        },

        pic(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.$emit('mutate');
            }
        },
    },

    computed: {
        ...mapState(["data"]),

        picUrl() {
            const res = this.data[this.pic];
            return res ? res.src : null;
        },

        avatarUrl() {
            const res = this.data[this.avatar];
            return res ? res.src : null;
        },
    },
};
</script>

<style lang="scss" scoped>
.img-wrapper {
    flex: 1;
    text-align: center;

    img {
        max-width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
    }
}

.form {
    > * {
        width: 20em;
        margin-top: 1.5em;
    }
}
</style>