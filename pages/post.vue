<template>
  <div>
    <h1 class="title heading heading--x-large pb-0">
      Make your search available to the tech world
    </h1>
    <div class="container">
      <p class="align-center sub-title">Add some text here</p>
      <p>
        <a-steps :current="0">
          <a-step title="Your Company" />
          <a-step title="The Role" />
          <a-step title="Responsibilities" />
          <a-step title="Salary" />
          <a-step title="Extras" />
        </a-steps>
      </p>
    </div>
  </div>
</template>
<style scoped>
.container {
  max-width: 1500px;
}
</style>
