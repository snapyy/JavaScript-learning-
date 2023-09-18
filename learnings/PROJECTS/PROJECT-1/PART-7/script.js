//Load Event :- waits for all assets such as spritesheets and images to be fully loaded before it executes code in its callback fucntion.
// Anonymous function :- function without a name.
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    // ctx= content instance of built in canvas 2D api that holds all drawing method and properties we will need to animate our game.
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let enemies =[];
    let score=0;
    // In the below class , input handler class will apply event listeners to the game and it will keep track of all keys that are currently pressed down .
    class InputHandler {
        constructor() {
            // In the below variable , we will be adding and removing keys from it as they are being pressed and released .
            this.keys = [];
            //Es6 arrow functions :- don't blind their own 'this', but they inherit the one from their parent scope , this is called lexical scoping .
            window.addEventListener('keydown', e => {
                // In the below line , if the key that was pressed is arrow down and if that key is not yet inside in e.key array only then push it into the array .
                if (e.key === 'ArrowDown' || e.keys === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }

            });
            // In the below function , it will register the key till it is press.
            // explaining the exact code below , when we release a key if that key is arrowed down find index of that key inside this dot keys array and use splice to remove one element from that array 
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    // splice takes two arguements :- 1 . arguement index of element we want to remove and 2. how many elements starting from that index we want to remove.
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }

            });
        }
    }
    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX=0;
            this.maxFrame=8;
            this.frameX = 0;
            this.frameY = 0;
            this.fps=20;    
            this.frameTimer=0;
            this.frameInterval=1000/this.fps;
            this.speed = 0;
            this.vy=0;
            this.weight=1;
        }
        draw(context){
            context.strokeStyle='white';
            context.strokeRect(this.x,this.y,this.width,this.height);
            // context.fillStyle = 'white';
            // context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input,deltaTime) {
            // sprite animation 
            if(this.frameTimer>this.frameInterval){
                if(this.frameX>=this.maxFrame) this.frameX=0;
                else this.frameX++;
                this.frameTimer=0;  
            }else{
                this.frameTimer+=deltaTime;
            }
           
            // controls
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft')>-1) {
                this.speed = -5;
            }
              else if(input.keys.indexOf('ArrowUp')>-1 && this.onGround()){
                this.vy-=32;
              }  
             else {
                this.speed = 0;
            }
            // Horizontal movement 
            this.x += this.speed;
            // In the below if else statement ,we set boundaries for the player so that it cannot go out of width and height of the game.
            if(this.x<0) this.x=0;  
            else if(this.x>this.gameWidth-this.width) this.x=this.gameWidth-this.width;

            // vertical movement
            this.y+=this.vy;
            if(!this.onGround()){
                this.vy+=this.weight;
                this.frameY=1;
                this.maxFrame=5;
                this.frameY=1;
            }else {
                this.vy=0;
                this.maxFrame=8;
                this.frameY=0;
            }
            if(this.y>this.gameHeight-this.height) this.y=this.gameHeight-this.height
        }
        onGround(){
            return this.y>=this.gameHeight-this.height;
        }
    }
    class Background {
        constructor(gameWidth,gameHeight){
            this.gameWidth=gameWidth;
            this.gameHeight=gameHeight;
            this.image=document.getElementById('backgroundImage');
            this.x=0;
            this.y=0;
            this.width=2400;
            this.height720;
            this.speed=7;
        }
        draw(context){
            context.drawImage(this.image,this.x,this.y,this.width,this.height);
            context.drawImage(this.image,this.x+this.width-this.speed,this.y,this.width,this.height);

        }
        update(){
            this.x-=this.speed;
            if(this.x<0-this.width)this.x=0;
        }
    }
    class Enemy {
        constructor(gameWidth,gameHeight){
            this.gameWidth=gameWidth;
            this.gameHeight=gameHeight;
            this.width=160;
            this.height=119;
            this.image=document.getElementById('enemyImage');
            this.x=this.gameWidth;
            this.y=this.gameHeight-this.height;
            this.maxFrame=5;
            this.fps=20;    
            this.frameTimer=0;
            this.frameInterval=1000/this.fps;
            this.speed=8;
            this.markedForDeletion=false;
        }
        draw(context){
            context.strokeStyle='white';
            context.strokeRect(this.x,this.y,this.width,this.height);
            context.drawImage(this.image,this.frameX*this.width,0,this.width,this.height,this.x,this.y,this.width,this.height);
        }
        update(deltaTime){
           
            if(this.frameTimer>this.frameInterval){
                if(this.frameX>=this.maxFrame) this.frameX=0;
            else this.frameX++;
            this.frameTimer=0;
            }else{
                this.frameTimer+=deltaTime;
            }
            this.x-=this.speed;
            if(this.x<0-this.width){
                this.markedForDeletion=true;
                score++;
            }
        }
    }
    function handleEnemies(deltaTime) {
         if(enemyTimer>enemyInterval +randomEnemyInterval){
    enemies.push(new Enemy(canvas.width,canvas.height))
    console.log(enemies);
    randomEnemyInterval=Math.random()*1000+500;
            enemyTimer=0;
        }else{
            enemyTimer+=deltaTime;
        }
        enemies.forEach(enemy=>{
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });
        enemies =enemies.filter(enemy=> !enemy.markedForDeletion);
    }
    function displayStatusText(context) {
        context.font='40px Helvectica';
        context.fillStyle='black';
        context.fillText('Score: '+score,20,50);
        context.fillStyle='white';
        context.fillText('Score: '+score,20,52);
    }
    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background= new Background(canvas.width,canvas.height);
    
    let lastTime=0;
    let enemyTimer=0;
    let enemyInterval=2000;
    let randomEnemyInterval=Math.random()*1000+500;
    function animate(timeStamp) {
        const deltaTime=timeStamp-lastTime;
        lastTime=timeStamp;     
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        // background.update();
        player.draw(ctx);
        player.update(input,deltaTime);
        handleEnemies(deltaTime);     
        displayStatusText(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});
