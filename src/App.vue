<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <nav class="navbar navbar-light bg-white shadow-sm">
      <div class="container-fluid d-flex justify-content-center">
          <span class="navbar-brand mb-0 fw-bold fs-5">Bukan WhatsApp</span>
      </div>
    </nav>
    <div class="d-flex justify-content-center px-2" id="main-content">
      <div class="col-lg-6 col-md-12 mbt">
          <RouterView />
      </div>
    </div>
  </div>
</template>

<style>
  .mbt {
    padding-bottom: 75px;
  }

  @media only screen and (max-width: 768px){
    #main-content {
      display: block !important;
    }
  }
</style>
