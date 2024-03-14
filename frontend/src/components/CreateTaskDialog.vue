<template>
    <dialog ref="modal" class="dialog-box" @close="reset">
        <div class="dialog-header">
            <h2>Create a task</h2>
        </div>
       <TaskForm @submit="submitHandler" @canceled="closeModal"></TaskForm>
    </dialog>
</template>

<script>
import TaskForm from '@/components/TaskForm.vue';

export default {

    watch: {
        showDialog() {
            if (this.showDialog) {
                this.$refs.modal.showModal();
            } else {
                this.$refs.modal.close();
            }
        }
    },

    props: {
        showDialog: {
            default: false,
        }
    },

    methods: {
        submitHandler(task) {
            this.$emit('submit', task);
        },

        closeModal() {
            this.resetValues();
            this.$emit('reset');
        },

        resetValues() {
            this.title = '';
            this.description = '';
        },
    },


    components: {TaskForm}
}
</script>
<style>
input[type="text"],
select,
textarea {
    width: 100%;
    padding: 10px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 16px;
    color: #333;
    transition: border-color 0.3s ease;
}
</style>