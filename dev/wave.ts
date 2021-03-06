class Wave {

    private playScreen : PlayScreen
    private player : Player
    private amountMonsters : number
    private _currentMonsters : number = 0
    private waveComplete : boolean = false

    private waveIntroElement : HTMLElement

    public get currentMonsters() : number {
        return this._currentMonsters
    }

    public set currentMonsters(c : number) {
        this._currentMonsters = c
    }

    constructor(playScreen : PlayScreen, player : Player) {
        
        // Set Playscreen
        this.playScreen = playScreen

        // Set Player
        this.player = player

        // Calculate amount monster ( FLOOR : level * 1.50 )
        this.amountMonsters = Math.floor(this.playScreen.game.user.level * 1.50)

        // Enemy getting stronger after 10 waves
        if (this.playScreen.game.user.level % 10 == 0) {
            this.playScreen.game.enemyLevel++
        }

        // Wave intro
        this.waveIntroElement = document.createElement("waveintro")
        this.waveIntro()
    }

    // The Wave intro
    private waveIntro() {

        // Show the Wave intro
        this.waveIntroElement.innerHTML = `Wave ${this.playScreen.game.user.level}`
        document.body.appendChild(this.waveIntroElement)

        // Start battle sound
        Sound.getInstance().playBattle()

        // Wait 3 seconds for the intro
        setTimeout( () => this.createEnemies(), 5000)
    }

    private createEnemies() {

        // Remove the wave level intro
        this.waveIntroElement.remove()

        // Set the position of the enemy
        let posX = this.setEnemyPosition()
        let posY = 0

        // Add the enemy to the playscreen
        this.playScreen.addEnemy(new Zombie(this.playScreen, posX, posY))

        // Add currentMonster on the screen
        this.currentMonsters++

        if ( this.waveComplete == false && this.playScreen.enemies.length < this.amountMonsters) {
            // Create enemies every 2 seconds
            setTimeout(() => this.createEnemies(), 1000)
        } 

    }

    private setEnemyPosition () : number {

        // Position enemy on the X line
        let posX = 0

        // Position Player
        let playerHitBox = this.player.getRectangle()

        // Generate a random position, keep doing that if the position is at players position
        do {
            posX = Math.floor(Math.random() * Math.floor(window.innerWidth - 70));
        } 
        while (posX > playerHitBox.left - 150 && posX < playerHitBox.right + 150)

        return posX
    }

    public update() {

        // If the amount of monster on screen is zero, complete the wave
        if (this.currentMonsters == 0 && this.playScreen.enemies.length == this.amountMonsters) {

            // Stop battle sound
            Sound.getInstance().stopBattle()
            
            // Complete the wave
            this.waveComplete = true

            // Remove the event listener
            this.player.removeListener()

            // Open the Wave Complete Screen
            document.body.innerHTML = ""
            this.playScreen.game.screen = new WaveScreen(this.playScreen.game)
        }

    }

}