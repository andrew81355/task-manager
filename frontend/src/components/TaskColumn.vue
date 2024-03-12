<template>
    <div class="task-column" v-if="relatedTask">
        <h3 class="text-center task-header">{{ header }}</h3>
        <TaskCard v-for="(task, index) in relatedTask" :id="task.index" :task="task"></TaskCard>
    </div>
  
</template>
<script>
import TaskCard from './TaskCard.vue';

export default {
    props: {
        header: {},
        tasks: {},
        status:{}
    },

    computed: {
        relatedTask() {
            return this.tasks.filter(task => task.status === this.status);
        }
    },

    components: { TaskCard }
}
</script>
<style>
    .task-column {
        display: flex;
        flex-flow: column;
        width: 30%;
        height: 800px;
        background-color: white;
        border-radius: 10px;
    }

    .task-header {
        margin: 1rem;
        font-weight: bold;
    }
</style>