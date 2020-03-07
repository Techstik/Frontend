<template>
  <client-only>
    <FilePond
      ref="filepond"
      label-idle="Drop logo here or <span class='filepond--label-action browse-btn'>Browse</span>"
      :allow-multiple="false"
      accepted-file-types="image/jpeg, image/png"
      server="/api"
      max-file-size="1MB"
      :files="myFiles"
      @init="handleFilePondInit"
      @processfile="onFileAdded"
      @processfilerevert="onFileRemoved"
      @processfileabort="onFileRemoved"
      @removefile="onFileRemoved"
    />
  </client-only>
</template>
<script>
import vueFilePond from 'vue-filepond'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
)

export default {
  components: {
    FilePond
  },
  data() {
    return {
      myFiles: []
    }
  },
  methods: {
    handleFilePondInit() {},
    onFileAdded(error, upload) {
      this.$emit('file-added', upload.file)
    },
    onFileRemoved() {
      this.$emit('file-removed')
    }
  }
}
</script>
<style>
.browse-btn {
  border: 1px solid #161d2d;
  padding: 3px 8px;
  border-radius: 10px;
  background: #161d2d;
  text-decoration: none;
  color: white;
}
.browse-btn:focus {
  outline: none;
}
</style>
