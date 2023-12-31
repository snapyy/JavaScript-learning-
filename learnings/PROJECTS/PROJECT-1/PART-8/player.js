// JavaScript Modules :- allow us to split our program into seprate parts that can be imported where they are needed use of native JavaScript modules is dependent on the import and export statements.

// member of these Modules :- (=classes,functions,variable) can be exported and imported around our program , wherever they are needed . 

// Importing multiple classes

import {StandingLeft,StandingRight,SittingLeft,SittingRight,RunningLeft,RunningRight,JumpingLeft,JumpingRight,FallingLeft,FallingRight} from "./state.js";

// Encapsulation :- Means we wrap variables or data and functions that operate on that data into objects. ENCAPSULATION can be used to protect our data from unwanted outside access , it simplifies maintainance of our code by keeping it orgainised and easier to understand.
export default class Player{
    constructor(gameWidth,gameHeight){
        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight; 
        this.states=[new StandingLeft(this),new StandingRight(this),new SittingLeft(this), new SittingRight(this), new RunningLeft(this),new RunningRight(this),new JumpingLeft(this),new JumpingRight(this),new FallingLeft(this),new FallingRight(this)];
        this.currentState=this.states[1];
        this.image=document.getElementById("dogImage");
        this.width=200;
        this.height=181.83;
        this.x=this.gameWidth/2-this.width/2;
        this.y=this.gameHeight-this.height;
        this.vy=0;
        this.weight=1;
        this.frameX=0;
        this.frameY=0;
        this.maxFrame=6;
        this.speed=0;
        this.maxSpeed=10;
        this.fps=200;
        this.frameTimer=0;
        this.frameInterval=1000/this.fps;
    }
    draw(context,deltaTime){
        if(this.frameTimer>this.frameInterval){
            if(this.frameX<this.maxFrame)this.frameX++;
            else this.frameX=0;
            this.frameTimer=0;
        } else{
            this.frameTimer+=deltaTime;
        }
        context.drawImage(this.image,this.width*this.frameX,this.height*this.frameY,this.width,this.height,this.x,this.y,this.width,this.height);
    }
    update(input){
        this.currentState.handleInput(input);
        // Horizontal movement
        this.x+=this.speed;
        if(this.x<=0)this.x=0;
        else if(this.x>=this.gameWidth-this.width) this.x=this.gameWidth-this.width;
        // vertical movement
        this.y+=this.vy;
        if(!this.onGround()){
            this.vy+=this.weight;
        }else{
            this.vy=0;
        }
        if(this.y>this.gameHeight-this.height)this.y=this.gameHeight-this.height;
    }
    setState(state){
        this.currentState=this.states[state];
        this.currentState.enter();
    }
    onGround(){
        return this.y>=this.gameHeight-this.height
    }
}
