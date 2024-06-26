import "./Card.css";
import "./AddCard.css";

import homeIcon from "/src/assets/home.svg";
import tickIcon from "/src/assets/tick.svg";
import trashIcon from "/src/assets/trash.svg";
import uploadIcon from "/src/assets/upload.svg";
import downloadIcon from "/src/assets/download.svg";
import plusIcon from "/src/assets/plus.svg";
import shareIcon from "/src/assets/share.svg";

import { createEffect, createSignal, For, Show } from "solid-js";

import {dummyBook, resetSpentTasksFromBook} from "../../scripts/Books.ts";
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
    const [isValid, setIsValid] = createSignal(false);

    var valids = new Array;

    createEffect(() => { // Add another field every time we add a chapter
        chapters();
        valids.push([false,false]);
        setIsValid(false);})

    function getLibrary() : Book[] {
        return getSetOrElse("personalLibrary", new Array<Book>);
    }

    function clear(){
        importBook(dummyBook);
        valids.forEach(validity => {
            validity[0] = false;
            validity[1] = false;
        })
        setIsValid(false);
    }

    function importBook(book: Book){
        setTitle(book.name);
        setLink(book.previewImagePath);

        setTitles(book.chapters.map(chapter => chapter.fullname));
        if (!(book.chapters.length == 1 && book.chapters[0].tasks.length == 0))
            setAmounts(book.chapters.map(chapter => chapter.tasks.length));
        else 
            setAmounts(new Array<number>(chapters()));
        setChapters(book.chapters.length);
        valids.forEach(validity => {
            validity[0] = true;
            validity[1] = true;
        })
        setIsValid(true);
    }

    function saveBook() {
        if (isValid()){
            const library = getLibrary();
            const newbook = makeBook();
            const indexOfBook = library.findIndex(book => book.name == newbook.name);
            if (indexOfBook != -1)
                library[indexOfBook] = newbook;
            else
                library.push(newbook);
            set("personalLibrary", library);
            setLibrary(library);
            resetSpentTasksFromBook(newbook); // Reset tasks, if there are any
        }
    }

    function removeBook(name: string){
        const library = getLibrary();
        const indexOfBook = library.findIndex(book => book.name == name);
        if (indexOfBook != -1)
            library.splice(indexOfBook,1);
        set("personalLibrary", library);
        setLibrary(library);
    }

    function removeAllBooks(){
        setLibrary(new Array);
        set("personalLibrary", new Array);
    }

    function makeBook() : Book{
        createInput();
        return generateBook(input, title(), link(), "", true);
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
        current[index] = event.currentTarget.value.trim();
        setTitles(current);
    }

    function updateAmounts(index: number, number: number){
        const current = amounts();
        current[index] = number;
        setAmounts(current);
    }

    function updateValidity(index: number, validity: boolean, amount: boolean){
        valids[index] = amount ? [valids[index][0], validity] : [validity, valids[index][1]];
    
        setIsValid(title().length > 0 && allValid());
    }

    function allValid(){
        var allValid = true;
        valids.forEach(valid => {
            allValid = allValid && valid[0] && valid[1];
        })
        return allValid;
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
        const valid = event.currentTarget.value.trim().length > 0;
        warn(valid, event)
        if (valid) {
            setTitle(event.currentTarget.value.trim());
            setIsValid(valid && allValid())
        } else 
            setIsValid(false);
    }

    function handleTitlesChange(index: number, event : Event & {currentTarget : HTMLInputElement}){
        const input : string = event.currentTarget.value.trim();
        const copy = titles().indexOf(input);
        const valid = input.length != 0 && (copy == index || copy == -1);
        warn(valid, event)
        updateValidity(index, valid, false);
        if (valid)
            updateTitles(index, event); 
    }

    function handleAmountChange(index: number, event : Event & {currentTarget : HTMLInputElement}){
        const number = event.currentTarget.value.length > 0 ? parseInt(event.currentTarget.value) : -1; 
        const valid = !Number.isNaN(number) && number > 0;
        warn(valid, event);
        updateValidity(index, valid, true);
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
                <a id="back" href="/"><button aria-label="Go home" title="Go back to the index page"><img src={homeIcon.src} alt="Return to home"/><p>Back</p></button></a>
                <h1>Add book</h1>

                <div id="book-params">
                    <input value={title()} placeholder="Book name*" oninput={handleTitleChange} onchange={handleTitleChange} required aria-required="true"></input>
                    <input type="url" value={link()} placeholder="Book image URL (optional)" oninput={event => setLink(event.target.value)} onchange={event => setLink(event.target.value)} aria-required="false"></input>
                </div>
                
                <div id="chapter-inputs">
                    <button aria-label="add" id="add" onclick={() => setChapters(chapters() + 1)} title="Add an entry"><img src={plusIcon.src} alt="Add entry"/><p>Add entry</p></button>
                    <ol>
                        <For each={[...Array(chapters()).keys()]}>
                            {chapter => 
                            <li class="chapter-input">
                                <p>{chapter + 1}</p>
                                <input type="text" value={titles()[chapter] == undefined ? "" : titles()[chapter]} placeholder="Chapter title*" oninput={event => handleTitlesChange(chapter, event)} onchange={event => handleTitlesChange(chapter, event)} required aria-required="true"/>
                                <input type="text" inputmode="numeric" pattern="[0-9]*" value={amounts()[chapter] == undefined ? "" : amounts()[chapter]} placeholder="# tasks*" onchange={event => handleAmountChange(chapter, event)}
                                oninput={event => handleAmountChange(chapter, event)} required aria-required="true"/>
                            </li>
                            }
                        </For>
                    </ol>
                </div>

                <div class="button-group">
                    <button aria-label="Save book" id="done" onclick={saveBook} disabled={!isValid()} title="Save book to browser memory"><img src={tickIcon.src} alt="Save book"/><p>Save</p></button>
                    <button aria-label="Export book" id="export" onclick={getBook} disabled={!isValid()} title="Save book to disk"><img src={downloadIcon.src} alt="Export book"/><p>Export</p></button>
                    <input type="file" aria-label="Import file" aria-hidden="true" aria-labelledby="file-import-label" id="file-import" onchange={handleFileSelect} title="Import file from disk"></input>
                    <label class="faux-button" id="file-import-label" aria-label="Import file" for="file-import"><img src={uploadIcon.src} alt="Import book" title="Import file from disk"/><p>Import</p></label>
                    <button aria-label="Clear entries" id="clear" onclick={() => clear()} title="Remove the entered values"><img src={trashIcon.src} alt="Clear entries"/><p>Clear</p></button>
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
                                    <button aria-label={"Remove \"" + book.name + "\""} onclick={() => removeBook(book.name)} title={"Remove \"" + book.name + "\""}><img src={trashIcon.src} alt="Remove book"/></button>
                                    <button aria-label={"Export \"" + book.name + "\""} onclick={() => exportBook(book)} title={"Export \"" + book.name + "\""}><img src={downloadIcon.src} alt="Export book"/></button>
                                    <button aria-label={"Import \"" + book.name + "\""} onclick={() => importBook(book)} title={"Import \"" + book.name + "\""}><img src={uploadIcon.src} alt="Import book to fields"/></button>
                                    <a href={"https://github.com/mikael-ros/slumper/issues/new?assignees=&labels=book+suggestion&projects=&template=book-suggestion.md&title=%5BBook+suggestion%5D+" + book.name} target="_blank"><button aria-label="Suggest a book" id="suggest" title="Suggest a book" disabled={library().length == 0}><img src={shareIcon.src} alt="Suggest a book"/></button></a>
                                </div>
                            </li>
                        }
                    </For>
                </ol>
                
                <button aria-label="Reset library" id="reset" onclick={() => removeAllBooks()} disabled={library().length == 0} title="Remove all books from personal library"><img src={trashIcon.src} alt="Clear all books"/><p>Reset</p></button>
                
            </div>
        </div>
    )
}