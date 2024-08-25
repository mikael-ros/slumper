
import "./Notification.css";

import {createSignal, createEffect, onCleanup, Show, type Accessor, on} from "solid-js";

interface NotificationProps {
    trigger: Accessor<any>; // The trigger signal, most aptly a boolean but it does not matter
    duration?: number; // How long until despawn (ms). Optional, default is 4000 ms.
    message: string;   // The content of the notification bubble
    relative?: boolean; // Wheter to position relatively. True by default
}

export function Notification({trigger, duration = 4000, message, relative = true}: NotificationProps){
    const [alive, setAlive] = createSignal(false);

    var delay = setTimeout(() => {
        setAlive(false);
    }, duration);

    createEffect(on(trigger, () => { // Trigger upon any change in the trigger signal
        clearTimeout(delay); // Kill any prior delay
        setAlive(true);
        
        onCleanup(() => clearTimeout(delay)); // Kill the delay after
    }, { defer: true })); // Defer ignores the first load effect
    
    return (
        <Show when={alive()}>
            <figure class="notification" aria-label="Notification" data-relative={relative}>
                <p>{message}</p>
            </figure>
        </Show>
    )
}