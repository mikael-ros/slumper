import { createSignal, createEffect, For, onMount, Show, onCleanup } from "solid-js";
import timerSound from "../../assets/timer-sound.wav";

class Time {
    time: number;
    interval: any;
    sound: any;

    constructor (time: number){
        this.time = time % 3600; // Makes sure time can never be above an hour. Might need to change this in the future
        this.sound = new Audio(timerSound);
        this.sound.volume = 0.05;
        this.tickLoop();
    }

    setVolume(volume : number){
        this.sound.volume = volume;
    }

    lapsed() : Boolean {
        return this.time == 0;
    }

    tickLoop(){
        window.clearInterval(this.interval);
        this.interval = window.setInterval(() => {
            if (!this.lapsed()){
                this.tick()
            } else {
                this.tick();
                this.kill(true); 
            }}, 1000);
    }

    tick(){
        this.time -= 1;
    }

    minutes() : number {
        return Math.round((this.time - this.seconds())/ 60);
    }

    seconds() : number {
        return this.time % 60;
    }

    formatTime(time: number) : string {
        return time < 10 ? "0" + time : time.toString();
    }

    toString() : string{
        return this.formatTime(this.minutes()) + ":" + this.formatTime(this.seconds());
    }

    kill(play: boolean){
        if (play){
            this.sound.play();
        }
        window.clearInterval(this.interval);
    }
}

export function Timer(props){
    var timer = new Time(props.time);
    const [time, setTime] = createSignal(timer.toString());

    let interval = setInterval(() => update(), 1000);

    function update(){
        if (!timer.lapsed()){
            setTime(timer.toString())
        } else {
            setTime(timer.toString())
            clearInterval(interval)
            timer.kill(true);
        }
    }

    createEffect(() => {
        timer.kill(false);
        clearInterval(interval);
        timer = new Time(props.time);
        
        interval = setInterval(() => update(), 1000);
    });

    onCleanup(() => {
        clearInterval(interval); 
        timer.kill(false)
    }); // Kill the code when its unmounted

    return (
        <h1 style="text-align: center; margin: 0 0 0 0;">{time()}</h1>
    )
}