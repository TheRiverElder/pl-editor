<template>
    <!-- 角色展示 -->
    <div class="role ma-5 d-flex flex-column align-center">
        <div class="input d-flex align-start">
            <!-- 角色名字 -->
            <label class="mr-2">名字:</label>
            <v-input class="input flex-grow-0" messages="必填，最好不要超过三个中文" placeholder="角色的名字">
                <input ref="nameInput" v-model="name" autofocus />
            </v-input>

            <v-spacer />

            <!-- 角色头像 -->
            <label class="mr-2">头像:</label>
            <div class="input flex-grow-0">
                <!-- <v-autocomplete
                    class="ma-0"
                    dense
                    messages="无实际用途，仅方便编辑"
                    placeholder="角色的头像"
                    no-data-text="无可用资源"
                    v-model="role.avatar"
                    :items="resList"
                    item-text="name"
                    item-value="uid"
                /> -->
                <ResSelector v-model="avatar"/>
            </div>

            <RAvatar class="ml-3" :src="avatarUrl" size="3em" />
        </div>

        <!-- 角色的立绘 -->
        <v-input class="input flex-grow-0">
            <label class="mr-2">立绘:</label>
            <!-- <v-autocomplete
                placeholder="角色的立绘"
                no-data-text="无可用资源"
                v-model="role.pic"
                :items="resources.map(uid => ({...data[uid], uid}))"
                item-text="name"
                item-value="uid"
            /> -->
            <ResSelector v-model="pic"/>
        </v-input>

        <!-- 立绘预览 -->
        <div class="img-wrapper">
            <img :src="picUrl" />
        </div>

        <v-btn color="red" class="white--text" @click="deleteRole">
            <v-icon>mdi-minus</v-icon>删除该角色
        </v-btn>
    </div>
</template>

<script>
import RAvatar from "@/components/RAvatar.vue";
import ResSelector from "./ResSelector.vue";
import { mapState } from 'vuex';

export default {
    name: "Role",

    components: {
        RAvatar,
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
        }
    },

    computed: {
        ...mapState(['data']),

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
.fill {
    width: 100%;
    height: 100%;
}

.role {
    flex: 1;
    overflow-y: hidden;
}

.input {
    width: 50%;

    input {
        width: 100%;
        padding-top: 0;
    }

    label {
        word-break: keep-all;
    }
}

.img-wrapper {
    width: 100%;
    height: 10rem;
    flex: 1;
    text-align: center;

    img {
        max-width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
    }
}
</style>