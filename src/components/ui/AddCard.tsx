import { createSignal, For, onMount, Show } from "solid-js";
import { Randomizer} from "../../scripts/Randomizer.ts";

import type {Book, Chapter, Task} from "../../scripts/Books.ts";
import {library, dummyChapter, dummyTask, getBook} from "../../scripts/Books.ts";
import {getSetOrElse, set} from "../../scripts/StorageHandler.ts";

import {ChapterInput} from "../ChapterInput.tsx";

export function AddCard(){
    const [chapters, setChapters] = createSignal(1);

    return (
        <div class="card add">
            <a href="/"><button aria-label="back" id="import"><img src="/src/assets/home.svg" /><p>Back</p></button></a>
            <h1>Add book</h1>

            <div id="book-params">
                <input placeholder="Book name" required></input>
                <input placeholder="Book image url"></input>
            </div>
            

            <div id="chapter-inputs">
                <button aria-label="add" class="add" onclick={event => setChapters(chapters() + 1)}><img src="/src/assets/plus.svg" /><p>Add entry</p></button>
                <For each={[...Array(chapters()).keys()]}>
                    {chapter => <ChapterInput></ChapterInput>}
                </For>
            </div>
            

            <div id="buttons">
                <button aria-label="done" id="done"><img src="/src/assets/tick.svg" /><p>Save</p></button>
                <button aria-label="export" id="export"><img src="/src/assets/download.svg" /><p>Export</p></button>
                <button aria-label="import" id="import"><img src="/src/assets/upload.svg" /><p>Import</p></button>
            </div>
            
			
		</div>
    )
}