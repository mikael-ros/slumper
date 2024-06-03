import "./Link.css";

import { createSignal } from "solid-js";

import { Notification } from "./ui/Notification.tsx";


export function Link(props: any){
    const {href, text, src, clipboard, newtab} = props;
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
            <a class="link" href={clipboard ? null : href} onclick={handleClick} target={(newtab && !clipboard) ? "_blank" : "_self"}>
                <p>{text}</p>
                <img src={src} />
            </a>
            <Notification condition={copied} setCondition={setCopied} message="Link copied to clipboard" relative={false}/>
        </div>
    )
}