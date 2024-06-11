
import "./Notification.css";

import {createSignal, createEffect, Show} from "solid-js";


export function Notification(props: any){
    const {condition, setCondition, message, duration} = props;
    const _duration = duration == null ? 4000 : duration;

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
            <figure class="notification" aria-label="Notification">
                <p>{message}</p>
            </figure>
        </Show>
        
    )
}