import "./Card.css";
import "./AddCard.css";

import { createSignal, For, Show } from "solid-js";

import {dummyBook} from "../../scripts/Books.ts";
import {generateBook, exportBook} from "../../scripts/BookGenerator.ts";
import type {Book } from "../../scripts/BookGenerator.ts";

import {getSetOrElse, set} from "../../scripts/StorageHandler.ts";

export function AddCard(){
    var input : Map<string, number> = new Map<string, number>();
    const [chapters, setChapters] = createSignal(1);
    const [library, setLibrary] = createSignal(getLibrary());

    const [title, setTitle] = createSignal("");
    const [link, setLink] = createSignal("");
    const [titles, setTitles] = createSignal(new Array(chapters()));
    const [amounts, setAmounts] = createSignal(new Array<number>(chapters()));

    function getLibrary() : Book[] {
        return getSetOrElse("personalLibrary", new Array<Book>);
    }

    function importBook(book: Book){
        console.log(book);

        setTitle(book.name);
        setLink(book.previewImagePath);

        setTitles(book.chapters.map(chapter => chapter.fullname));
        if (!(book.chapters.length == 1 && book.chapters[0].tasks.length == 0))
            setAmounts(book.chapters.map(chapter => chapter.tasks.length));
        else 
            setAmounts(new Array<number>(chapters()));
        setChapters(book.chapters.length);
    }

    function saveBook() {
        const library = getLibrary();
        const newbook = makeBook();
        const indexOfBook = library.findIndex(book => book.name == newbook.name);
        if (indexOfBook != -1)
            library[indexOfBook] = newbook;
        else
            library.push(newbook);
        set("personalLibrary", library);
        setLibrary(library);
    }

    function removeBook(name: string){
        const library = getLibrary();
        const indexOfBook = library.findIndex(book => book.name == name);
        if (indexOfBook != -1)
            library.splice(indexOfBook,1);
        set("personalLibrary", library);
        setLibrary(library);
    }

    function makeBook() : Book{
        createInput();
        return generateBook(input, title(), link(), title());
    }

    function getBook() {
        exportBook(makeBook());
    }

    function createInput(){
        input = new Map<string, number>();
        for (var i = 0; i < chapters(); i++){
            if (amounts()[i] != undefined)
            input.set(titles()[i], amounts()[i]);
        }
    }

    function updateTitles(index: number, event : Event & {currentTarget : HTMLInputElement}){
        const current = titles();
        current[index] = event.currentTarget.value;
        setTitles(current);
    }

    function updateAmounts(index: number, number: number){
        const current = amounts();
        current[index] = number;
        setAmounts(current);
    }

    /**
     * Warns the user by changing the text color
     * @param valid Wheter the input was valid
     * @param event The event that triggered this method
     */
    function warn(valid: boolean, event : Event & {currentTarget : HTMLInputElement}){
        event.currentTarget.style.color = valid ? "var(--text-color-negative)" : "red";
    }

    function handleTitleChange(event : Event & {currentTarget : HTMLInputElement}){
        const valid = event.currentTarget.value.length > 0;
        warn(valid, event)
        if (valid)
            setTitle(event.currentTarget.value);
    }

    function handleTitlesChange(index: number, event : Event & {currentTarget : HTMLInputElement}){
        const input : string = event.currentTarget.value;
        const copy = titles().indexOf(input);
        const valid = input.length > 0 && copy == index || copy == -1;
        warn(valid, event)
        if (valid)
            updateTitles(index, event);
    }

    function handleAmountChange(index: number, event : Event & {currentTarget : HTMLInputElement}){
        const number = event.currentTarget.value.length > 0 ? parseInt(event.currentTarget.value) : 1; 
        const valid = !Number.isNaN(number) && number > 0;
        warn(valid, event);
        if (valid)
            updateAmounts(index, number);
    }

    function handleFileSelect(event : Event & {currentTarget : HTMLInputElement}) {
        const file = event.currentTarget.files?.[0];
        
        if (!file || file.type !== "application/json") {
            alert("Please select a JSON file.");
            return;
        }
    
        const reader = new FileReader();
    
        reader.onload = function(event) {
            try {
                if (!event.target?.result) {
                    throw new Error("File reading failed");
                }
                const book : Book = JSON.parse(event.target.result as string);
                importBook(book);
            } catch (error) {
                alert("Error parsing JSON file.");
            }
        };
    
        reader.readAsText(file);
    }

    return (
        <div class="card-group vertical">
            
            <div class="card add">
                <a id="back" href="/"><button aria-label="back" ><img src="/src/assets/home.svg" /><p>Back</p></button></a>
                <h1>Add book</h1>

                <div id="book-params">
                    <input value={title()} placeholder="Book name*" oninput={event => handleTitleChange(event)} onchange={event => handleTitleChange(event)} required></input>
                    <input value={link()} placeholder="Book image URL (optional)" oninput={event => setLink(event.target.value)} onchange={event => setLink(event.target.value)}></input>
                </div>
                
                <div id="chapter-inputs">
                    <button aria-label="add" id="add" onclick={() => setChapters(chapters() + 1)}><img src="/src/assets/plus.svg" /><p>Add entry</p></button>
                    <ol>
                        <For each={[...Array(chapters()).keys()]}>
                            {chapter => 
                            <li class="chapter-input">
                                <p>{chapter + 1}</p>
                                <input value={titles()[chapter] == undefined ? "" : titles()[chapter]} placeholder="Chapter title*" oninput={event => handleTitlesChange(chapter, event)} onchange={event => handleTitlesChange(chapter, event)} required />
                                <input value={amounts()[chapter] == undefined ? "" : amounts()[chapter]} placeholder="# tasks*" onchange={event => handleAmountChange(chapter, event)}
                                oninput={event => handleAmountChange(chapter, event)} required/>
                            </li>
                            }
                        </For>
                    </ol>
                </div>

                <div class="button-group">
                    <button aria-label="done" id="done" onclick={saveBook}><img src="/src/assets/tick.svg" /><p>Save</p></button>
                    <button aria-label="export" id="export" onclick={getBook}><img src="/src/assets/download.svg" /><p>Export</p></button>
                    <input type="file" aria-label="import file" id="file-import" onchange={handleFileSelect}></input>
                    <label for="file-import"><img src="/src/assets/upload.svg" /><p>Import</p></label>
                    <button aria-label="clear" id="clear" onclick={() => importBook(dummyBook)}><img src="/src/assets/trash.svg" /><p>Clear</p></button>
                </div>

            </div>
            <div class="card library">
                <h1>Personal library</h1>
                <ol class="book-list">
                    <Show when={library().length == 0}>
                        <p>Looks like your personal library is empty...</p><br/>
                        <p><em>Once you have added books, they will appear here.</em></p>
                    </Show>
                    <For each={library()}>
                        {book =>
                            <li class="book-entry"><h5>{book.name}</h5> 
                                <div class="button-group">
                                    <button aria-label="remove book" onclick={() => removeBook(book.name)}><img src="/src/assets/trash.svg" /></button>
                                    <button aria-label="export book" onclick={() => exportBook(book)}><img src="/src/assets/download.svg" /></button>
                                    <button aria-label="import book" onclick={() => importBook(book)}><img src="/src/assets/upload.svg" /></button>
                                </div>
                            </li>
                        }
                    </For>
                </ol>
                
            </div>
        </div>
    )
}