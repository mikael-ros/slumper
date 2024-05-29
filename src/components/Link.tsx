import "./Link.css";

import { createSignal, createEffect, For, onMount, Show, onCleanup } from "solid-js";

import { Notification } from "./ui/Notification.tsx";


export function Link(props){
    const {href, text, src, clipboard} = props;
    const [copied, setCopied] = createSignal(false);

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(href);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
      
    const handleClick = () => {
        if (clipboard){
            copyToClipboard();
            setCopied(true);
        }
    }
    
    return (
        <div class={clipboard ? "link-container clipboard" : "link-container"}>
            <a class="link" href={clipboard ? null : href} onclick={handleClick}>
                <p>{text}</p>
                <img src={src} />
            </a>
            <Notification owner={this} condition={copied} setCondition={setCopied} message="Link copied to clipboard" relative={false}/>
        </div>
    )
}