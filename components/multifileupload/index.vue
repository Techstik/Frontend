<template>
  <div class="multifileupload">
    <h4 v-if="heading">{{ heading }}</h4>
    <div class="progress-container">
      <a-progress
        type="circle"
        :percent="progress"
        :width="80"
        stroke-color="#161d2e"
      />
    </div>
  </div>
</template>

<script>
import { storage } from '@/plugins/firebase'

export default {
  props: {
    heading: {
      type: String,
      default: null
    },
    files: {
      type: Array,
      default: () => []
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadTask: null,
      downloadURLS: [],
      completedBytes: 0,
      progressBytes: 0,
      totalBytes: 1,
      completedCount: 0
    }
  },
  computed: {
    progress() {
      return Math.floor((this.progressBytes / this.totalBytes) * 100)
    },
    complete() {
      return this.completedCount == this.files.length
    }
  },
  watch: {
    uploadTask() {
      this.uploadTask.on(
        'state_changed',
        snapshot => {
          if ((snapshot.bytesTransferred = snapshot.totalBytes)) {
            this.completedBytes += snapshot.totalBytes
            this.progressBytes = this.completedBytes
          } else
            this.progressBytes = this.completedBytes + snapshot.bytesTransferred
        },
        // eslint-disable-next-line no-unused-vars
        error => {
          //TODO: log with bugsnag
        },
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.downloadURLS.push(downloadURL)
            this.completedCount++
            if (this.completedCount < this.files.length)
              this.uploadFile(this.files[this.completedCount])
          })
        }
      )
    },
    complete() {
      if (this.complete) {
        this.$emit('uploadComplete', this.downloadURLS)
      }
    }
  },
  mounted() {
    this.totalBytes = this.lodash.reduce(
      this.files,
      (sum, file) => {
        return sum + file.size
      },
      0
    )

    this.uploadFile(this.files[0])
  },
  methods: {
    uploadFile(file) {
      this.uploadTask = storage.ref(`/${this.basePath}/${file.name}`).put(file)
    }
  }
}
</script>
<style scoped>
span {
  font-size: 12px;
}
.progress-container,
h4 {
  text-align: center;
}
.progress-container {
  margin: 30px 0px;
}
</style>
<style>
.multifileupload .ant-progress-status-success .ant-progress-circle-path {
  stroke: #fcd668 !important;
}
</style>