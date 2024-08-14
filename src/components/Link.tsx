import { createSignal } from "solid-js";
import "./Link.css";

import { Notification } from "./ui/Notification.tsx";

interface LinkProps {
    href: string;
    text: string;
    src: string;
    alt: string;
    clipboard?: boolean; // False by default
    newtab: boolean;
}

export function Link({href, text, src, alt, clipboard = false, newtab}: LinkProps){
    const [copyTrigger, setCopyTrigger] = createSignal(false); // Acts as the trigger for the notification
    
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(href);
            
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
      
    const copy = () => {
        // Only do something if clipboarding is enabled
        copyToClipboard();
        setCopyTrigger(!copyTrigger());
    }
    
    return (
        <div class="link-container" data-clipboard={clipboard}>
            <a class="link" href={clipboard ? undefined : href} onclick={clipboard ? copy : undefined} target={(newtab && !clipboard) ? "_blank" : "_self"}>
                <p>{text}</p>
                <img src={src} alt={alt}/>
            </a>
            <Notification trigger={copyTrigger} message="Link copied to clipboard" relative={false}/>
        </div>
    )
}