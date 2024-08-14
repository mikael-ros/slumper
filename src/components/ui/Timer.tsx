import "./Timer.css";
import { createSignal, createEffect, onCleanup } from "solid-js";
import timerSound from "../../assets/timer-sound.wav";
import {getSetOrElse} from "../../scripts/StorageHandler.ts";

/**
 * A class for handling time. Created to minimize unnecessary imports. All we want is a simply max 1 hr timer, so this suffices.
 */
class Time {
    time: number;
    interval: any;
    sound: any;

    constructor (time: number){
        this.time = time % 3601; // Makes sure time can never be above an hour. Might need to change this in the future
        this.sound = new Audio(timerSound);
        this.sound.volume = getSetOrElse("volume", 1.0);
        this.tickLoop();
    }

    setVolume(volume : number){
        this.sound.volume = volume;
    }

    lapsed() : Boolean {
        return this.time == 0;
    }

    /** Ticks the timer variable down every 1000 ms */
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

    /**
     * Formats the time
     * @param time The time being formated
     * @returns A string representation of the time
     */
    formatTime(time: number) : string {
        return time < 10 ? "0" + time : time.toString();
    }

    toString() : string{
        return this.formatTime(this.minutes()) + ":" + this.formatTime(this.seconds());
    }

    kill(play: boolean){
        if (play){
            this.sound.volume = getSetOrElse("volume", 1.0); // Updates the volume to current level. Would ideally be handled by a context provider, but I couldn't figure it out
            this.sound.play();
        }
        window.clearInterval(this.interval);
    }
}

interface TimerProps {
    time: number;
}

export function Timer(props: TimerProps){
    var timer = new Time(props.time);
    const [time, setTime] = createSignal(timer.toString());
    const [elapsed, setElapsed] = createSignal(false);
    const title = document.title;

    let interval = setInterval(() => update(), 1000);

    function update(){
        if (!timer.lapsed()){
            setTime(timer.toString())
        } else {
            setTime(timer.toString())
            clearInterval(interval)
            timer.kill(true);
            setElapsed(true);
            document.title = title + " :: " + "DING!";
        }
    }

    createEffect(() => document.title = title + " :: " + time()); // Updates the text in the title of the page to represent the remaining time

    createEffect(() => {
        timer.kill(false);
        clearInterval(interval);
        timer = new Time(props.time);
        setElapsed(false);
        
        interval = setInterval(() => update(), 1000);
    });

    onCleanup(() => {
        clearInterval(interval); 
        timer.kill(false);
        document.title = title;
    }); // Kill the code when its unmounted

    return (
        <h1 class="timer" data-elapsed={elapsed()} aria-live={elapsed() ? "assertive" : "off"} aria-atomic="true">{time()}</h1>
    )
}