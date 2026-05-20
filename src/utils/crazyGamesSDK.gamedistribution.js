// src/utils/crazyGamesSDK.js
// GameDistribution SDK Implementation for MagnaShift: Magnet Escape

let isAudioMuted = false;
let activeAdCallbacks = null;

export const crazyGamesSDK = {
  initialized: false,
  
  init() {
    if (this.initialized) return;
    this.initialized = true;

    window.gdsdkCallbacks = {
      onAdStarted: () => {
        console.log("[GameDistribution SDK] Ad started. Pausing game.");
        isAudioMuted = true;
        if (activeAdCallbacks && typeof activeAdCallbacks.onAdStarted === 'function') {
          activeAdCallbacks.onAdStarted();
        }
      },
      onAdFinished: () => {
        console.log("[GameDistribution SDK] Ad finished. Resuming game.");
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
    console.log("[GameDistribution SDK] gameplayStart() signaled.");
  },

  notifyGameplayStop() {
    console.log("[GameDistribution SDK] gameplayStop() signaled.");
  },

  requestAd(type, callbacks) {
    this.init();

    if (typeof gdsdk !== 'undefined' && gdsdk.showAd) {
      console.log(`[GameDistribution SDK] Requesting ${type} ad...`);
      activeAdCallbacks = callbacks;

      gdsdk.showAd(type === 'rewarded' ? 'rewarded' : 'interstitial')
        .catch((e) => {
          console.warn("[GameDistribution SDK] Ad request error/blocked:", e);
          if (callbacks && typeof callbacks.onAdFinished === 'function') {
            callbacks.onAdFinished();
          }
          activeAdCallbacks = null;
        });
      return true;
    }

    console.log("[GameDistribution SDK Mock] No SDK detected, bypassing ad.");
    if (callbacks && typeof callbacks.onAdFinished === 'function') {
      callbacks.onAdFinished();
    }
    return false;
  }
};
