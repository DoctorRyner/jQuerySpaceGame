function randomInt(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
class Vector2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
class GameFieldLimitation {
    constructor(minX, maxX, minY, maxY) {
        this.minX = minX
        this.maxX = maxX
        this.minY = minY
        this.maxY = maxY
    }
}

class Beam {
    setPos(newPos) {
        $(this.id).css('left', newPos.x);
        $(this.id).css('top', newPos.y);
    }
    move(offset) {
        this.pos = new Vector2(this.pos.x + offset.x, this.pos.y + offset.y)
        this.setPos(this.pos)
    }
    timer() {
        this.move(new Vector2(0, -this.speed))
        this.maxDist -= this.speed
        if(this.maxDist > 0) this.timerId = setTimeout(this.timer.bind(this), this.period)
        else {
            $(this.id).remove()
            this.isDead = true
        }
    }

    constructor(at) {
        this.number = ++Beam.amount
        this.id = 'beam' + this.number
        $('body').append('<img src="Pictures/beam.png" ' + 'id="' + this.id + '">');
        this.id = '#beam' + this.number
        $('head').append('<style>' +
            this.id + ' {\
                position: absolute;\
                height: 5%;\
            }\
        </style>')
        if(randomInt(0, 1)) this.pos = new Vector2(at.x + 12, at.y)
        else this.pos = new Vector2(at.x + 62, at.y)
        this.setPos(this.pos)
        this.speed = 5
        this.period = 10
        this.maxDist = 400
        this.isDead = false
        this.timerId = setTimeout(this.timer.bind(this), this.period)
    }
}
Beam.amount = 0
Beam.beams = new Array()

function hit(emit, whoChecks) {
    if(emit == undefined || whoChecks == undefined) return
    var hitBox = emit.hitBox
    var hitOffset = emit.hitOffset
    if((whoChecks.pos.x >= (emit.pos.x + hitOffset - hitBox) && whoChecks.pos.x <= (emit.pos.x + hitOffset + hitBox)) && (whoChecks.pos.y >= (emit.pos.y + hitOffset - hitBox) && whoChecks.pos.y <= (emit.pos.y + hitOffset + 20 + hitBox))) {
        return true
    }
    return false
}

class Enemy {
    setPos(newPos) {
        $(this.id).css('left', newPos.x);
        $(this.id).css('top', newPos.y);
    }
    move(offset) {
        Game.area = new GameFieldLimitation(50, $(document).width() - 135, $(document).height() - 450, $(document).height() - 150)
        this.pos = new Vector2(this.pos.x + offset.x, this.pos.y + offset.y)
        this.setPos(this.pos)
    }

    lookForAttack(player) {
        if(Game.isOver) return
        var hitBox = this.hitBox
        var hitOffset = this.hitOffset
        if(hit(this, player)) {
            player.hp -= 1
            $("#explosion").get(0).pause()
            $("#explosion").currentTime = 0;
            $("#explosion").get(0).play()
            this.kill()
            if(player.hp > 0) return
            $(player.id).remove()
            Game.isOver = true
        }
    }
    kill() {
        $(this.id).remove()
        this.isDead = true
    }
    constructor() {
        this.number = ++Enemy.amount;
        this.id = 'asteroid' + this.number;
        $('body').append('<img src="Pictures/asteroid.png" ' + 'id="' + this.id + '">');
        this.id = '#asteroid' + this.number;
        $('head').append('<style>' +
            this.id + ' {\
                position: absolute;\
                height: 13%;\
            }\
        </style>')
        this.hitBox = 50
        this.hitOffset = 10
        this.speed = 5
        this.isDead = false
        this.hp = 3
        this.pos = new Vector2(($(document).width() - 150) / 2, $(document).height() - 150);
        this.setPos(this.pos);
        this.period = 100
    }
}
Enemy.amount = 0

class Player {
    setPos(newPos) {
        $(this.id).css('left', newPos.x);
        $(this.id).css('top', newPos.y);
    }
    move(offset) {
        Game.area = new GameFieldLimitation(50, $(document).width() - 135, $(document).height() - 450, $(document).height() - 150)
        this.pos = new Vector2(this.pos.x + offset.x, this.pos.y + offset.y)
        this.setPos(this.pos)
    }
    static input(gottenPlayer) {
        $(document).keydown(function(pressed) {
            if(Game.isOver) return
            if(pressed.keyCode == 32) {
                Beam.beams.push(new Beam(gottenPlayer.pos))
            }

            if(pressed.keyCode == 37) gottenPlayer.mLeft = true
            if(pressed.keyCode == 39) gottenPlayer.mRight = true
            if(pressed.keyCode == 38) gottenPlayer.mUp = true
            if(pressed.keyCode == 40) gottenPlayer.mDown = true
            // to move
            if(gottenPlayer.mLeft && gottenPlayer.pos.x > Game.area.minX) gottenPlayer.move(new Vector2(-gottenPlayer.speed, 0))
            if(gottenPlayer.mRight && gottenPlayer.pos.x < Game.area.maxX) gottenPlayer.move(new Vector2(gottenPlayer.speed, 0))
            if(gottenPlayer.mUp && gottenPlayer.pos.y > Game.area.minY) gottenPlayer.move(new Vector2(0, -gottenPlayer.speed))
            if(gottenPlayer.mDown && gottenPlayer.pos.y < Game.area.maxY) gottenPlayer.move(new Vector2(0, gottenPlayer.speed))
        })
        $(document).keyup(function(pressed) {
            if(pressed.keyCode == 37) gottenPlayer.mLeft = false
            if(pressed.keyCode == 39) gottenPlayer.mRight = false
            if(pressed.keyCode == 38) gottenPlayer.mUp = false
            if(pressed.keyCode == 40) gottenPlayer.mDown = false
        })
    }
    constructor() {
        this.number = ++Player.amount;
        this.id = 'player' + this.number;
        $('body').append('<img src="Pictures/Player.png" ' + 'id="' + this.id + '">');
        this.id = '#player' + this.number;
        $('head').append('<style>' +
            this.id + ' {\
                position: absolute;\
                height: 9%;\
            }\
        </style>')
        this.mRight = false
        this.mLeft = false
        this.mDown = false
        this.mUp = false
        this.speed = 30
        this.hp = 5
        this.pos = new Vector2(($(document).width() - 150) / 2, $(document).height() - 150);
        this.setPos(this.pos);
        Player.input(this)
    }
}
Player.amount = 0

class Game {

    gameLoop() {
        if(!Game.isOver) Game.scores += 1
        $('#scores').html('Очки: ' + Game.scores)
        $('#scoresAster').html('Астероидов уничтожено: ' + Game.scoresAster)
        $('#beams').html('Выстрелов произведено: ' + Beam.amount)
        if(!Game.isOver) $('#hp').html('Здоровье: ' + this.player.hp)
        else $('#hp').html('Игра окончена!')
        //this.timerId = setTimeout(this.testEnemy.lookForAttack.bind(this.testEnemy, this.player), this.period)
        if(randomInt(0, 100) < 5) {
            var enemy = new Enemy()
            enemy.move(new Vector2(randomInt(-Game.asteroidSpawnWidth - 30, Game.asteroidSpawnWidth - 30), randomInt(Game.asteroidSpawnHeight, Game.asteroidSpawnHeight + 100)))
            enemy.speed = randomInt(1, 7)
            this.asteroids.push(enemy)
        }
        if(this.asteroids.length > 0) {
            for(var aster of this.asteroids) {
                if(!aster.isDead) {
                
                    if(aster.pos.y >= Game.area.maxY) { aster.kill() }
                    else {
                        aster.move(new Vector2(0, aster.speed))
                        aster.lookForAttack(this.player)
                        if(Beam.beams.length > 0) {
                            for(var beam of Beam.beams) {
                                if(!beam.isDead) {
                                    if(hit(aster, beam)) {
                                        if(aster.hp < 1) {
                                            aster.kill()
                                            $("#explosion").get(0).pause()
                                            $("#explosion").currentTime = 0;
                                            $("#explosion").get(0).play()
                                            Game.scoresAster += 1
                                            Game.scores += 500
                                        }
                                        else aster.hp -= 1
                                        beam.maxDist = 0
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        this.timerId = setTimeout(this.gameLoop.bind(this), this.period)
    }

    constructor() {
        $("#music").get(0).play();
        Game.area = new GameFieldLimitation(50, $(document).width() - 135, $(document).height() - 450, $(document).height() - 150)
        this.player = new Player()
        this.asteroids = new Array()
        this.period = 10
        this.gameLoop()
    }
}
Game.isOver = false
Game.area = null
Game.asteroidSpawnWidth = 750
Game.asteroidSpawnHeight = -1000
Game.scores = 0
Game.scoresAster = 0

$(document).ready(function() { main = new Game() })