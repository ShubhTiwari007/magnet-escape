// src/utils/crazyGamesSDK.js
// CrazyGames SDK Integration for MagnaShift: Magnet Escape

let crazySDK = null;
let isAudioMuted = false;

export const crazyGamesSDK = {
  initialized: false,

  init() {
    if (this.initialized) return;

    if (window.CrazyGames && window.CrazyGames.SDK) {
      try {
        crazySDK = window.CrazyGames.SDK;
        crazySDK.init();
        this.initialized = true;
        console.log("[CrazyGames SDK] Official SDK v3 initialized successfully.");

        // Listen for system mute settings from CrazyGames dashboard/overlay
        if (crazySDK.game && typeof crazySDK.game.addSettingsChangeListener === 'function') {
          crazySDK.game.addSettingsChangeListener((settings) => {
            if (settings && settings.muteAudio !== undefined) {
              console.log(`[CrazyGames SDK] Audio mute setting changed: ${settings.muteAudio}`);
              isAudioMuted = settings.muteAudio;
            }
          });
        }
      } catch (e) {
        console.error("[CrazyGames SDK] Failed to initialize official SDK:", e);
      }
    } else {
      console.log("[CrazyGames SDK] Running in local standalone/mock mode.");
    }
  },

  isMuted() {
    return isAudioMuted;
  },

  notifyGameplayStart() {
    this.init();
    if (crazySDK && crazySDK.game) {
      try {
        crazySDK.game.gameplayStart();
        console.log("[CrazyGames SDK] gameplayStart() signaled.");
      } catch (e) {
        console.warn("[CrazyGames SDK] Error calling gameplayStart:", e);
      }
    }
  },

  notifyGameplayStop() {
    if (crazySDK && crazySDK.game) {
      try {
        crazySDK.game.gameplayStop();
        console.log("[CrazyGames SDK] gameplayStop() signaled.");
      } catch (e) {
        console.warn("[CrazyGames SDK] Error calling gameplayStop:", e);
      }
    }
  },

  requestAd(type, { onAdStarted, onAdFinished, onAdError }) {
    this.init();

    if (crazySDK && crazySDK.ad) {
      const adType = type === 'rewarded' ? 'rewarded' : 'midgame';
      console.log(`[CrazyGames SDK] Requesting ${adType} ad break...`);

      crazySDK.ad.requestAd(adType, {
        adStarted: () => {
          console.log("[CrazyGames SDK] Ad started. Pausing game.");
          if (onAdStarted) onAdStarted();
        },
        adFinished: () => {
          console.log("[CrazyGames SDK] Ad finished. Resuming game.");
          if (onAdFinished) onAdFinished();
        },
        adError: (error) => {
          console.error("[CrazyGames SDK] Ad error:", error);
          if (onAdError) onAdError(error);
          else if (onAdFinished) onAdFinished(); // Fail-safe fallback to allow play
        }
      });
      return true;
    }

    // Standing local fallback -> immediately continue gameplay without delay
    console.log("[CrazyGames SDK Mock] Ad break simulated, immediately continuing.");
    if (onAdFinished) onAdFinished();
    return false;
  }
};
