<template>
  <div>
    <div class="container">

      <div class="types">
        <type-card :word-type-id="typeId"></type-card>

      </div>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      typeId: "1398083368758841345"
    }
  }
}
</script>

<style>

.container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.types {
  display: flex;
  flex-direction: row;
}

</style>
