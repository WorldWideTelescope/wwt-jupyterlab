import Vue from "vue";
import VTooltip from "v-tooltip";
import Vuex from "vuex";

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAdjust,
  faCompress,
  faExpand,
  faMountain,
  faSearchMinus,
  faSearchPlus,
  faSlidersH,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { createPlugin } from "@wwtelescope/engine-vuex";

import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(VTooltip);
Vue.use(Vuex);

const store = new Vuex.Store({});

Vue.use(createPlugin(), {
  store,
  namespace: "wwt-research"
});

library.add(faAdjust);
library.add(faCompress);
library.add(faExpand);
library.add(faMountain);
library.add(faSearchMinus);
library.add(faSearchPlus);
library.add(faSlidersH);
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  store,
  el: "#app",
  render: createElement => {
    return createElement(App, {
      props: {
        "wwtNamespace": "wwt-research",
      }
    });
  }
});