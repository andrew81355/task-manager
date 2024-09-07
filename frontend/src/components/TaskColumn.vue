<template>
    <div class="task-column" v-if="relatedTask">
        <h3 class="text-center task-header">{{ header }}</h3>
        <TaskCard v-for="task in relatedTask" :key="task.id" :id="task.id" :task="task" @delete="deleteTask" ></TaskCard>
    </div>
  
</template>
<script>
import axios from 'axios';
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

    methods: {
        async deleteTask(taskId) {
            try {
                await axios.delete(`/api/tasks/${taskId}`);
            } catch(err) {
                console.log(err);
            } finally {
                this.$emit('refresh');
            }  
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