import { createSignal, For, onMount, Show } from "solid-js";
import { Randomizer} from "../../scripts/Randomizer.ts";

import type {Book, Chapter, Task} from "../../scripts/Books.ts";
import {library, dummyChapter, dummyTask, getBook} from "../../scripts/Books.ts";
import {getSetOrElse, set} from "../../scripts/StorageHandler.ts";

import {ChapterInput} from "../ChapterInput.tsx";

export function AddCard(){

    return (
        <div class="card">
            <h1>Add book</h1>

            <div id="book-params">
                <input placeholder="Book name"></input>
                <input placeholder="Book image url"></input>
            </div>
            

            <div id="chapter-inputs">
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
                <ChapterInput></ChapterInput>
            </div>
            

            <div id="buttons">
                <button aria-label="done" id="done"><img src="/src/assets/tick.svg" /><p>Save</p></button>
                <button aria-label="export" id="export"><img src="/src/assets/download.svg" /><p>Export</p></button>
                <button aria-label="import" id="import"><img src="/src/assets/upload.svg" /><p>Import</p></button>
            </div>
            
			
		</div>
    )
}