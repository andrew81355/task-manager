<template>
   <TaskCard :task="task"></TaskCard>
   <router-link to="/"><button type="button" style="margin: 1rem;">HOME</button></router-link>
</template>
<script>
import TaskCard from '@/components/TaskCard.vue';

export default {
    data() {
        return {
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
        };
    },

    computed: {
        taskId() {
            return this.$route.params.id
        },

        task() {
            return this.data.find((task) => task.id == this.taskId);
        }
    },

    components: { TaskCard }
}
</script>
<style>
    
</style>