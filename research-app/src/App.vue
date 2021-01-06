<template>
  <div id="app">
    <WorldWideTelescope
      wwt-namespace="wwt-research"
    ></WorldWideTelescope>

    <transition name="fade">
      <div id="overlays">
        <p>{{ coordText }}</p>
      </div>
    </transition>

    <ul id="controls">
      <li v-show="showToolMenu">
        <v-popover placement="left">
          <font-awesome-icon class="tooltip-target" icon="sliders-h" size="lg"></font-awesome-icon>
          <template slot="popover">
            <ul class="tooltip-content tool-menu">
              <li v-show="showCrossfader"><a href="#" v-close-popover @click="selectTool('crossfade')"><font-awesome-icon icon="adjust" /> Crossfade</a></li>
              <li v-show="showBackgroundChooser"><a href="#" v-close-popover @click="selectTool('choose-background')"><font-awesome-icon icon="mountain" /> Choose background</a></li>
            </ul>
          </template>
        </v-popover>
      </li>
      <li v-show="!wwtIsTourPlaying">
        <font-awesome-icon icon="search-plus" size="lg" @click="doZoom(true)"></font-awesome-icon>
      </li>
      <li v-show="!wwtIsTourPlaying">
        <font-awesome-icon icon="search-minus" size="lg" @click="doZoom(false)"></font-awesome-icon>
      </li>
      <li v-show="fullscreenAvailable">
        <font-awesome-icon v-bind:icon="fullscreenModeActive ? 'compress' : 'expand'"
          size="lg" class="nudgeright1" @click="toggleFullscreen()"></font-awesome-icon>
      </li>
    </ul>

    <div id="tools">
      <div class="tool-container">
      <template v-if="currentTool == 'crossfade'">
        <span>Foreground opacity:</span> <input class="opacity-range" type="range" v-model="foregroundOpacity">
      </template>
      <template v-else-if="currentTool == 'choose-background'">
        <span>Background imagery:</span>
        <select v-model="curBackgroundImagesetName">
          <option v-for="bg in backgroundImagesets" v-bind:value="bg.imagesetName" v-bind:key="bg.imagesetName">
            {{ bg.displayName }}
          </option>
        </select>
      </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";

import * as screenfull from "screenfull";

import { fmtDegLat, fmtDegLon, fmtHours } from "@wwtelescope/astro";
import { ImageSetType } from "@wwtelescope/engine-types";
import { SetupForImagesetOptions, WWTAwareComponent } from "@wwtelescope/engine-vuex";

type ToolType = "crossfade" | "choose-background" | null;

class BackgroundImageset {
  public imagesetName: string;
  public displayName: string;

  constructor(displayName: string, imagesetName: string) {
    this.displayName = displayName;
    this.imagesetName = imagesetName;
  }
}

const skyBackgroundImagesets: BackgroundImageset[] = [
  new BackgroundImageset("Optical (Terapixel DSS)", "Digitized Sky Survey (Color)"),
  new BackgroundImageset("Low-frequency radio (VLSS)", "VLSS: VLA Low-frequency Sky Survey (Radio)"),
  new BackgroundImageset("Infrared (2MASS)", "2Mass: Imagery (Infrared)"),
  new BackgroundImageset("Infrared (SFD dust map)", "SFD Dust Map (Infrared)"),
  new BackgroundImageset("Ultraviolet (GALEX)", "GALEX (Ultraviolet)"),
  new BackgroundImageset("X-Ray (ROSAT RASS)", "RASS: ROSAT All Sky Survey (X-ray)"),
  new BackgroundImageset("Gamma Rays (FERMI LAT 8-year)", "Fermi LAT 8-year (gamma)"),
];

@Component
export default class App extends WWTAwareComponent {
  @Prop({default: null}) readonly allowedOrigin!: string | null;

  backgroundImagesets: BackgroundImageset[] = [];
  currentTool: ToolType = null;
  fullscreenModeActive = false;

  get coordText() {
    if (this.wwtRenderType == ImageSetType.sky) {
      return `${fmtHours(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
    }

    return `${fmtDegLon(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
  }

  get curBackgroundImagesetName() {
    if (this.wwtBackgroundImageset == null)
      return "";
    return this.wwtBackgroundImageset.get_name();
  }

  set curBackgroundImagesetName(name: string) {
    this.setBackgroundImageByName(name);
  }

  get foregroundOpacity() {
    return this.wwtForegroundOpacity;
  }

  set foregroundOpacity(o: number) {
    this.setForegroundOpacity(o);
  }

  get fullscreenAvailable() {
    return screenfull.isEnabled;
  }

  get showBackgroundChooser() {
    if (this.wwtIsTourPlaying)
      return false;

    // TODO: we should wire in choices for other modes!
    return this.wwtRenderType == ImageSetType.sky;
  }

  get showCrossfader() {
    if (this.wwtIsTourPlaying)
      return false; // maybe show this if tour player is active but not playing?

    if (this.wwtForegroundImageset == null || this.wwtForegroundImageset === undefined)
      return false;

    return this.wwtForegroundImageset != this.wwtBackgroundImageset;
  }

  get showToolMenu() {
    // This should return true if there are any tools to show.
    return this.showBackgroundChooser || this.showCrossfader;
  }

  //created() {
  //  let prom = this.waitForReady();
  //}

  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.onFullscreenEvent);
    }

    // For now let's just not worry about removing this listener ...
    window.addEventListener('message', (event) => {
      if (this.allowedOrigin !== null && event.origin == this.allowedOrigin) {
        this.onMessage(event.data);
      }
    }, false);
  }

  destroyed() {
    if (screenfull.isEnabled) {
      screenfull.off('change', this.onFullscreenEvent);
    }
  }

  onMessage(data: any) {
    console.log("message passed filters:");
    console.log(data);
  }

  selectTool(name: ToolType) {
    if (this.currentTool == name) {
      this.currentTool = null;
    } else {
      this.currentTool = name;
    }
  }

  doZoom(zoomIn: boolean) {
    if (zoomIn) {
      this.zoom(1/1.3);
    } else {
      this.zoom(1.3);
    }
  }

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  onFullscreenEvent() {
    // NB: we need the isEnabled check to make TypeScript happy even though it
    // is not necesary in practice here.
    if (screenfull.isEnabled) {
      this.fullscreenModeActive = screenfull.isFullscreen;
    }
  }
}
</script>

<style lang="less">
html {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #000;
}

body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;

  font-family: Verdana, Arial, Helvetica, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;

  .wwtelescope-component {
    position: relative;
    top: 0;
    width: 100%;
    height: 100%;
    border-style: none;
    border-width: 0;
    margin: 0;
    padding: 0;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.modal {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;

  color: #FFF;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

#overlays {
  position: absolute;
  z-index: 10;
  top: 0.5rem;
  left: 0.5rem;
  color: #FFF;

  p {
    margin: 0;
    padding: 0;
    line-height: 1;
  }
}

#controls {
  position: absolute;
  z-index: 10;
  top: 0.5rem;
  right: 0.5rem;
  color: #FFF;

  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    padding: 3px;
    height: 22px;
    cursor: pointer;

    .nudgeright1 {
      padding-left: 3px;
    }
  }
}

#tools {
  position: absolute;
  z-index: 10;
  bottom: 3rem;
  left: 50%;
  color: #FFF;

  .tool-container {
    position: relative;
    left: -50%;
  }

  .opacity-range {
    width: 50vw;
  }

  .clickable {
    cursor: pointer;
  }
}

#credits {
  position: absolute;
  z-index: 10;
  bottom: 0.5rem;
  right: 1rem;
  color: #ddd;
  font-size: 70%;

  p {
    margin: 0;
    padding: 0;
    line-height: 1;
  }

  a {
    text-decoration: none;
    color: #fff;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    height: 24px;
    vertical-align: middle;
    margin: 2px;
  }
}

/* Generic v-tooltip CSS derived from: https://github.com/Akryum/v-tooltip#sass--less */

.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    .popover-inner {
      background: #f9f9f9;
      color: black;
      padding: 8px;
      border-radius: 5px;
    }

    .popover-arrow {
      border-color: #f9f9f9;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}

/* Specialized styling for popups */

ul.tool-menu {
  list-style-type: none;
  margin: 0px;
  padding: 0px;

  li {
    padding: 3px;

    a {
      text-decoration: none;
      color: inherit;
      display: block;
      width: 100%;
    }

    svg.svg-inline--fa {
      width: 1.5em;
    }

    &:hover {
      background-color: #000;
      color: #FFF;
    }
  }
}

</style>
