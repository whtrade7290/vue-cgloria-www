<template>
  <CardContainer :title="obj.title">
    <section class="py-5">
      <div class="container" style="padding: 0 60px">
        <div class="row">
          <div class="col-lg-12">
            <h3>{{ $t('webContents.training.main') }}</h3>
            <p>
              {{ $t('webContents.training.mainDiscription') }}
            </p>
          </div>
          <div class="col-lg-12 mt-lg-0 mt-5 ps-lg-0 ps-0">
            <div class="p-3 info-horizontal">
              <div class="icon icon-shape rounded-circle bg-gradient-primary shadow text-center">
                <i class="fas fa-ship opacity-10"></i>
              </div>
              <div class="description ps-3">
                <h3 style="font-size: 2rem">{{ $t('webContents.training.training1') }}</h3>
                <p class="mb-0">
                  {{ $t('webContents.training.discription1') }}
                </p>
              </div>
            </div>

            <div class="p-3 info-horizontal">
              <div class="icon icon-shape rounded-circle bg-gradient-primary shadow text-center">
                <i class="fas fa-handshake opacity-10"></i>
              </div>
              <div class="description ps-3">
                <h3 style="font-size: 2rem">{{ $t('webContents.training.training2') }}</h3>
                <p class="mb-0">
                  {{ $t('webContents.training.discription2') }}
                </p>
              </div>
            </div>
            <div class="p-3 info-horizontal">
              <div class="icon icon-shape rounded-circle bg-gradient-primary shadow text-center">
                <i class="fas fa-hourglass opacity-10"></i>
              </div>
              <div class="description ps-3">
                <h3 style="font-size: 2rem">{{ $t('webContents.training.training3') }}</h3>
                <p class="mb-0">
                  {{ $t('webContents.training.discription3') }}
                </p>
              </div>
            </div>
            <div class="p-3 info-horizontal">
              <div class="icon icon-shape rounded-circle bg-gradient-primary shadow text-center">
                <i class="fas fa-hourglass opacity-10"></i>
              </div>
              <div class="description ps-3">
                <h3 style="font-size: 2rem">{{ $t('webContents.training.training4') }}</h3>
                <p class="mb-0">
                  {{ $t('webContents.training.discription4') }}
                </p>
              </div>
            </div>
            <div class="p-3 info-horizontal">
              <div class="icon icon-shape rounded-circle bg-gradient-primary shadow text-center">
                <i class="fas fa-hourglass opacity-10"></i>
              </div>
              <div class="description ps-3">
                <h3 style="font-size: 2rem">{{ $t('webContents.training.training5') }}</h3>
                <p class="mb-0">
                  {{ $t('webContents.training.discription5') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section with icon, title and description -->
    <!-- <section class="py-0">
      <div class="container py-5" style="padding: 0 60px">
        <div class="row">
          <div class="col-lg-12">
            <h3>자료 다운로드</h3>
          </div>
          <div class="col-lg-3 col-sm-6">
            <div class="p-3 text-center">
              <div class="icon icon-shape icon-md bg-gradient-danger shadow mx-auto">
                <svg
                  width="30px"
                  height="16px"
                  viewBox="0 0 40 40"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  class="mt-3"
                >
                  <title>spaceship</title>
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g
                      transform="translate(-1720.000000, -592.000000)"
                      fill="#FFFFFF"
                      fill-rule="nonzero"
                    >
                      <g transform="translate(1716.000000, 291.000000)">
                        <g transform="translate(4.000000, 301.000000)">
                          <path
                            d="M39.3,0.706666667 C38.9660984,0.370464027 38.5048767,0.192278529 38.0316667,0.216666667 C14.6516667,1.43666667 6.015,22.2633333 5.93166667,22.4733333 C5.68236407,23.0926189 5.82664679,23.8009159 6.29833333,24.2733333 L15.7266667,33.7016667 C16.2013871,34.1756798 16.9140329,34.3188658 17.535,34.065 C17.7433333,33.98 38.4583333,25.2466667 39.7816667,1.97666667 C39.8087196,1.50414529 39.6335979,1.04240574 39.3,0.706666667 Z M25.69,19.0233333 C24.7367525,19.9768687 23.3029475,20.2622391 22.0572426,19.7463614 C20.8115377,19.2304837 19.9992882,18.0149658 19.9992882,16.6666667 C19.9992882,15.3183676 20.8115377,14.1028496 22.0572426,13.5869719 C23.3029475,13.0710943 24.7367525,13.3564646 25.69,14.31 C26.9912731,15.6116662 26.9912731,17.7216672 25.69,19.0233333 L25.69,19.0233333 Z"
                          ></path>
                          <path
                            d="M1.855,31.4066667 C3.05106558,30.2024182 4.79973884,29.7296005 6.43969145,30.1670277 C8.07964407,30.6044549 9.36054508,31.8853559 9.7979723,33.5253085 C10.2353995,35.1652612 9.76258177,36.9139344 8.55833333,38.11 C6.70666667,39.9616667 0,40 0,40 C0,40 0,33.2566667 1.855,31.4066667 Z"
                          ></path>
                          <path
                            d="M17.2616667,3.90166667 C12.4943643,3.07192755 7.62174065,4.61673894 4.20333333,8.04166667 C3.31200265,8.94126033 2.53706177,9.94913142 1.89666667,11.0416667 C1.5109569,11.6966059 1.61721591,12.5295394 2.155,13.0666667 L5.47,16.3833333 C8.55036617,11.4946947 12.5559074,7.25476565 17.2616667,3.90166667 L17.2616667,3.90166667 Z"
                            opacity="0.598539807"
                          ></path>
                          <path
                            d="M36.0983333,22.7383333 C36.9280725,27.5056357 35.3832611,32.3782594 31.9583333,35.7966667 C31.0587397,36.6879974 30.0508686,37.4629382 28.9583333,38.1033333 C28.3033941,38.4890431 27.4704606,38.3827841 26.9333333,37.845 L23.6166667,34.53 C28.5053053,31.4496338 32.7452344,27.4440926 36.0983333,22.7383333 L36.0983333,22.7383333 Z"
                            id="color-3"
                            opacity="0.598539807"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <h5 class="mt-4">주간평가표(필수)</h5>
            </div>
          </div>
          <div class="col-lg-3 col-sm-6">
            <div class="p-3 text-center">
              <div class="icon icon-shape icon-md bg-gradient-danger shadow mx-auto">
                <svg
                  width="30px"
                  height="16px"
                  viewBox="0 0 40 40"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  class="mt-3"
                >
                  <title>shop</title>
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g
                      transform="translate(-1716.000000, -439.000000)"
                      fill="#FFFFFF"
                      fill-rule="nonzero"
                    >
                      <g transform="translate(1716.000000, 291.000000)">
                        <g id="shop-" transform="translate(0.000000, 148.000000)">
                          <path
                            d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z"
                            opacity="0.598981585"
                          ></path>
                          <path
                            d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <h5 class="mt-4">주간평가표 (일본)</h5>
            </div>
          </div>
          <div class="col-lg-3 col-sm-6">
            <div class="p-3 text-center">
              <div class="icon icon-shape icon-md bg-gradient-danger shadow mx-auto">
                <svg
                  width="30px"
                  height="16px"
                  viewBox="0 0 40 40"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  class="mt-3"
                >
                  <title>time-alarm</title>
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g
                      transform="translate(-2319.000000, -440.000000)"
                      fill="#FFFFFF"
                      fill-rule="nonzero"
                    >
                      <g transform="translate(1716.000000, 291.000000)">
                        <g id="time-alarm" transform="translate(603.000000, 149.000000)">
                          <path
                            d="M18.8086957,4.70034783 C15.3814926,0.343541521 9.0713063,-0.410050841 4.7145,3.01715217 C0.357693695,6.44435519 -0.395898667,12.7545415 3.03130435,17.1113478 C5.53738466,10.3360568 11.6337901,5.54042955 18.8086957,4.70034783 L18.8086957,4.70034783 Z"
                            opacity="0.6"
                          ></path>
                          <path
                            d="M38.9686957,17.1113478 C42.3958987,12.7545415 41.6423063,6.44435519 37.2855,3.01715217 C32.9286937,-0.410050841 26.6185074,0.343541521 23.1913043,4.70034783 C30.3662099,5.54042955 36.4626153,10.3360568 38.9686957,17.1113478 Z"
                            opacity="0.6"
                          ></path>
                          <path
                            d="M34.3815652,34.7668696 C40.2057958,27.7073059 39.5440671,17.3375603 32.869743,11.0755718 C26.1954189,4.81358341 15.8045811,4.81358341 9.13025701,11.0755718 C2.45593289,17.3375603 1.79420418,27.7073059 7.61843478,34.7668696 L3.9753913,40.0506522 C3.58549114,40.5871271 3.51710058,41.2928217 3.79673036,41.8941824 C4.07636014,42.4955431 4.66004722,42.8980248 5.32153275,42.9456105 C5.98301828,42.9931963 6.61830436,42.6784048 6.98113043,42.1232609 L10.2744783,37.3434783 C16.5555112,42.3298213 25.4444888,42.3298213 31.7255217,37.3434783 L35.0188696,42.1196087 C35.6014207,42.9211577 36.7169135,43.1118605 37.53266,42.5493622 C38.3484064,41.9868639 38.5667083,40.8764423 38.0246087,40.047 L34.3815652,34.7668696 Z M30.1304348,25.5652174 L21,25.5652174 C20.49574,25.5652174 20.0869565,25.1564339 20.0869565,24.6521739 L20.0869565,15.5217391 C20.0869565,15.0174791 20.49574,14.6086957 21,14.6086957 C21.50426,14.6086957 21.9130435,15.0174791 21.9130435,15.5217391 L21.9130435,23.7391304 L30.1304348,23.7391304 C30.6346948,23.7391304 31.0434783,24.1479139 31.0434783,24.6521739 C31.0434783,25.1564339 30.6346948,25.5652174 30.1304348,25.5652174 Z"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <h5 class="mt-4">기도 후원자 양식(HWP)</h5>
            </div>
          </div>
          <div class="col-lg-3 col-sm-6">
            <div class="p-3 text-center">
              <div class="icon icon-shape icon-md bg-gradient-danger shadow mx-auto">
                <svg
                  width="30px"
                  height="16px"
                  viewBox="0 0 40 40"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  class="mt-3"
                >
                  <title>delivery-fast</title>
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g
                      transform="translate(-2320.000000, -741.000000)"
                      fill="#FFFFFF"
                      fill-rule="nonzero"
                    >
                      <g transform="translate(1716.000000, 291.000000)">
                        <g id="delivery-fast" transform="translate(604.000000, 450.000000)">
                          <rect
                            opacity="0.601143973"
                            x="0"
                            y="0"
                            width="17.25"
                            height="3.83333333"
                          ></rect>
                          <rect
                            opacity="0.601143973"
                            x="3.83333333"
                            y="7.66666667"
                            width="13.4166667"
                            height="3.83333333"
                          ></rect>
                          <rect
                            opacity="0.601143973"
                            x="7.66666667"
                            y="15.3333333"
                            width="9.58333333"
                            height="3.83333333"
                          ></rect>
                          <rect
                            opacity="0.601888021"
                            x="11.5"
                            y="23"
                            width="5.75"
                            height="3.83333333"
                          ></rect>
                          <path
                            d="M44.9400833,19.3679167 L38.0611667,15.9294167 L36.3591667,9.1195 C36.1464167,8.26466667 35.37975,7.66666667 34.5,7.66666667 L31.3854167,7.66666667 L21.0833333,7.66666667 C21.0833333,7.66666667 21.0833333,31.5310833 21.0833333,32.5833333 C21.0833333,33.6355833 21.1810833,34.5 21.1810833,34.5 C21.6640833,38.801 25.2808333,42.1666667 29.7083333,42.1666667 C34.1358333,42.1666667 37.7525833,38.801 38.2355833,34.5 L44.0833333,34.5 C45.1413333,34.5 46,33.6413333 46,32.5833333 L46,21.0833333 C46,20.3569167 45.5898333,19.69375 44.9400833,19.3679167 Z M29.7083333,38.3333333 C27.0671667,38.3333333 24.9166667,36.18475 24.9166667,33.5416667 C24.9166667,30.8985833 27.0671667,28.75 29.7083333,28.75 C32.3495,28.75 34.5,30.8985833 34.5,33.5416667 C34.5,36.18475 32.3495,38.3333333 29.7083333,38.3333333 Z M24.9166667,17.25 L24.9166667,11.5 L33.2426667,11.5 L34.5,17.25 L24.9166667,17.25 Z"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <h5 class="mt-4">기도 후원자 양식(PDF)</h5>
            </div>
          </div>
        </div>
      </div>
    </section> -->
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { WORSHIP } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const store = useStore()
const obj = ref(null)
// store.dispatch('FETCH_SIDEMENU', WORSHIP)
obj.value = WORSHIP.find((o) => route.name === o.path)
</script>

<style lang="scss" scoped></style>
