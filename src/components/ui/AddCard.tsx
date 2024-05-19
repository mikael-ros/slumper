import { createSignal, For, onMount, Show } from "solid-js";
import { Randomizer} from "../../scripts/Randomizer.ts";

import type {Book, Chapter, Task} from "../../scripts/Books.ts";
import {library, dummyChapter, dummyTask, getBook} from "../../scripts/Books.ts";
import {getSetOrElse, set} from "../../scripts/StorageHandler.ts";

export function AddCard(){
    const input : Map<string, number> = new Map<string, number>();
    const [chapters, setChapters] = createSignal(1);
    const [completed, setCompleted] = createSignal(false);

    function warn(valid: boolean, event){
        event.target.style.color = valid ? "var(--text-color-negative)" : "red";
    }

    function handleInput(event){
        setCompleted(false);
        const number = event.target.value.length > 0 ? parseInt(event.target.value) : 1; 
        const valid = !Number.isNaN(number) && number > 0;
        warn(valid, event);
    }

    return (
        <div class="card add">
            <a href="/"><button aria-label="back" id="import"><img src="/src/assets/home.svg" /><p>Back</p></button></a>
            <h1>Add book</h1>

            <div id="book-params">
                <input placeholder="Book name*" oninput={event => warn(event.target.value.length > 0, event)} required></input>
                <input placeholder="Book image URL (optional)"></input>
            </div>
            

            <div id="chapter-inputs">
                <button aria-label="add" class="add" onclick={event => setChapters(chapters() + 1)}><img src="/src/assets/plus.svg" /><p>Add entry</p></button>
                <ol>
                    <For each={[...Array(chapters()).keys()]}>
                        {chapter => 
                        <li class="chapter-input">
                            <p>{chapter + 1}</p>
                            <input placeholder="Chapter title*" oninput={event => warn(event.target.value.length > 0, event)} required />
                            <input placeholder="# of tasks*" onchange={event => handleInput(event)}
                            oninput={event => handleInput(event)} required/>
                        </li>
                        }
                    </For>
                </ol>
            </div>
            

            <div id="buttons">
                <button aria-label="done" id="done"><img src="/src/assets/tick.svg" /><p>Save</p></button>
                <button aria-label="export" id="export"><img src="/src/assets/download.svg" /><p>Export</p></button>
                <button aria-label="import" id="import"><img src="/src/assets/upload.svg" /><p>Import</p></button>
            </div>
            
			
		</div>
    )
}