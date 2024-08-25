import "./Timer.css";
import { createSignal, createEffect, onCleanup, Show, type Accessor, type Setter, on } from "solid-js";
import timerSound from "../../assets/timer-sound.wav";
import timerIcon from "/src/assets/timer.svg";
import {getSetOrElse} from "../../scripts/StorageHandler.ts";

/**
 * A class for handling time. Created to minimize unnecessary imports. All we want is a simply max 1 hr timer, so this suffices.
 */
class Time {
    initTime: number;
    time: number;
    interval: any;
    sound: any;
    timeDisplay: Setter<string>;

    constructor (time: number, timeDisplay: Setter<string>){
        this.timeDisplay = timeDisplay;
        this.initTime = time % 3601; // Makes sure time can never be above an hour. Might need to change this in the future
        this.time = this.initTime;
        this.sound = new Audio(timerSound);
        this.sound.volume = getSetOrElse("volume", 1.0);
        this.interval = window.setInterval(() => {
            if (!this.lapsed()){
                this.tick()
            } else {
                this.kill(true); 
            }}, 1000);
    }

    setVolume(volume : number){
        this.sound.volume = volume;
    }

    lapsed() : boolean {
        return this.time == 0;
    }

    tick(){
        this.time -= 1; 
        this.timeDisplay(this.toString());
    }

    setTime(time: number){
        this.initTime = time % 3601; // Makes sure time can never be above an hour. Might need to change this in the future
        this.time = this.initTime;
        this.kill(false);
        this.interval = window.setInterval(() => {
            if (!this.lapsed()){
                this.tick()
            } else {
                this.kill(true); 
            }}, 1000);
    }

    reset(){
        this.setTime(this.initTime);
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
    static formatTime(time: number) : string {
        return time < 10 ? "0" + time : time.toString();
    }

    toString() : string{
        return Time.formatTime(this.minutes()) + ":" + Time.formatTime(this.seconds());
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
    closeOn: Accessor<boolean>;
    refreshOn: Accessor<any>; // What should trigger a reset of the timer
}

export function Timer(props: TimerProps){
    var startTimer = 180;
    const [displayTimer, setDisplayTimer] = createSignal(true);

    const [time, setTime] = createSignal("");
    var timer : Time = new Time(startTimer, setTime);
    const [elapsed, setElapsed] = createSignal(false);
    const title = document.title;

    function warn(valid: boolean, event : Event & {currentTarget : HTMLInputElement}){
        event.currentTarget.style.color = valid ? "var(--text-color-negative)" : "red";
    }

    function handleInput(event : Event & {currentTarget : HTMLInputElement}){
        const number = event.currentTarget.value.length != 0 ? parseInt(event.currentTarget.value) : startTimer; 
        const valid = !Number.isNaN(number) && number > 0 && number <= 3600;
        warn(valid, event);
    }

    function handleChange(event : Event & {currentTarget : HTMLInputElement}){
        const number = event.currentTarget.value.length != 0 ? parseInt(event.currentTarget.value) : startTimer; // Makes sure empty input is handled correctly
        const valid = !Number.isNaN(number) && number > 0 && number <= 3600;
        
        if (valid && number != startTimer){ // Only set a number if it is non negative and actually a number, and if it is actually changed
            startTimer = number;
            timer.setTime(startTimer);
        }
        warn(valid, event);
    }

    function reset() {
        timer.reset()
        setElapsed(false);
        document.title = title;
    }

    function kill() {
        timer.kill(false);
        document.title = title;
    }
    
    function init() {
        timer.setTime(startTimer);
        setElapsed(false);
    }

    createEffect(() => {
        setElapsed(timer.lapsed());
        document.title = title + " :: " + (!elapsed() ? time() : "DING!")
    }); // Updates the text in the title of the page to represent the remaining time

    createEffect(on(props.refreshOn, () => { // Trigger upon any change in the refresh signal
        reset();
    }, { defer: true }))

    createEffect(() => { // Trigger when closed
        if (!displayTimer())
            kill()
        else
            init()
    })

    onCleanup(() => {
        kill();
    }); // Kill the timer when its unmounted

    return (
        <div class ="card small" id="timer">
            <div id="timer-display" data-open={displayTimer() && !props.closeOn()}>
                <Show when={displayTimer() && !props.closeOn()}>
                    <h1 class="timer" data-elapsed={elapsed()} aria-live={elapsed() ? "assertive" : "off"} aria-atomic="true">{time()}</h1>
                </Show>
            </div>
            <div id="timer-config">
                <button data-open={displayTimer() && !props.closeOn()} aria-label="Toggle timer" aria-controls="timer-display" id="toggle" onclick={() => setDisplayTimer(!displayTimer())} disabled={props.closeOn()}><img src={timerIcon.src} alt="Timer icon"/><p>Timer</p></button>
                <Show when={displayTimer() && !props.closeOn()}>
                    <input type="text" inputmode="numeric" pattern="[0-9]*" placeholder={startTimer.toString()} 
                    onchange={handleChange} 
                    oninput={handleInput}
                    aria-required="false"/><p>seconds</p>
                </Show>
            </div>
        </div>
    )
}