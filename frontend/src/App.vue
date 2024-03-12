<template>
  <RouterView />
</template>

<script>

  import TaskManager from './views/TaskManager.vue';
  import { RouterView } from 'vue-router'
  export default {
    components: { TaskManager }
}
</script> 