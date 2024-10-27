import "./Timer.css";
import { createSignal, createEffect, onCleanup, Show, type Accessor, type Setter, on } from "solid-js";
import timerSound from "../../assets/timer-sound.wav";
import timerIcon from "/src/assets/timer.svg";
import {getSetOrElse} from "../../scripts/StorageHandler.ts";
import  {isValid} from "../../scripts/Utils.ts";

/**
 * A class for handling time. Created to minimize unnecessary imports. All we want is a simply max 1 hr timer, so this suffices.
 */
class Time {
    initTime: number;
    time: number;
    interval: any;
    sound: any;
    timeDisplay: Setter<string>; // We'll use a signal to display the time, as this is the easiest imo

    constructor (time: number, timeDisplay: Setter<string>){
        this.timeDisplay = timeDisplay;
        this.initTime = time % 3601; // Makes sure time can never be above an hour. Might need to change this in the future
        this.time = this.initTime;
        this.sound = new Audio(timerSound);
        this.sound.volume = getSetOrElse("volume", 1.0);
        this.timeDisplay(this.toString());
        this.interval = null;
    }

    start(){
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

    /**
     * Sets a new time for the router and handles the necessary logic to do such
     */
    setTime(time: number){
        this.initTime = time % 3601; // Makes sure time can never be above an hour. Might need to change this in the future
        this.time = this.initTime;
        this.kill(false);
        this.timeDisplay(this.toString());
        this.start();
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
        window.clearInterval(this.interval); // Important to avoid concurrent intervals
    }
}

interface TimerProps {
    closeOn: Accessor<boolean>;
    refreshOn: Accessor<any>; // What should trigger a reset of the timer
}

export function Timer(props: TimerProps){
    var startTimer = 180;
    const title = document.title; // Save the original document title

    const [displayTimer, setDisplayTimer] = createSignal(false);
    const [time, setTime] = createSignal("00:00");
    const [elapsed, setElapsed] = createSignal(false);

    var timer : Time = new Time(startTimer, setTime);

    const valid = (number: number) => !Number.isNaN(number) && number > 0 && number <= 3600; // The conditions under which a number is valid in this component

    function handleChange(event : Event & {currentTarget : HTMLInputElement}){
        const number = event.currentTarget.value.length != 0 ? parseInt(event.currentTarget.value) : startTimer; 
        
        if (isValid(number, valid) && number != startTimer){ // Only set a number if it is non negative and actually a number, and if it is actually changed
            timer.setTime(startTimer = number);
            setElapsed(false);
        }
    }

    /**
     * Resets the timer to the set time
     * and sets the title to the default again
     */
    function reset() {
        timer.reset()
        setElapsed(false);
        document.title = title;
    }

    /**
     * Kills the timer, and sets the title to default again
     */
    function kill() {
        timer.kill(false);
        document.title = title;
    }
    
    /**
     * Starts the timer
     */
    function init() {
        timer.setTime(startTimer);
        setElapsed(false);
    }

    createEffect(() => {
        setElapsed(timer.lapsed());
        document.title = title + " :: " + (!elapsed() ? time() : "DING!")
    }); // Updates the text in the title of the page to represent the remaining time

    createEffect(on(props.refreshOn, () => { // Trigger upon any change in the refresh signal
        if (displayTimer())
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
        <div class ="card small timer" data-elapsed={elapsed()} data-open={displayTimer() && !props.closeOn()}>
            <div id="timer-display" class="timer__display" >
                <Show when={displayTimer() && !props.closeOn()}>
                    <h2 role="timer" class="timer__display__text" data-elapsed={elapsed()} aria-live={elapsed() ? "assertive" : "off"} aria-atomic="true">{time()}</h2>
                </Show>
            </div>
            <div class="interactive-group timer__config">
                <button class="interactive interactive--heavy interactive--triple-width button" aria-label="Toggle timer" aria-controls="timer-display" id="toggle" onclick={() => setDisplayTimer(!displayTimer())} disabled={props.closeOn()}><img src={timerIcon.src} alt="Timer icon"/><p>Timer</p></button>
                <div class="interactive-group" id="timer__config__input-wrapper" style={"--interactive-width:" + (displayTimer() && !props.closeOn() ? "3em" : "0")}>
                    <input class="interactive interactive--input" id="timer__config__input" type="number" min="1" max="3600" inputmode="numeric" pattern="[0-9]*" 
                    placeholder={startTimer.toString()} 
                    onchange={handleChange} 
                    aria-required="false"/><p>seconds</p>
                </div>
                
            </div>
        </div>
    )
}