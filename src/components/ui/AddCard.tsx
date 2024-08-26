import "./Card.css";
import "./AddCard.css";
import "../../styles/interactives.css"

import homeIcon from "/src/assets/home.svg";
import tickIcon from "/src/assets/tick.svg";
import trashIcon from "/src/assets/trash.svg";
import uploadIcon from "/src/assets/upload.svg";
import downloadIcon from "/src/assets/download.svg";
import plusIcon from "/src/assets/plus.svg";
import shareIcon from "/src/assets/share.svg";

import {createSignal, For, Show} from "solid-js";

import {dummyBook, resetSpentTasksFromBook, getPersonalLibrary, setPersonalLibrary, libraryHasIdPersonal, indexOfBookByIdPersonal} from "../../scripts/Books.ts";
import {generateBook, exportBook} from "../../scripts/BookGenerator.ts";
import type {Book } from "../../scripts/BookGenerator.ts";

import {isValid as _isValid} from "../../scripts/Utils.ts";
import Button from "../interactive/Button.tsx";

export function AddCard(){
    var input : Map<string, number> = new Map<string, number>();

    const [save, setSave] = createSignal(true);

    const [chapters, setChapters] = createSignal(1);
    const [library, setLibrary] = createSignal(getPersonalLibrary());
    console.log(library());
    const [title, setTitle] = createSignal("");
    const [link, setLink] = createSignal("");
    const [titles, setTitles] = createSignal(new Array(chapters()));
    const [amounts, setAmounts] = createSignal(new Array<number>(chapters()));

    function clear(){
        importBook(dummyBook);
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
    }

    const saveBook = () => {
        const library = getPersonalLibrary();
        const newbook = makeBook();
        if (libraryHasIdPersonal(newbook.id))
            library[indexOfBookByIdPersonal(newbook.id)] = newbook;
        else
            library.push(newbook);
        setLibraries(library);
        resetSpentTasksFromBook(newbook); // Reset tasks, if there are any
    }

    const getBook = () => {
        exportBook(makeBook());
    }

    function removeBook(name: string){
        const library = getPersonalLibrary();
        if (libraryHasIdPersonal(name))
            library.splice(indexOfBookByIdPersonal(name),1);
        setLibraries(library);
    }

    function removeAllBooks(){
        setLibraries(new Array);
    }

    function setLibraries(library: Array<Book>) {
        setPersonalLibrary(library);
        setLibrary(library);
    }

    function makeBook() : Book{
        createInput();
        return generateBook(input, title(), link(), "", true);
    }

    function createInput(){
        input = new Map<string, number>();
        for (var i = 0; i < chapters(); i++){
            if (amounts()[i] != undefined)
            input.set(titles()[i], amounts()[i]);
        }
    }

    function handleTitleChange(event : Event & {currentTarget : HTMLInputElement}){
        if (event.currentTarget.validity)
            setTitle(event.currentTarget.value.trim());
    }

    function handleTitlesChange(index: number, event : Event & {currentTarget : HTMLInputElement}){
        if (event.currentTarget.validity){
            const current = titles();
            current[index] = event.currentTarget.value.trim();
            setTitles(current);
        }
    }

    function handleAmountChange(index: number, event : Event & {currentTarget : HTMLInputElement}){
        if (event.currentTarget.validity.valid){
            const current = amounts();
            current[index] = parseInt(event.currentTarget.value);
            setAmounts(current);
        }
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
    
    const submitForm = () => {
        if (save()) {
            saveBook()
        } else {
            getBook()
        }
    }

    return (
        <div class="card-group card-group--vertical">
            <div class="card add">
                <a id="back" href="/">
                    <Button label="Go home" title="Go back to the index page"
                            text="Back"
                            icons={[[homeIcon, "Return to home"]]}
                    />
                </a>
                <h1>Add book</h1>
                <form id="book-form" onsubmit={submitForm}>
                    <div class="input-list">
                        <input value={title()} placeholder="Book name*" oninput={handleTitleChange} onchange={handleTitleChange} required aria-required="true"></input>
                        <input type="url" value={link()} placeholder="Book image URL (optional)" oninput={event => setLink(event.target.value)} onchange={event => setLink(event.target.value)} aria-required="false"></input>
                    </div>
                    
                    <div id="chapter-inputs">
                        <button aria-label="add" id="add" onclick={() => setChapters(chapters() + 1)} title="Add an entry"><img src={plusIcon.src} alt="Add entry"/><p>Add entry</p></button>
                        <ol class="input-list input-list--vertical">
                            <For each={[...Array(chapters()).keys()]}>
                                {chapter => 
                                <li class="interactive-group input-group chapter-input">
                                    <p>{chapter + 1}</p>
                                    <input type="text" value={titles()[chapter] == undefined ? "" : titles()[chapter]} placeholder="Chapter title*" 
                                    oninput={event => handleTitlesChange(chapter, event)} 
                                    onchange={event => handleTitlesChange(chapter, event)} 
                                    required aria-required="true"/>
                                    <input type="number" min="0" inputmode="numeric" pattern="[0-9]*" value={amounts()[chapter] == undefined ? "" : amounts()[chapter]} placeholder="# tasks*" onchange={event => handleAmountChange(chapter, event)}
                                    oninput={event => handleAmountChange(chapter, event)} required aria-required="true"/>
                                </li>
                                }
                            </For>
                        </ol>
                    </div>

                    <Show when={libraryHasIdPersonal(title()+":[P]")}>
                        <p class="warning">There already exists a book under this name. Saving will overwrite it!</p>
                    </Show>

                    <div class="interactive-group button-group">
                        <Button id="done" label="Save book" title="Save book to browser memory"
                                onclick={() => setSave(true)} text="Save" type="submit"
                                icons={[[tickIcon, "Save book"]]}
                        />
                        <Button id="export" label="Export book" title="Save book to disk"
                                onclick={() => setSave(false)} text="Export" type="submit"
                                icons={[[downloadIcon, "Export book"]]}
                        />
                        <input type="file" aria-label="Import file" aria-hidden="true" aria-labelledby="file-import-label" id="file-import" onchange={handleFileSelect} title="Import file from disk"></input>
                        <label class="faux-button" id="file-import-label" aria-label="Import file" for="file-import"><img src={uploadIcon.src} alt="Import book" title="Import file from disk"/><p>Import</p></label>

                        <Button id="clear" label="Clear entries" title="Remove the entered values"
                                onclick={() => clear()} text="Clear"
                                icons={[[trashIcon, "Clear entries"]]}
                        />
                    </div>
                </form>
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
                                <div class="interactive-group button-group interactive-group--tight">
                                    <Button label={"Remove \"" + book.name + "\""}
                                            onclick={() => removeBook(book.name)}
                                            icons={[[trashIcon, "Remove book"]]}
                                    />
                                    <Button label={"Export \"" + book.name + "\""}
                                            onclick={() => exportBook(book)}
                                            icons={[[downloadIcon, "Export book"]]}
                                    />
                                    <Button label={"Import \"" + book.name + "\""}
                                            onclick={() => importBook(book)}
                                            icons={[[uploadIcon, "Import book"]]}
                                    />
                                    <a href={"https://github.com/mikael-ros/slumper/issues/new?assignees=&labels=book+suggestion&projects=&template=book-suggestion.md&title=%5BBook+suggestion%5D+" + book.name} target="_blank">
                                        <Button label="Suggest a book"
                                                icons={[[shareIcon, "Suggest book"]]}
                                        />
                                    </a>
                                </div>
                            </li>
                        }
                    </For>
                </ol>
                
                <Button label={"Remove all books from personal library"}
                        onclick={() => removeAllBooks()} text="Reset"
                        disabled={library().length == 0}
                        icons={[[trashIcon, "Clear all books"]]}
                />
                
            </div>
        </div>
    )
}