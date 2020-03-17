<template>
  <client-only>
    <FilePond
      ref="filepond"
      :label-idle="
        `${label} or <span class='filepond--label-action browse-btn'>Browse</span>`
      "
      :allow-multiple="allowMultipleFiles"
      accepted-file-types="image/jpeg, image/png"
      server="/api"
      :class="{ 'multi-upload': allowMultipleFiles }"
      :max-file-size="`${maxFileSize}KB`"
      :max-files="maxFiles"
      :files="myFiles"
      @processfile="onFilesUpdated"
      @processfilerevert="onFilesUpdated"
      @processfileabort="onFilesUpdated"
      @removefile="onFilesUpdated"
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

const FilePond = new vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
)

export default {
  components: {
    FilePond
  },
  props: {
    maxFileSize: {
      type: Number,
      default: 1000
    },
    maxFiles: {
      type: Number,
      default: 6
    },
    allowMultipleFiles: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    displayPreview: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      myFiles: []
    }
  },
  methods: {
    onFilesUpdated() {
      this.$emit(
        'files-updated',
        this.$refs.filepond.getFiles().map(upload => {
          return upload.file
        })
      )
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
@media (min-width: 30em) {
  .multi-upload .filepond--item {
    width: calc(50% - 0.5em);
  }
}

@media (min-width: 50em) {
  .multi-upload .filepond--item {
    width: calc(33.33% - 0.5em);
  }
}
</style>
