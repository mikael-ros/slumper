import { createSignal, For, onMount, Show } from "solid-js";

import type {Book, Chapter, Task} from "../../scripts/Books.ts";

import {generateJSON} from "../../content/tasks/generatebook.ts";
import {getSetOrElse, set} from "../../scripts/StorageHandler.ts";

export function AddCard(){
    var input : Map<string, number> = new Map<string, number>();
    const [chapters, setChapters] = createSignal(1);

    var title = "";
    var url = "";
    var titles = new Array<string>(chapters());
    var amounts = new Array<number>(chapters());

    function saveBook() {
        const library = getSetOrElse("personalLibrary", new Array<Book>);
        const newbook = getBook();
        const indexOfBook = library.findIndex(book => book.name == newbook.name);
        if (indexOfBook != -1)
            library[indexOfBook] = newbook;
        else
            library.push(newbook);
        set("personalLibrary", library);
    }

    function getBook() : Book {
        createInput();
        return generateJSON(input, title, url, title);
    }

    function exportBook() {
        // https://www.30secondsofcode.org/js/s/json-to-file/
        const blob = new Blob([JSON.stringify(getBook(), null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function createInput(){
        input = new Map<string, number>();
        for (var i = 0; i < chapters(); i++){
            input.set(titles[i], amounts[i]);
        }
    }

    function setTitles(index: number, event){
        titles[index] = event.target.value;
    }

    function setAmount(index: number, number: number){
        amounts[index] = number;
    }

    /**
     * Warns the user by changing the text color
     * @param valid Wheter the input was valid
     * @param event The event that triggered this method
     */
    function warn(valid: boolean, event){
        event.target.style.color = valid ? "var(--text-color-negative)" : "red";
    }

    function handleTitleChange(event){
        const valid = event.target.value.length > 0;
        warn(valid, event)
        if (valid)
            title = event.target.value;
    }

    function handleTitlesChange(index: number, event){
        const input : string = event.target.value;
        const copy = titles.findIndex(title => title == input)
        const valid = input.length > 0 && copy == index || copy == -1;
        warn(valid, event)
        if (valid)
            setTitles(index, event);
    }

    function handleAmountChange(index: number, event){
        const number = event.target.value.length > 0 ? parseInt(event.target.value) : 1; 
        const valid = !Number.isNaN(number) && number > 0;
        warn(valid, event);
        if (valid)
            setAmount(index, number);
    }

    return (
        <div class="card add">
            <a href="/"><button aria-label="back" id="import"><img src="/src/assets/home.svg" /><p>Back</p></button></a>
            <h1>Add book</h1>

            <div id="book-params">
                <input placeholder="Book name*" oninput={event => handleTitleChange(event)} onchange={event => handleTitleChange(event)} required></input>
                <input placeholder="Book image URL (optional)" oninput={event => url = event.target.value} onchange={event => url = event.target.value}></input>
            </div>
            

            <div id="chapter-inputs">
                <button aria-label="add" class="add" onclick={event => setChapters(chapters() + 1)}><img src="/src/assets/plus.svg" /><p>Add entry</p></button>
                <ol>
                    <For each={[...Array(chapters()).keys()]}>
                        {chapter => 
                        <li class="chapter-input">
                            <p>{chapter + 1}</p>
                            <input placeholder="Chapter title*" oninput={event => handleTitlesChange(chapter, event)} onchange={event => handleTitlesChange(chapter, event)} required />
                            <input placeholder="# of tasks*" onchange={event => handleAmountChange(chapter, event)}
                            oninput={event => handleAmountChange(chapter, event)} required/>
                        </li>
                        }
                    </For>
                </ol>
            </div>
            

            <div id="buttons">
                <button aria-label="done" id="done" onclick={event => saveBook()}><img src="/src/assets/tick.svg" /><p>Save</p></button>
                <button aria-label="export" id="export" onclick={event => exportBook()}><img src="/src/assets/download.svg" /><p>Export</p></button>
                <button aria-label="import" id="import"><img src="/src/assets/upload.svg" /><p>Import</p></button>
            </div>
		</div>
    )
}