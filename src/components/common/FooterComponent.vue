<template>
  <footer class="footer pt-0 mt-5" style="background-color: #2b2b2b">
    <hr class="horizontal dark mb-5" />
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-3">
          <div style="text-align: center; color: #777777">
            <img src="f_logo.png" style="width: 100px" /><br /><br />
            <strong>
              〒169-0074 東京都新宿区<br />北新宿３丁目１０−５<br /><br />
              TEL 03-5330-0090<br />
              FAX 03-5330-0353
            </strong>
          </div>
        </div>
        <div class="col-md-3 mb-5">
          <div style="text-align: center; color: #777777">
            <h4>
              <strong style="color: #ffffff">{{ $t('FooterComponent.worshipTime') }}</strong>
            </h4>
            {{ $t('FooterComponent.midnightWorship') }}<br />
            {{ $t('FooterComponent.everyDay') }} 05:50 ~ 06:40<br /><br />
            {{ $t('FooterComponent.worship1') }}<br />
            08:05~10:00
            <br /><br />
            {{ $t('FooterComponent.worship2') }}<br />{{ $t('FooterComponent.worship2Info') }}<br />
            10:30~12:00
          </div>
        </div>
        <div class="col-md-3 mb-5">
          <div style="text-align: center; color: #777777">
            <h4>
              <strong style="color: #ffffff">{{ $t('FooterComponent.trainingTime') }}</strong>
            </h4>
            {{ $t('FooterComponent.disciple') }}<br />
            {{ $t('FooterComponent.sunday') }} 12:45~14:45<br /><br />
            {{ $t('FooterComponent.ministry') }}<br />
            {{ $t('FooterComponent.sunday') }} 15:00~17:00 <br /><br />
            {{ $t('FooterComponent.seminar') }}<br />
            {{ $t('FooterComponent.saturday') }} 06:40~07:40
          </div>
        </div>
        <div class="col-md-3 mb-5">
          <div style="text-align: center; color: #777777">
            <div>
              <h4>
                <strong style="color: #ffffff">{{ $t('FooterComponent.location') }}</strong>
              </h4>
              <img style="height: 100px; width: 100%; border-radius: 5px" src="mini_map.png" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="text-center">
          <p class="my-4 text-sm" style="color: #ffffff">All Right Reserved © 중앙영광교회 LLC.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const staticPath = `${import.meta.env.VITE_API_URL}uploads/assets/main/`
</script>

<style lang="scss" scoped></style>
