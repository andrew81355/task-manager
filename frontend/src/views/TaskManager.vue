<template>
    <div>
        <nav class="nav">
            <ul class="flex items-center p-2 justify-between">
            <li style="list-style-type:none;"><button type="button" class="nav-btn" @click="openDialog">Create a Task</button></li>
            <li><button class="bg-red-600 p-2 rounded text-white" @click="logout">Logout</button></li>
        </ul>
        </nav>
        <div class="container">
            <TaskColumn header="Open" :tasks="this.data" status="open" @refresh="loadTasks">
            </TaskColumn>
            <TaskColumn header="In Progress" :tasks="this.data" status="in progress" @refresh="loadTasks">
            </TaskColumn>
            <TaskColumn header="Done" :tasks="this.data" status="done" @refresh="loadTasks">
            </TaskColumn>
        </div>
        <CreateTaskDialog :show-dialog="showDialog" @reset="closeDialog" @submit="createNewTask"></CreateTaskDialog>
    </div>
</template>

<script>
import { api } from '@/api/auth';
import CreateTaskDialog from '@/components/CreateTaskDialog.vue';
import TaskColumn from '@/components/TaskColumn.vue';
import router from '@/router';
import axios from 'axios';


export default {
    data() {
        return {
            showDialog: false,
            data: [],
        }
    },

    mounted() {
        this.loadTasks();
    },

    methods: {
        openDialog() {
            this.showDialog = true;
        },

        closeDialog() {
            this.showDialog = false;
        },

        async createNewTask(task) {
            try {
                await api.post(`${import.meta.env.VITE_API_URL}/tasks`, task);
                await this.loadTasks();
                this.closeDialog();

            } catch(err) {
                console.log(err);
                await this.loadTasks();
            }
        },

        async loadTasks() {
           const response =  await api.get(`${import.meta.env.VITE_API_URL}/tasks`);
           this.data = response.data;
        },

        async logout() {
            const response = await api.post(`${import.meta.env.VITE_API_URL}/auth/logout`)
            localStorage.removeItem('accessToken');
            router.push('/auth');

        } 
    },

    components: { TaskColumn, CreateTaskDialog },
}
</script>

<style scoped>
.nav {
    background-color: rgb(10, 40, 100);
    padding: .25rem;
}

.container {
    background-color: rgb(241, 241, 242);
    min-height: 90vh;
    width: 100wh;
    margin: .5rem 0;
    padding: .5rem;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    align-items: center;
}
</style>