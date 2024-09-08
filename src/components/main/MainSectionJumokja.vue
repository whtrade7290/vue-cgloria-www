<template>
  <section class="my-5">
    <div class="container">
      <div class="row">
        <div class="col-md-7 col-12 my-auto">
          <h3 class="text-gradient text-primary mb-0">{{ $t('MainSectionJumokja.title') }}</h3>
          <p class="pe-md-5 mb-4">
            {{ $t('MainSectionJumokja.content') }}
          </p>
          <div class="github-buttons">
            <router-link
              to="/jumokja"
              rel="nofollow"
              class="btn bg-gradient-primary mb-5 mb-sm-0"
              >{{ $t('common.moveToPage') }}</router-link
            >
            <div class="github-button">
              <span></span>
            </div>
          </div>
        </div>
        <div class="col-md-5 col-12 my-auto">
          <a href="#">
            <img
              class="w-100 border-radius-lg shadow-lg"
              src="@/assets/img/main/ju2.jpg"
              alt="Product Image"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped></style>
