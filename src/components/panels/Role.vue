<template>
    <!-- 角色展示 -->
    <div class="fill-y max-width-64em pa-5 d-flex">
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

            <!-- 设为无立绘角色，用于旁白或主角自身 -->
            <v-switch 
                class="flex-grow-0" 
                label="无立绘角色" 
                v-model="noPic" 
            />

            <!-- 角色头像 -->
            <ResSelector 
                class="flex-grow-0" 
                label="头像"
                messages="无实际用途，仅方便编辑" 
                v-model="avatar" 
            />

            <!-- 角色的立绘 -->
            <ResSelector 
                class="flex-grow-0" 
                label="立绘"
                :disabled="noPic" 
                :messages="noPic ? '无立绘角色无法设置立绘' : ''"
                v-model="pic" 
            />

            <v-spacer/>

            <!-- 删除按钮 -->
            <v-btn color="warning" @click="deleteSelf">
                <v-icon>mdi-delete</v-icon>
                删除该角色
            </v-btn>
        </div>

        <!-- 立绘预览 -->
        <div class="img-wrapper flex-grow-1">
            <img 
                v-if="!noPic && pic" 
                :alt="name" 
                :src="picUrl"
            />
        </div>
    </div>
</template>

<script>
import ResSelector from "../ResSelector.vue";
import { mapMutations, mapState } from "vuex";
import { mutateWatcher } from '../../utils/vue-util'


export default {
    name: "Role",

    components: {
        ResSelector,
    },

    props: {
        id: String,
    },

    data() {
        const role = this.$store.state.data[this.id];
        return {
            name: role.name || '无名氏',
            avatar: role.avatar || null,
            pic: role.pic || null,
            noPic: role.noPic || false,
        };
    },

    watch: {
        ...mutateWatcher(null, 'name', 'avatar', 'pic', 'noPic'),
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

    methods: {
        ...mapMutations(['updateData', 'removeRole']),

        deleteSelf() {
            this.removeRole(this.id);
            this.$emit('delete', this.id);
        },

        save() {
            this.updateData({
                id: this.id,
                name: this.name,
                avatar: this.avatar,
                pic: this.pic,
                noPic: this.noPic,
            });
        },
    },

    created() {
        this.$store.commit('bindEl', { id: this.id, el: this });
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