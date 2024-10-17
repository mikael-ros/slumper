import "./VolumeKnob.css";

import knobIcon from "/src/assets/volume-knob-nodot.svg";
import knobDot from "/src/assets/volume-knob-onlydot.svg";

import { createEffect, createSignal } from "solid-js";

import {getSetOrElse,set} from "../../scripts/StorageHandler";

export function VolumeKnob(){
    const volumeStep = 0.01; // 1%, the amount each step should equate to
    var preMuteVolume = getSetOrElse("volume", 1.0); // The volume prior to muting

    const [open, setOpen] = createSignal(false);
    const [volume, setVolume] = createSignal(parseFloat(getSetOrElse("volume", 1.0).toFixed(2)));
    
    const [isDragging, setIsDragging] = createSignal(false);

    const [displayedVolume, setDisplayedVolume] = createSignal(volume()*100); // The "readable" version of the volume (the decimal to percentage conversion)
    createEffect(() => {setDisplayedVolume(volume()*100)}); // Update displayed volume on volume change

    function changeVolume(newVolume : number){
        const _newVolume = parseFloat(Math.max(Math.min(1.0,newVolume), 0).toFixed(2)); // Prevents the volume going above 1 or below 0. toFixed rounds the volume to 2 decimal places, and returns a string hence parseFloat
        set("volume", _newVolume);
        setVolume(_newVolume);
    }

    const handleKnob = () => setOpen(!open());

    const handleMouseDown = (event : MouseEvent & {currentTarget : HTMLElement; target: Element;}) => {
        setIsDragging(true);
        handleSliderClick(event); // Set volume immediately on mousedown
    };

    const handleSliderClick = (event : MouseEvent & {currentTarget : HTMLElement; target: Element;}) => {
        const slider = event.currentTarget;
        const rect = slider.getBoundingClientRect();
        const clickY = event.clientY - rect.top; // Position relative to slider top
        const newVolume = 1 - (clickY / rect.height); // Calculate new volume
        changeVolume(newVolume);
    };

    const handleMouseMove = (event : MouseEvent & {currentTarget : HTMLElement; target: Element;}) => {
        if (isDragging()) {
            handleSliderClick(event);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleKeyPress = (event : KeyboardEvent) => {
        const target = event.target as HTMLElement; // Assert the target as a HTML element
        const key = event.key.toLowerCase();
        if (target.tagName.toUpperCase() !== "INPUT" && target.tagName.toUpperCase() !== "SELECT") { // If we are not modifying an input or select, and not tab navigating something else, proceed.
            var open = true; // Whether it should be opened after
            switch (key) {
                case "w":
                case "arrowup": 
                case "+": // Increase volume
                    changeVolume(volume()+volumeStep);
                    break;
                case "s":
                case "arrowdown":
                case "-": // Decrease volume
                    changeVolume(volume()-volumeStep);
                    break;
                case "m":
                case "0":
                    const newVolume = volume() == 0.0 ? preMuteVolume : 0.0; 
                    preMuteVolume = volume() != 0.0 ? volume() : preMuteVolume; // Only change if not already muted
                    changeVolume(newVolume); // Mute volume
                    break;
                case "x":
                case "escape": // Exit the dialogue
                    setOpen(false);
                    break;
                default:
                    const volumeCandidate = parseFloat(key); // Try to parse as a number (number keys)
                    if (!Number.isNaN(volumeCandidate)) { // If it is a number, try to use it
                        changeVolume(volumeCandidate/10);
                    } else {
                        open = false;
                    }
                    break;
            }
            setOpen(open); 
        }
    }

    document.addEventListener("keydown", handleKeyPress);
 
    return (
        <div class="volume-knob" onmouseleave={() => setOpen(false)} >
            <figure role="meter" id="volume-slider" class="volume-slider" 
                onclick={handleSliderClick} 
                onmousemove={handleMouseMove} 
                onmousedown={handleMouseDown} 
                onmouseup={handleMouseUp}
                aria-label="Volume slider"
                aria-valuenow={volume()}
                aria-valuetext={(displayedVolume()).toString().split(".")[0]}
                aria-valuemin="0"
                aria-valuemax="100"
                data-open={open()}>
                    <figure id="slider" style={"--height: " + displayedVolume()}></figure>
                    <p>{(displayedVolume()).toString().split(".")[0]}</p>
                </figure>
            <button class="knob icon-only interactive" onclick={handleKnob} onkeypress={handleKeyPress} aria-label="Toggle volume slider" aria-controls="volume-slider" title="Open/close volume slider">
                <img id="only-dot" src={knobDot.src} alt="The dot of a volume knob"/>
                <img id="no-dot" src={knobIcon.src} alt="The wheel of a volume knob"/>
            </button>
        </div>
    )
}