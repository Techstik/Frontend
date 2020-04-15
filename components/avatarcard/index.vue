<template>
  <div class="avatar-card-container center-display">
    <img :alt="staffMember.name" :src="staffMember.avatar" />
    <div class="details">
      <p>{{ staffMember.name }}</p>
      <small>
        <b
          ><a
            :href="
              `mailto:${staffMember.email}${mailtoExtras ? mailtoExtras : ''}`
            "
            >{{ staffMember.email }}
          </a></b
        >
      </small>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    staffMember: {
      type: Object,
      default: null
    },
    mailtoExtras: {
      type: String,
      default: null
    }
  }
}
</script>
<style scoped>
.avatar-card-container {
  border: 2px solid #303d6c;
  border-radius: 10px;
  padding: 7px 20px;
  background: #303d6c;
  color: white;
}
img {
  max-width: 80px;
}
.details {
  display: inline-block;
}
p {
  margin: 0;
}
a:hover {
  color: white !important;
}
</style>
