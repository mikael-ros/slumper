import "./VolumeKnob.css";

import knobIcon from "/src/assets/volume-knob-nodot.svg";
import knobDot from "/src/assets/volume-knob-onlydot.svg";

import { createSignal } from "solid-js";

import {getSetOrElse,set} from "../../scripts/StorageHandler.ts";

export function VolumeKnob(){
    const volumeStep = 0.01; // 1%
    var preMuteVolume = getSetOrElse("volume", 1.0); // The volume prior to muting

    const [open, setOpen] = createSignal(false);
    const [volume, setVolume] = createSignal(getSetOrElse("volume", 1.0));
    const [isDragging, setIsDragging] = createSignal(false);

    function changeVolume(newVolume : number){
        const _newVolume = Math.max(Math.min(1.0,newVolume), 0); // Prevents the volume going above 1 or below 0
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
        var clickY = event.clientY - rect.top; // Position relative to slider top
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

    const handleKeyPress = (event : KeyboardEvent & {currentTarget : HTMLElement; target: Element;}) => {
        if (event.target.tagName.toUpperCase() !== "INPUT") { // If we are not modifying an input, proceed.
            setOpen(true);
            const key = event.key.toLowerCase();
            switch (key) {
                case "w" || "arrowup" || "+": // Increase volume
                    changeVolume(volume()+volumeStep);
                    break;
                case "s" || "arrowdown" || "-": // Decrease volume
                    changeVolume(volume()-volumeStep);
                    break;
                case "m" || "0":
                    const newVolume = volume() == 0.0 ? preMuteVolume : 0.0; 
                    preMuteVolume = volume() != 0.0 ? volume() : preMuteVolume; // Only change if not already muted
                    changeVolume(newVolume); // Mute volume
                    break;
                case "x" || "escape": // Exit the dialogue
                    setOpen(false);
                    break;
                default:
                    const volumeCandidate = parseFloat(key); // Try to parse as a number (number keys)
                    if (!Number.isNaN(volumeCandidate)) { // If it is a number, try to use it
                        changeVolume(volumeCandidate/10);
                    }
                    break;
            }
        }
    }

    window.onkeypress = handleKeyPress; // Also adds a window listener to let user use the keybinds anywhere on the site, when this component is loaded.

 
    return (
        <div class="volume-knob" onmouseleave={() => setOpen(false)} >
            <figure class={`volume-slider ${open() ? 'open' : 'closed'}`} 
                onclick={handleSliderClick} 
                onmousemove={handleMouseMove} 
                onmousedown={handleMouseDown} 
                onmouseup={handleMouseUp}>
                    <figure id="slider" style={"height: " + (volume()*100) + "%"}></figure>
                    <p>{(volume()*100).toString().split(".")[0]}</p>
                </figure>
            <button class="knob" onclick={handleKnob} onkeypress={handleKeyPress}>
                <img id="only-dot" src={knobDot.src} alt="The dot of a volume knob"/>
                <img id="no-dot" src={knobIcon.src} alt="The wheel of a volume knob"/>
            </button>
        </div>
    )
}