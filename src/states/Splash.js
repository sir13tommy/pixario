import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.atlas('assets', require('../../assets/images/sprite.png'), null, require('../../assets/images/sprite.json'))
    this.load.atlas('ui', require('../../assets/images/ui.png'), null, require('../../assets/images/ui.json'))
    this.load.audio('click', require('../../assets/sounds/.dist/click.mp3'))
    this.load.audio('loop', require('../../assets/sounds/.dist/loop.mp3'))
  }

  create () {
    this.state.start('Game')
  }
}
