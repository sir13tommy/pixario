/* globals __DEV__, FbPlayableAd */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    game.stage.disableVisibilityChange = true
  }
  preload () { }

  create (game) {
    const viewPaddings = {
      top: 0,
      right: 48,
      bottom: 0,
      left: 48
    }

    let hand = game.add.image(game.world.centerX, game.world.centerY, 'assets', 'hand.png')
    hand.anchor.set(0.5)

    // start game function
    let showHint = true
    function startGame () { }

    // finish game function
    let isFinish = false
    function finishGame () {}

    function ctaAction () {
      if (typeof FbPlayableAd !== 'undefined' && FbPlayableAd.onCTAClick) {
        FbPlayableAd.onCTAClick()
      } else {
        console.log('CTA click')
      }
    }

    function fadeOutCamera (opacity) {
      if (typeof opacity !== 'undefined') {
        opacity = opacity
      } else {
        opacity = 0.6
      }
      game.camera.fade(0x000000, Phaser.Timer.SECOND * 0.5, true, opacity);
    }
    function fadeInCamera () {
      game.camera.fade(0x000000, Phaser.Timer.SECOND * 0.5, true, 0);
    }

    startGame()
  }

  update () { }

  render() {
    if (__DEV__) {
      // dev logs
    }
  }
}
