<template>
  <div class="container">
    <div class="header">
      <nuxt-link to="/home" tag="div">
        <i class="el-icon-house"></i>
        首页
      </nuxt-link>
      <nuxt-link to="/answer" tag="div">
        <i class="el-icon-notebook-2"></i>
        答题
      </nuxt-link>
      <nuxt-link to="/query" tag="div">
        <i class="el-icon-search"></i>
        词缀查询
      </nuxt-link>
    </div>
    <div class="main">
      <Nuxt/>
    </div>
  </div>
</template>

<style>
* {
  padding: 0;
  border: 0;
  margin: 0;
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: rgb(241, 241, 241);
  width: 80%;
  margin: 0 auto;
  height: 1000px;
}

.header {
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  background-color: #526488;
  padding-left: 5px;
}

.header > * {
  margin: 2px 5px;
}

.header *{
  font-size: large;
  color: aliceblue;
}

</style>
