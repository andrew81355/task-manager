<template>
    <div>
        <form @submit.prevent.stop="submit">
            <div class="dialog-content">
                <label for="title"></label>
                <input type="text" name="desciption" placeholder="Title ... " v-model="title">
                <label for="status"></label>
                <select name="status" id="status" v-model="status">
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <label for="description"></label>
                <textarea name="description" id="description" cols="30" rows="10" v-model="description"></textarea>
            </div>
            <div id="footer" class="dialog-footer">
                <button type="submit" style="margin-right: 1rem;">OK</button>
                <button type="reset" @click="cancel">Cancel</button>
            </div>
        </form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            title: this.task ? this.task.title : '',
            description: this.task ? this.task.description : '',
            status: this.task ? this.task.status : 'open'
        }
    },

    props: {
        task: {}
    },

    methods: {
        submit() {
            if (this.title.length < 4 ) {
                return;
            }
            this.$emit('submit', { title: this.title, description: this.description, status: this.status});
            this.resetValues();
        },

        cancel() {
            this.resetValues();
            this.$emit('canceled');
        },

        resetValues() {
            this.title = this.task?.title;
            this.description = this.task?.description;
            this.status = this.task?.status;
        }
    },
    
}
</script>