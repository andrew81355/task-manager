<template>
    <div>
        <nav class="nav">
            <ul>
            <li style="list-style-type:none;"><button type="button" class="nav-btn" @click="openDialog">Create a Task</button></li>
        </ul>
        </nav>
        <div class="container">
            <TaskColumn header="Open" :tasks="this.data" status="open">
            </TaskColumn>
            <TaskColumn header="In Progress" :tasks="this.data" status="in progress">
            </TaskColumn>
            <TaskColumn header="Done" :tasks="this.data" status="done">
            </TaskColumn>
        </div>
        <CreateTaskDialog :show-dialog="showDialog" @reset="closeDialog" @submit="createNewTask"></CreateTaskDialog>
    </div>
</template>

<script>
import CreateTaskDialog from '@/components/CreateTaskDialog.vue';
import TaskColumn from '@/components/TaskColumn.vue';


export default {
    data() {
        return {
            showDialog: false,
            data: [{ id: 1, title: "Update User Profile", description: "Update user profile information with new data", status: "open" },
            { id: 2, title: "Implement Login Authentication", description: "Implement authentication mechanism for user login", status: "in progress" },
            { id: 3, title: "Design Landing Page", description: "Create the layout and design for the landing page", status: "done" },
            { id: 4, title: "Fix Bug in Payment Gateway", description: "Identify and fix the bug causing issues in the payment gateway", status: "open" },
            { id: 5, title: "Refactor Database Schema", description: "Optimize and refactor the database schema for better performance", status: "in progress" },
            { id: 6, title: "Deploy Application to Production", description: "Deploy the application to production server for public access", status: "done" },
            { id: 7, title: "Write Unit Tests for User Module", description: "Write unit tests to ensure functionality of user module", status: "open" },
            { id: 8, title: "Optimize Page Load Time", description: "Optimize website to reduce page load time and improve user experience", status: "in progress" },
            { id: 9, title: "Create API Documentation", description: "Document the APIs with clear instructions and examples", status: "done" },
            { id: 10, title: "Implement Forgot Password Feature", description: "Implement feature to allow users to reset their passwords", status: "open" }
            ]
        }
    },

    methods: {
        openDialog() {
            this.showDialog = true;
        },

        closeDialog() {
            this.showDialog = false;
        },

        createNewTask(task) {
            this.data.push(task)
            this.closeDialog();
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

.button {
    border-radius: 10px;
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

.nav-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
</style>