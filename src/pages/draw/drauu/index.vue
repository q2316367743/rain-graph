<template>
    <div class="drauu">
        <div class="container" :style="{ bottom: show ? '40px' : '0px' }">
            <drauu-instance v-for="instance in instances" :key="instance.id" :id="instance.id" v-show="instance.id === id" />
        </div>
        <div class="tabs" :style="{ height: show ? '39px' : '0px' }">
            <a-tabs v-model:active-key="id" type="line" :editable="true" @add="handleAdd" @delete="handleDelete"
                show-add-button auto-switch hide-content>
                <a-tab-pane v-for="instance in instances" :key="instance.id" :title="instance.name" />
            </a-tabs>
        </div>
        <div class="toggle" :style="{ bottom: show ? '44px' : '4px' }" @click="show = !show">
            <a-button type="text">
                <template #icon><icon-tags /></template>
            </a-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import DrauuInstance from './instance.vue';

interface Instance {

    id: number;

    name: string

}

export default defineComponent({
    name: 'drauu',
    components: { DrauuInstance },
    data: () => ({
        instances: new Array<Instance>(),
        id: 0,
        show: false
    }),
    created() {
        this.compensate();
    },
    methods: {
        compensate() {
            if (this.instances.length === 0) {
                let instance = {
                    id: new Date().getTime(),
                    name: '画板'
                };
                this.instances.push(instance);
                this.id = instance.id;
            } else {
                let index = this.instances.findIndex(i => i.id === this.id);
                if (index === -1) {
                    this.id = this.instances[0].id;
                }
            }
        },
        handleAdd() {
            this.instances.push({
                id: new Date().getTime(),
                name: '画板'
            });
        },
        handleDelete(id: any) {
            let index = this.instances.findIndex(i => i.id === id);
            if (index > -1) {
                this.instances.splice(index, 1);
            }
            this.compensate();
        }
    }
});
</script>
<style lang="less">
@import url(./instance.less);

.drauu {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 40px;
        transition: 0.2s;
    }

    .tabs {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 39px;
        border-top: 1px solid var(--color-neutral-3);
        transition: 0.2s;
    }

    .toggle {
        position: absolute;
        left: 4px;
        transition: 0.2s;
    }
}
</style>