import { createSignal, createEffect, For, onMount, Show } from "solid-js";
import timerSound from "../../assets/timer.wav";

class Time {
    time: number;
    interval: any;
    sound: any;

    constructor (time: number){
        this.time = time;
        this.tickLoop();
        this.sound = new Audio(timerSound);
    }

    setTime(time: number){
        window.clearInterval(this.interval);
        this.time = time;
        this.tickLoop();
    }

    lapsed() : Boolean {
        return this.time == -1;
    }

    tickLoop(){
        this.interval = window.setInterval(() => {if (!this.lapsed()){
            this.tick()} else {window.clearInterval(this.interval); this.sound.play()}}, 1000);
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
}

export function Timer(props){
    const [timer, setTimer] = createSignal(new Time(props.time));
    const [time, setTime] = createSignal(timer().toString());

    var interval = window.setInterval(() => update(), 1000);

    function update(){
        if (!timer().lapsed()){
            setTime(timer().toString())
        } else {
            window.clearInterval(interval)
        }
    }

    createEffect(() => {
        setTimer(new Time(props.time));
        clearInterval(interval);
        interval = window.setInterval(() => update(), 1000);
    });

    

    return (
        <div class="card small timer">
            <h1 style="text-align: center; margin: .35em;">{time()}</h1>
        </div>
    )
}