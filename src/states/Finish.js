import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#731dff'
    this.stage.disableVisibilityChange = true
  }
  create () {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    let sparcles = game.add.emitter(0, 0, 10)
    sparcles.makeParticles('assets', ['sparkle_1.png', 'sparkle_2.png'])
    sparcles.gravity = 0

    let trophy = game.add.image(0, 0, 'assets', 'trophy.png')
    trophy.anchor.set(0.5)
    trophy.alignIn(game.camera.view, Phaser.CENTER, 0, -100)

    sparcles.alignIn(trophy, Phaser.CENTER, 0, 0)
    sparcles.start(false, Phaser.Timer.SECOND * 1.5, null, 0)

    let congrat = game.add.text(0, 0, 'You won!', {
      font: 'normal 60px sf_pro_textregular',
      fill: '#ffffff'
    })
    congrat.anchor.set(0.5)
    congrat.alignTo(trophy, Phaser.BOTTOM_CENTER, 0, 20)

    let scoreHolder = game.add.image(0, 0, 'ui', 'score_holder.png')
    scoreHolder.alignTo(congrat, Phaser.BOTTOM_CENTER, 0, 15)

    let star = game.add.image(0, 0, 'ui', 'star.png')
    star.scale.set(0.5)
    star.alignIn(scoreHolder, Phaser.LEFT_CENTER, -10, 0)

    let scoreKey = game.add.text(0, 0, 'Score', {
      font: 'normal 25px sf_pro_textregular',
      fill: '#ffffff'
    })
    scoreKey.alignTo(star, Phaser.RIGHT_CENTER, 8, 3)

    let score = game.add.text(0, 0, '342', {
      font: 'normal 33px sf_pro_textregular',
      fill: '#ffd106'
    })
    score.alignIn(scoreHolder, Phaser.RIGHT_CENTER, -10, 4)

    let ctaBtnFrame = 'cta-button.png'
    let ctaBtn = game.add.button(0, 0, 'ui', ctaAction, null, ctaBtnFrame, ctaBtnFrame, ctaBtnFrame)
    ctaBtn.anchor.set(0.5)
    ctaBtn.alignIn(game.camera.view, Phaser.BOTTOM_CENTER, 0, -30)

    let ctaBtnContent = game.add.text(0, 3, 'Install Now', {
      font: 'normal 27px sf_pro_textregular',
      fill: '#ffffff'
    })
    ctaBtnContent.anchor.set(0.5)
    ctaBtn.addChild(ctaBtnContent)

    // Tweens
    game.add.tween(trophy.scale)
      .from({x: 0, y: 0})
      .easing(Phaser.Easing.Bounce.Out)
      .start()

    game.add.tween(congrat.scale)
      .from({x: 0, y: 0})
      .easing(Phaser.Easing.Bounce.Out)
      .delay(Phaser.Timer.SECOND * 0.5)
      .start()

    game.add.tween(ctaBtn.scale)
      .from({x: 0, y: 0})
      .easing(Phaser.Easing.Bounce.Out)
      .delay(Phaser.Timer.SECOND * 0.2)
      .start()

    function ctaAction () {
      if (typeof FbPlayableAd !== 'undefined' && FbPlayableAd.onCTAClick) {
        FbPlayableAd.onCTAClick()
      } else {
        console.log('CTA click')
      }
    }
  }
}