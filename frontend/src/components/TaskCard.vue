<template>
    <article class="task-card">
        <section style="display: flex; justify-content: space-between; gap: 1rem;">
           <p class="task-title"><router-link :to="`tasks/${task.id}`">{{ task.title }}</router-link></p>
           <button class="delete-button" @click="deleteHandler">Delete</button>
        </section>
        <section>
            <span>{{ task.description }}</span>
        </section>
    </article>
</template>
<script>
export default {
    props: {
        task: {},
    },

    methods: {
        deleteHandler() {
            this.$emit('delete', this.task.id);
        }
    }
}
</script>
<style>
    .task-card {
        display: flex;
        flex-direction: column;
        background-color: hsla(194, 74%, 69%, 0.3);
        padding: .5rem;
        margin: .25rem;
        border-radius: 10px;
        border: 1px solid rgba(85, 85, 200, 0.787);
        max-height: 300px;
        overflow: auto;
    }

    .task-description {
        text-overflow: ellipsis;
    }

    .task-title {
        font-weight: bold;
    }

    .delete-button {
    background-color: #ff4d4d;
    color: #fff; 
    border: none; 
    border-radius: 5px; 
    cursor: pointer; 
    }

    .delete-button:hover {
    background-color: #e60000; /* Darker red background color on hover */
    }

</style>