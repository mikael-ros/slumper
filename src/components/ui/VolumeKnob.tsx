import "./VolumeKnob.css";

import { createSignal, createEffect, For, onMount, Show, onCleanup } from "solid-js";

import {getSetOrElse,set} from "../../scripts/StorageHandler.ts";

export function VolumeKnob(){
    const [open, setOpen] = createSignal(false);
    const [volume, setVolume] = createSignal(getSetOrElse("volume", 1.0));
    const [isDragging, setIsDragging] = createSignal(false);

    function changeVolume(newVolume : number){
        const _newVolume = Math.max(Math.min(1.0,newVolume), 0); // Prevents the volume going above 1 or below 0
        set("volume", _newVolume);
        setVolume(_newVolume);
    }

    const handleKnob = () => setOpen(!open());

    const handleMouseDown = (event) => {
        setIsDragging(true);
        handleSliderClick(event); // Set volume immediately on mousedown
    };

    const handleSliderClick = (event) => {
        const slider = event.currentTarget;
        const rect = slider.getBoundingClientRect();
        var clickY = event.clientY - rect.top; // Position relative to slider top
        const newVolume = 1 - (clickY / rect.height); // Calculate new volume
        changeVolume(newVolume);
    };

    const handleMouseMove = (event) => {
        if (isDragging()) {
            handleSliderClick(event);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

 
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
            <button class="knob" onclick={handleKnob}>
                <img id="only-dot" src="/src/assets/volume-knob-onlydot.svg"/>
                <img id="no-dot" src="/src/assets/volume-knob-nodot.svg"/>
            </button>
        </div>
    )
}