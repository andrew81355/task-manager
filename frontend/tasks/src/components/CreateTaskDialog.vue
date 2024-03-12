<template>
    <dialog ref="modal" class="dialog-box" @close="reset">
        <div class="dialog-header">
            <h2>Create a task</h2>
        </div>
        <form @submit.prevent="submit">
            <div class="dialog-content">
                <label for="title"></label>
                <input type="text" name="desciption" placeholder="Title ... " v-model="title">
                <label for="status"></label>
                <select name="status" id="status" v-model="status">
                    <option value="create">Create</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <label for="description"></label>
                <textarea name="description" id="description" cols="30" rows="10" v-model="description"></textarea>
            </div>
            <div id="footer" class="dialog-footer">
                <button type="submit" style="margin-right: 1rem;">OK</button>
                <button type="reset" @click="reset">Cancel</button>
            </div>
        </form>
    </dialog>
</template>
<script>
export default {

    data() {
        return {
            title: '',
            description: '',
            status:'open'
        }
    },
    watch: {
        openDialog() {
            if (this.openDialog) {
                this.$refs.modal.showModal();
            }
            
        }
    },

    props: {
        openDialog: {
            default: false,
        }
    },

    methods: {
        submit() {
            if (this.title.length < 4 ) {
                return;
            }

            this.$emit('submit', { title: this.title, description: this.description, status: this.status})
            this.$refs.modal.close();
            this.resetValues();
        },

        reset() {
            this.$refs.modal.close();
            this.resetValues();
            this.$emit('reset');
        },

        resetValues() {
            this.title = '';
            this.description = '';
        }
    },
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