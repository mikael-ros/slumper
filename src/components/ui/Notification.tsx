
import "./Notification.css";

import { createSignal, createEffect, For, onMount, Show, onCleanup } from "solid-js";


export function Notification(props){
    const {owner, condition, setCondition, message, duration, relative} = props;
    const _duration = duration == null ? 4000 : duration;
    const _relative = relative == null ? false : relative;

    const [alive, setAlive] = createSignal(false);

    var delay = setTimeout(() => {
        setAlive(false);
        setCondition(false);
    }, _duration);

    createEffect(() => {
        clearTimeout(delay);
        setAlive(condition)
        delay = setTimeout(() => {
            setAlive(false);
            setCondition(false);
        }, _duration);
        return () => clearTimeout(delay);
    });

    
    return (
        <Show when={alive()}>
            <figure class="notification">
                <p>{message}</p>
            </figure>
        </Show>
        
    )
}