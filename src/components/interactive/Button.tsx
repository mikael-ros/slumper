import { For, Show, type Component } from "solid-js";

interface ButtonProps {
    class?: string;
    id?: string;
    label?: string;
    title?: string;
    text?: string;
    disabled?: boolean;
    onclick?: any;
    onkeydown?: any;
    type?: "submit" | "reset" | "button";

    icons?: [ImageMetadata, string][];
    iconOnly?: boolean;

    tabIndex?: number;
}

const Button: Component<ButtonProps> = (props: ButtonProps) => {
    return (
        <button class={"interactive interactive--heavy button " + (props.iconOnly ? "icon-only " : "") + (props.class ?? "")} id={props.id ?? ""} aria-label={props.label}
        onclick={props.onclick} onkeydown={props.onkeydown}
        disabled={props.disabled}
        title={props.title ? props.title : props.label}
        tabIndex={props.tabIndex}
        type={props.type}>
            <For each={props.icons}>
                {entry =>
                    <img src={entry[0].src} alt={entry[1]}></img>
                }
            </For>
            <Show when={props.text}>
                <p>{props.text}</p>
            </Show>
        </button>
    );
}

export default Button;