/* globals __DEV__, FbPlayableAd */
import Phaser from 'phaser'

const images = [{
    name: 'penguin',
    frames: [
      {name: 'penguin_1.png', cursor: {x: 89, y: 89}},
      {name: 'penguin_2.png'},
      {name: 'penguin_3.png'},
      {name: 'penguin_4.png'}
    ]
  }, {
    name: 'lips',
    frames: [
      {name: 'lips_1.png', cursor: {x: 119, y: 63}},
      {name: 'lips_3.png'},
      {name: 'lips_2.png'},
      {name: 'lips_4.png'}
    ]
  }, {
    name: 'cake',
    frames: [
      {name: 'cake_1.png', cursor: {x: 75, y: 49}},
      {name: 'cake_2.png'},
      {name: 'cake_3.png'},
      {name: 'cake_4.png'}
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

    let sfx = {
      click: game.add.audio('click'),
      loop: game.add.audio('loop')
    }

    const viewPaddings = {
      top: 16,
      right: 16,
      bottom: 16,
      left: 16
    }

    this.userProgressVal = 0
    this.userProgressMax = 12

    let canvas = game.add.group(game.world, 'canvas')

    let uiBlock = game.make.graphics(0, 0)
    uiBlock.beginFill(0xffffff)
    uiBlock.drawRect(0, 0, game.width, 152)
    uiBlock.alignIn(game.camera.view, Phaser.BOTTOM_CENTER, 0, 0)
    game.world.add(uiBlock)

    let namesStyle = {
      font: 'normal 16px sf_pro_textregular',
      fill: '#353535'
    }
    let progressBarWidth = game.width - viewPaddings.right - viewPaddings.left
    let progressBarHeight = 4
    // User progress bar
    let userProgress = game.add.group(game.world, 'user progress')

    let userProgressBack = game.make.graphics(0, 0)
    userProgressBack.beginFill(0xf1f1f1)
    userProgressBack.drawRect(0, 0, progressBarWidth, progressBarHeight)
    userProgress.add(userProgressBack)

    let userProgressBar = game.make.graphics(0, 0)
    this.userProgressBar = userProgressBar
    userProgressBar.beginFill(0x7520ff)
    userProgressBar.drawRect(0, 0, progressBarWidth, progressBarHeight)
    userProgressBar.scale.set(0.01, 1)
    userProgress.add(userProgressBar)

    let userName = game.make.text(0, 0, 'You', namesStyle)
    userProgress.add(userName)
    userName.alignTo(userProgressBack, Phaser.TOP_LEFT, 0, 4)

    userProgress.alignIn(uiBlock, Phaser.TOP_LEFT, -viewPaddings.left, -viewPaddings.top)

    // enemy progress bar
    let enemyProgress = game.add.group(game.world, 'enemy progress')

    let enemyProgressBack = game.make.graphics(0, 0)
    enemyProgressBack.beginFill(0xf1f1f1)
    enemyProgressBack.drawRect(0, 0, progressBarWidth, progressBarHeight)
    enemyProgress.add(enemyProgressBack)

    let enemyProgressBar = game.make.graphics(0, 0)
    this.enemyProgressBar = enemyProgressBar
    enemyProgressBar.beginFill(0xff5a5f)
    enemyProgressBar.drawRect(0, 0, progressBarWidth, progressBarHeight)
    enemyProgressBar.scale.set(0.01, 1)
    enemyProgress.add(enemyProgressBar)

    let enemyName = game.make.text(0, 0, 'Opponent', namesStyle)
    enemyProgress.add(enemyName)
    enemyName.alignTo(userProgressBack, Phaser.TOP_LEFT, 0, 4)

    enemyProgress.alignTo(userProgress, Phaser.BOTTOM_LEFT, 0, 8)

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

    let sprite = game.make.image(0, 0, 'assets', images[currentImgIdx].frames[currentFrameIdx].name)
    sprite.anchor.set(0.5)
    sprite.smoothed = false
    canvas.add(sprite)
    game.scale.scaleSprite(canvas, canvasSize.width, canvasSize.height, true)
    canvas.alignIn(game.camera.view, Phaser.TOP_CENTER, 0, -canvasPaddings.top)

    let cursor = game.make.image(0, 0, 'ui', 'hand.png')
    this.cursor = cursor
    cursor.anchor.set(0.5)
    cursor.smoothed = true
    game.world.add(cursor)
    let cursorIdle = game.add.tween(cursor.scale)
      .to({x: 0.7, y: 0.7})
      .repeat(-1)
      .yoyo(true)
      .start()

    updateCursor()

    enableInput = false
    game.add.tween(canvas.scale)
      .from({x: 0, y: 0}, Phaser.Timer.SECOND * 0.5)
      .easing(Phaser.Easing.Bounce.Out)
      .start()
      .onComplete.add(() => {
        enableInput = true
      })
    
    let hint = game.make.image(0, 0, 'ui', 'hint.png')
    hint.anchor.set(0.5)
    hint.scale.set(0.7)
    hint.alignTo(cursor, Phaser.BOTTOM_CENTER, 0, 0)
    if (hint.right > game.width - 10) {
      hint.right = game.width - 10
    }
    game.world.add(hint)

    game.add.tween(hint.scale)
      .from({x: 0, y: 0})
      .easing(Phaser.Easing.Bounce.Out)
      .delay(Phaser.Timer.SECOND * 0.5)
      .start()
    
    let hintContent = game.make.text(0, 0, 'tap to coloring'.toUpperCase(), {
      font: 'normal 35px sf_pro_textregular',
      fill: '#ffffff',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: game.width - viewPaddings.right - viewPaddings.left
    })
    hintContent.anchor.set(0.5)
    hint.addChild(hintContent)

    game.input.onDown.add(step, this)

    function step () {
      if (!enableInput) return

      if (this.isFinish) return

      if (showHint) {
        hint.visible = false
        showHint = false
      }

      sfx.click.play()

      currentFrameIdx++
      if (currentFrameIdx === 1) {
        updateCursor()
      }

      if (images[currentImgIdx]) {
        let { frames } = images[currentImgIdx]
        if (frames[currentFrameIdx]) {
          let sprite = game.make.image(0, 0, 'assets', images[currentImgIdx].frames[currentFrameIdx].name)
          sprite.smoothed = false
          sprite.anchor.set(0.5)
          canvas.add(sprite)
        }

        if (frames.length - 1 === currentFrameIdx) {
          currentFrameIdx = 0
          currentImgIdx++
          if (images[currentImgIdx]) {
            // change image
            enableInput = false
            game.add.tween(canvas.scale)
              .to({x: 0, y: 0}, Phaser.Timer.SECOND * 0.5)
              .easing(Phaser.Easing.Bounce.In)
              .delay(Phaser.Timer.HALF)
              .start()
              .onComplete.add(() => {
                clearCanvas()
                let sprite = game.make.image(0, 0, 'assets', images[currentImgIdx].frames[currentFrameIdx].name)
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
                    updateCursor()
                  })
              })
          }
        }
      }

      // update user progress
      this.userProgressVal = 4 * currentImgIdx + currentFrameIdx + 1
      if (!images[currentImgIdx] && !this.isFinish) {
        enableInput = false        
        setTimeout(finishGame.bind(this), Phaser.Timer.HALF )
      }
    }

    // save scale idle factors
    let scaleX
    let scaleY
    function updateCursor () {
      if (images[currentImgIdx] && images[currentImgIdx].frames[currentFrameIdx]) {
        let cursorPos = images[currentImgIdx] && images[currentImgIdx].frames[currentFrameIdx].cursor
        if (cursorPos) {
          if (cursor.hiddingTween && cursor.hiddingTween.isRunning) {
            cursor.hiddingTween.stop()
          }
          if (!cursor.visible) {
            cursor.visible = true
            cursor.showTween = game.add.tween(cursor.scale)
              .to({x: scaleX || 1, y: scaleY || 1}, Phaser.Timer.SECOND * 0.2)
              // .easing(Phaser.Easing.Bounce.Out)
              .start()
              .onComplete.addOnce(() => {
                cursorIdle.resume()
              })
          }
          let { x: cursorX, y: cursorY} = cursorPos
          cursor.left = canvas.left + cursorX * canvas.scale.x
          cursor.top = canvas.top + cursorY * canvas.scale.y
        } else {
          cursorIdle.pause()
          scaleX = cursor.scale.x
          scaleY = cursor.scale.y
          if (cursor.showTween && cursor.showTween.isRunning) {
            cursor.showTween.stop()
          }
          cursor.hiddingTween = game.add.tween(cursor.scale)
            .to({x: 0, y: 0}, Phaser.Timer.SECOND * 0.2)
            .easing(Phaser.Easing.Bounce.In)
            .start()
            .onComplete.addOnce(() => {cursor.visible = false})
        }
      }
    }

    function clearCanvas () {
      canvas.removeAll(true)
    }

    // start game function
    let showHint = true
    function startGame () {
      sfx.loop.onDecoded.addOnce(() => {
        sfx.loop.play('', 0, 1, true)
      })
    }

    // finish game function
    function finishGame () {
      game.state.start('Finish')
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

  update () {
    if (!this.isFinish) {
      let userScaleFactor = Math.min(this.userProgressVal / this.userProgressMax, 1)
      userScaleFactor = userScaleFactor.toFixed(2)
      if (this.userProgressBar.scale.x < userScaleFactor) {
        this.userProgressBar.scale.x += 0.01
      }

      if (this.enemyProgressBar.scale.x < userScaleFactor - 0.1) {
        this.enemyProgressBar.scale.x += 0.0003
      }
    }
  }

  render() {
    if (__DEV__) {
      // dev logs
    }
  }
}
