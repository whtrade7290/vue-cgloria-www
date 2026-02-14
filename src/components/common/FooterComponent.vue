<template>
  <footer class="footer pt-0" style="background-color: #2b2b2b">
    <div class="container">
      <div class="row">
        <!-- ✅ 항상 보이는 첫 번째 섹션 -->
        <div class="col-md-3 mb-3 text-center" style="color: rgb(119, 119, 119)">
          <img src="/f_logo.png" style="width: 100px" /><br /><br />
          <strong>
            <span class="footer-denomination">{{ $t('FooterComponent.denomination') }}</span><br />
            <span class="footer-church-name">{{ $t('FooterComponent.churchName') }}</span><br />
            {{ $t('FooterComponent.addressLine1') }}<br />
            {{ $t('FooterComponent.addressLine2') }}<br /><br />
            {{ $t('FooterComponent.tel') }}<br />
            {{ $t('FooterComponent.fax') }}
          </strong>
        </div>

        <!-- ✅ 모바일(425px 이하)에서는 숨겨질 부분 -->
        <div class="col-md-3 mb-5 hide-on-mobile">
          <div style="text-align: center; color: #777777">
            <h4>
              <strong style="color: #ffffff">{{ $t('FooterComponent.worshipTime') }}</strong>
            </h4>
            {{ $t('FooterComponent.midnightWorship') }}<br />
            {{ $t('FooterComponent.everyDay') }} 05:40 ~ 06:40<br /><br />
            {{ $t('FooterComponent.worship1') }}<br />
            08:05~10:00
            <br /><br />
            {{ $t('FooterComponent.worship2') }}<br />{{ $t('FooterComponent.worship2Info') }}<br />
            10:30~12:00
          </div>
        </div>

        <div class="col-md-3 mb-5 hide-on-mobile">
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

        <div class="col-md-3 mb-5 hide-on-mobile">
          <div style="text-align: center; color: #777777">
            <div>
              <h4>
                <strong style="color: #ffffff">{{ $t('FooterComponent.location') }}</strong>
              </h4>
              <img style="height: 100px; width: 100%; border-radius: 5px" src="/mini_map.png" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 text-center mt-3">
        <p class="text-sm" style="color: #ffffff">All Right Reserved © 중앙영광교회 LLC.</p>
      </div>
    </div>
  </footer>
</template>
<script setup>
const staticPath = `${import.meta.env.VITE_API_URL}uploads/assets/main/`
</script>
<style scoped>
.container {
  padding-top: 4rem;
}

.footer-church-name {
  display: inline-block;
  font-size: 1.4rem;
}

.footer-denomination {
  display: inline-block;
  font-size: 0.9rem;
}

/* ✅ 모바일 425px 이하에서 숨기기 */
@media (max-width: 425px) {
  .hide-on-mobile {
    display: none !important;
  }
}
</style>
