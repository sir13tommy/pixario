/* globals __DEV__, FbPlayableAd */
import Phaser from 'phaser'

const images = [{
    name: 'penguin',
    frames: [
      'penguin_1.png',
      'penguin_2.png',
      'penguin_3.png',
      'penguin_4.png'
    ]
  }, {
    name: 'lips',
    frames: [
      'lips_1.png',
      'lips_2.png',
      'lips_3.png',
      'lips_4.png'
    ]
  }, {
    name: 'cake',
    frames: [
      'cake_1.png',
      'cake_2.png',
      'cake_3.png',
      'cake_4.png'
    ]
  }
]

export default class extends Phaser.State {
  init () {
    game.stage.disableVisibilityChange = true
  }
  preload () { }

  create (game) {
    let enableInput = false

    const viewPaddings = {
      top: 16,
      right: 16,
      bottom: 16,
      left: 16
    }

    let uiBlock = game.make.graphics(0, 0)
    uiBlock.beginFill(0xffffff)
    uiBlock.drawRect(0, 0, game.width, 172)
    uiBlock.alignIn(game.camera.view, Phaser.BOTTOM_CENTER, 0, 0)
    game.world.add(uiBlock)

    let canvasPaddings = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }

    let canvasSize = {
      width: game.width - canvasPaddings.left - canvasPaddings.right,
      height: game.height - uiBlock.height - canvasPaddings.top - canvasPaddings.bottom
    }

    let currentImgIdx = 0
    let currentFrameIdx = 0

    let canvas = game.add.group(game.world, 'canvas')

    let sprite = game.make.image(0, 0, 'assets', images[currentImgIdx].frames[currentFrameIdx])
    sprite.anchor.set(0.5)
    canvas.add(sprite)
    game.scale.scaleSprite(canvas, canvasSize.width, canvasSize.height, true)
    canvas.alignIn(game.camera.view, Phaser.TOP_CENTER, 0, -canvasPaddings.top)

    enableInput = false
    game.add.tween(canvas.scale)
      .from({x: 0, y: 0}, Phaser.Timer.SECOND * 0.5)
      .easing(Phaser.Easing.Bounce.Out)
      .start()
      .onComplete.add(() => {
        enableInput = true
      })
      
    let hint = game.make.text(game.world.centerX, game.world.centerY - 60, 'tap to coloring'.toUpperCase(), {
      font: 'normal 45px sf_pro_textregular',
      fill: '#ffffff',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: game.width - viewPaddings.right - viewPaddings.left
    })
    hint.anchor.set(0.5)
    game.stage.add(hint)
    game.add.tween(hint)
      .to({alpha: 0.6})
      .repeat(-1)
      .yoyo(true)
      .start()
    
    let hand = game.make.image(game.world.centerX, game.world.centerY, 'assets', 'hand.png')
    hand.anchor.set(0.5)
    game.stage.add(hand)
    hand.alignTo(hint, Phaser.BOTTOM_CENTER, 0, 10)
    game.add.tween(hand.scale)
      .to({x: 0.7, y: 0.7})
      .repeat(-1)
      .yoyo(true)
      .start()

    game.input.onDown.add(step)

    function step () {
      if (!enableInput) return

      if (showHint) {
        fadeInCamera()
        hand.visible = false
        hint.visible = false
        showHint = false
      }

      currentFrameIdx++
      if (images[currentImgIdx]) {
        if (images[currentImgIdx].frames[currentFrameIdx]) {
          let sprite = game.make.image(0, 0, 'assets', images[currentImgIdx].frames[currentFrameIdx])
          sprite.anchor.set(0.5)
          canvas.add(sprite)
        } else {
          currentFrameIdx = 0
          currentImgIdx++
          if (images[currentImgIdx]) {
            // change image
            enableInput = false
            game.add.tween(canvas.scale)
              .to({x: 0, y: 0}, Phaser.Timer.SECOND * 0.5)
              .easing(Phaser.Easing.Bounce.In)
              .start()
              .onComplete.add(() => {
                clearCanvas()
                let sprite = game.make.image(0, 0, 'assets', images[currentImgIdx].frames[currentFrameIdx])
                sprite.anchor.set(0.5)
                canvas.add(sprite)
                game.scale.scaleSprite(canvas, canvasSize.width, canvasSize.height, true)
                canvas.alignIn(game.camera.view, Phaser.TOP_CENTER, 0, -canvasPaddings.top)

                game.add.tween(canvas.scale)
                  .from({x: 0, y: 0}, Phaser.Timer.SECOND * 0.5)
                  .easing(Phaser.Easing.Bounce.Out)
                  .start()
                  .onComplete.add(() => {
                    enableInput = true
                  })
              })
          }
        }
      }
      if (!images[currentImgIdx] && !isFinish) {
        finishGame()
      }
    }

    function clearCanvas () {
      canvas.removeAll(true)
    }

    // start game function
    let showHint = true
    function startGame () {
      fadeOutCamera()
    }

    // finish game function
    let isFinish = false
    function finishGame () {
      isFinish = true
      fadeOutCamera()

      hint.text = 'Get a Chance to Win Real Money'
      hint.visible = true
      hint.alignIn(game.camera.view, Phaser.CENTER, 0, -60)

      let ctaBtnFrame = 'cta-button.png'
      let ctaBtn = game.make.button(
        0,
        0,
        'assets',
        ctaAction,
        null,
        ctaBtnFrame,
        ctaBtnFrame,
        ctaBtnFrame
      )
      ctaBtn.anchor.set(0.5)

      let ctaBtnText = game.make.text(0, -5, 'Install Now', {
        font: 'normal 35px sf_pro_textregular',
        color: '#000000'
      })
      ctaBtnText.anchor.set(0.5)
      ctaBtn.addChild(ctaBtnText)

      game.stage.add(ctaBtn)
      ctaBtn.alignTo(hint, Phaser.BOTTOM_CENTER, 0, 10)

      game.add.tween(ctaBtn.scale)
        .from({x: 0, y: 0}, Phaser.Timer.SECOND * 0.5)
        .easing(Phaser.Easing.Bounce.Out)
        .start()
    }

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
        opacity = 0.8
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
