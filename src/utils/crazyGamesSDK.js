// src/utils/crazyGamesSDK.js
// GameMonetize SDK Implementation for MagnaShift: Magnet Escape

let isAudioMuted = false;
let activeAdCallbacks = null;

export const crazyGamesSDK = {
  initialized: false,
  
  init() {
    if (this.initialized) return;
    this.initialized = true;

    window.sdkCallbacks = {
      onAdStarted: () => {
        console.log("[GameMonetize SDK] Ad started. Pausing game.");
        isAudioMuted = true;
        if (activeAdCallbacks && typeof activeAdCallbacks.onAdStarted === 'function') {
          activeAdCallbacks.onAdStarted();
        }
      },
      onAdFinished: () => {
        console.log("[GameMonetize SDK] Ad finished. Resuming game.");
        isAudioMuted = false;
        if (activeAdCallbacks && typeof activeAdCallbacks.onAdFinished === 'function') {
          activeAdCallbacks.onAdFinished();
        }
        activeAdCallbacks = null;
      }
    };
  },

  isMuted() {
    return isAudioMuted;
  },

  notifyGameplayStart() {
    this.init();
    console.log("[GameMonetize SDK] gameplayStart() signaled.");
  },

  notifyGameplayStop() {
    console.log("[GameMonetize SDK] gameplayStop() signaled.");
  },

  requestAd(type, callbacks) {
    this.init();

    if (typeof sdk !== 'undefined' && sdk.showBanner) {
      console.log(`[GameMonetize SDK] Requesting ${type} ad...`);
      activeAdCallbacks = callbacks;

      sdk.showBanner();
      return true;
    }

    console.log("[GameMonetize SDK Mock] No SDK detected, bypassing ad.");
    if (callbacks && typeof callbacks.onAdFinished === 'function') {
      callbacks.onAdFinished();
    }
    return false;
  }
};
