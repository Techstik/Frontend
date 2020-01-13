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
          <a-step title="Finalise" />
        </a-steps>
      </p>
      <div class="card">
        <div class="section">
          <h4 class="mb-0">
            A quick intro of your company
            <a-badge
              count="required"
              :number-style="{ backgroundColor: '#52c41a' }"
            />
          </h4>
          <p>Some text here (keep it short)</p>
          <ckeditor :editor="editor"></ckeditor>
        </div>
        <div class="section">
          <h4>Website URL</h4>
          <a-input default-value="mysite">
            <a-select slot="addonBefore" default-value="http://">
              <a-select-option value="http://">http://</a-select-option>
              <a-select-option value="https://">https://</a-select-option>
            </a-select>
          </a-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-inline'

export default {
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {
      editor: ClassicEditor

      // ...
    }
  }
}
</script>
<style scoped>
.container {
  max-width: 1500px;
}
.card {
  padding: 15px;
}
.section {
  margin-bottom: 15px;
}
</style>
