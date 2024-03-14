<template>
    <div class="task-editor" v-if="!loading">
        <router-link to="/"><button type="button" class="nav-btn">HOME</button></router-link>
        <TaskForm :task="task" @canceled="redirectToMainPage" @submit="updateTask"></TaskForm>
    </div>
</template>
<script>
import TaskForm from '@/components/TaskForm.vue';
import axios from 'axios';

export default {

    mounted() {
        this.loadTask();
    },

    data() {
        return {
            task: {},
            loading: false
        }
    },

    computed: {
        taskId() {
            return this.$route.params.id
        },
    },

    methods: {
        redirectToMainPage() {
            this.$router.push('/')
        },

        async updateTask(data) {
            try {
                await axios.put(`/api/tasks/${this.taskId}`, data)
            } finally {
                this.redirectToMainPage()
            }
        },


        async loadTask() {
            this.loading = true;
            try {
                const res = await axios.get(`/api/tasks/${this.taskId}`)
                this.task = res.data;
            } catch {
                this.redirectToMainPage();
            } finally {
                this.loading = false;
            }
        }
    },

    components: { TaskForm }
}
</script>
<style scoped>
.task-editor {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
}
</style>