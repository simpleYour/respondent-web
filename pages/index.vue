<template>
  <div class="container">
    <type-card :word-type-id="typeId"></type-card>

  </div>
</template>

<script>
import TypeCard from "~/components/TypeCard";

export default {
  components: {
    TypeCard
  },
  data() {
    return {
      typeId: "1398083368758841345"
    }
  }
}
</script>

<style>

</style>
