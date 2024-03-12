<template>
    <article class="task-card">
        <section>
           <p class="task-title"><router-link :to="`tasks/${task.id}`">{{ task.title }}</router-link></p>
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
    }

    .task-description {
        text-overflow: ellipsis;
    }

    .task-title {
        font-weight: bold;
    }

</style>