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

import {createSignal, For, Match, Show, Switch} from "solid-js";

import {dummyBook, getPersonalLibrary, libraryHasIdPersonal, removeBook, removeAllBooks, insertBook} from "../../scripts/Books.ts";
import {generateBook, exportBook} from "../../scripts/BookGenerator.ts";
import type {Book } from "../../scripts/BookGenerator.ts";

import {isValid as _isValid} from "../../scripts/Utils.ts";
import Button from "../interactive/Button.tsx";

export function AddCard(){
    var input : Map<string, number> = new Map<string, number>();

    const [save, setSave] = createSignal(true);

    const [chapters, setChapters] = createSignal(1);
    const [library, setLibrary] = createSignal(getPersonalLibrary());
    const [title, setTitle] = createSignal("");
    const [link, setLink] = createSignal("");
    const [chapterTitles, setChapterTitles] = createSignal(new Array(chapters()));
    const [amounts, setAmounts] = createSignal(new Array<number>(chapters()));

    /**
     * Clears the inputs by importing the "dummy book"
     */
    function clear(){
        importBook(dummyBook);
    }

    /**
     * Imports a book into the form fields
     * @param book The book imported
     */
    function importBook(book: Book){
        setTitle(book.name);
        setLink(book.previewImagePath);

        setChapterTitles(book.chapters.map(chapter => chapter.fullname));
        if (!(book.chapters.length == 1 && book.chapters[0].tasks.length == 0))
            setAmounts(book.chapters.map(chapter => chapter.tasks.length));
        else 
            setAmounts(new Array<number>(chapters()));
        setChapters(book.chapters.length);
    }

    /**
     * Removes a book from the personal library, both in the menu and in the browser storage (hence this being handled here and not seperate)
     * @param book The book being removed
     */
    function remove(book: Book){
        removeBook(book);
        refreshLocalLibrary();
    }

    /**
     * Removes all personal books
     */
    function removeAll(){
        removeAllBooks();
        refreshLocalLibrary();
    }

    /**
     * Fetches the personal library anew
     */
    function refreshLocalLibrary() {
        setLibrary(getPersonalLibrary());
    }

    /**
     * Generates the a book from the current inputs
     * @returns A book
     */
    function makeBook() : Book{
        createInput();
        return generateBook(input, title(), link(), "", true);
    }

    /**
     * Generates a map of chapters from the inputs
     */
    function createInput(){
        input = new Map<string, number>();
        for (var i = 0; i < chapters(); i++){
            if (amounts()[i] != undefined)
            input.set(chapterTitles()[i], amounts()[i]);
        }
    }

    /**
     * Sets the title if it is valid
     * @param event The input event
     */
    function handleTitleChange(event : Event & {currentTarget : HTMLInputElement}){
        if (event.currentTarget.validity)
            setTitle(event.currentTarget.value.trim());
    }

    /**
     * Changes the title of a chapter, if it is valid
     * @param index The chapter index
     * @param event The input event
     */
    function handleChapterTitlesChange(index: number, event : Event & {currentTarget : HTMLInputElement}){
        if (event.currentTarget.validity){
            const current = chapterTitles();
            current[index] = event.currentTarget.value.trim();
            setChapterTitles(current);
        }
    }

    /**
     * Changes the amount of tasks, if valid
     * @param index The chapter index
     * @param event The input event
     */
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
    
    /**
     * Submits the form, with actions based on those set by the bottom buttons
     */
    const submitForm = () => {
        if (save()) {
            insertBook(makeBook())
        } else {
            exportBook(makeBook());
        }
    }

    return (
        <div class="card-group card-group--vertical">
            <div class="card add">
                <a role="button" id="back" href="/">
                    <Button label="Go home" title="Go back to the index page"
                            text="Back"
                            icons={[[homeIcon, "Return to home"]]}
                    />
                </a>
                <h1>Add book</h1>
                <form id="book-form" onsubmit={submitForm}>
                    <div class="input-list">
                        <input value={title()} placeholder="Book name*" oninput={handleTitleChange} onchange={handleTitleChange} required aria-required="true"></input>
                        <input autocomplete="photo" type="url" value={link()} placeholder="Book image URL (optional)" oninput={event => setLink(event.target.value)} onchange={event => setLink(event.target.value)} aria-required="false"></input>
                    </div>
                    
                    <div id="chapter-inputs">
                        <Button id="add-entry" label="Add entry" title="Add an entry"
                                onclick={() => setChapters(chapters() + 1)} text="Add entry"
                                icons={[[plusIcon, ""]]}
                        />
                        <ol class="input-list input-list--vertical">
                            <For each={[...Array(chapters()).keys()]}>
                                {chapter => 
                                <li class="interactive-group input-group chapter-input">
                                    <label id={"label-"+chapter} for={"chapter-"+chapter} >{chapter + 1}</label>
                                    <input id={"chapter-"+chapter} type="text" value={chapterTitles()[chapter] == undefined ? "" : chapterTitles()[chapter]} placeholder="Chapter title*" 
                                    oninput={event => handleChapterTitlesChange(chapter, event)} 
                                    onchange={event => handleChapterTitlesChange(chapter, event)} 
                                    required aria-required="true" aria-labelledby={"label-"+chapter}/>
                                    <input type="number" min="0" inputmode="numeric" pattern="[0-9]*" value={amounts()[chapter] == undefined ? "" : amounts()[chapter]} placeholder="# tasks*" onchange={event => handleAmountChange(chapter, event)}
                                    oninput={event => handleAmountChange(chapter, event)} required aria-labelledby={"label-"+chapter} aria-required="true"/>
                                </li>
                                }
                            </For>
                        </ol>
                    </div>

                    <Show when={libraryHasIdPersonal(title()+":[P]")}>
                        <p role="alert" class="warning">There already exists a book under this name. Saving will overwrite it!</p>
                    </Show>

                    <div class="interactive-group button-group" id="form-controls">
                        <Button id="done" label="Save book" title="Save book to browser memory"
                                onclick={() => setSave(true)} text="Save" type="submit"
                                icons={[[tickIcon, "Save book"]]}
                        />
                        <Button id="export" label="Export book" title="Save book to disk"
                                onclick={() => setSave(false)} text="Export" type="submit"
                                icons={[[downloadIcon, "Export book"]]}
                        />
                        <input type="file" aria-label="Import file" aria-hidden="true" aria-labelledby="file-import-label" id="file-import" onchange={handleFileSelect} title="Import file from disk"></input>
                        <label role="button" class="faux-button" id="file-import-label" aria-label="Import file" for="file-import"><img src={uploadIcon.src} alt="Import book" title="Import file from disk"/><p>Import</p></label>

                        <Button id="clear" label="Clear entries" title="Remove the entered values"
                                onclick={() => clear()} text="Clear"
                                icons={[[trashIcon, "Clear entries"]]}
                        />
                    </div>
                </form>
            </div>
            <div class="card library">
                <h1>Personal library</h1>
                <Switch>
                    <Match when={library().length == 0}>
                        <div class="book-disclaimer">
                            <p>Looks like your personal library is empty...</p><br/>
                            <p><em>Once you have added books, they will appear here.</em></p>
                        </div>
                    </Match>
                    <Match when={library().length != 0}>
                        <ol class="book-list">
                            <For each={library()}>
                                {book =>
                                    <li tabIndex="0" class="book-entry"><h5>{book.name}</h5> 
                                        <div class="interactive-group button-group interactive-group--tight" tabIndex="0">
                                            <Button tabIndex={0} label={"Remove \"" + book.name + "\""}
                                                    onclick={() => remove(book)}
                                                    icons={[[trashIcon, "Remove book"]]}
                                            />
                                            <Button tabIndex={0} label={"Export \"" + book.name + "\""}
                                                    onclick={() => exportBook(book)}
                                                    icons={[[downloadIcon, "Export book"]]}
                                            />
                                            <Button tabIndex={0} label={"Import \"" + book.name + "\""}
                                                    onclick={() => importBook(book)}
                                                    icons={[[uploadIcon, "Import book"]]}
                                            />
                                            <a tabIndex="-1" href={"https://github.com/mikael-ros/slumper/issues/new?assignees=&labels=book+suggestion&projects=&template=book-suggestion.md&title=%5BBook+suggestion%5D+" + book.name} target="_blank">
                                                <Button tabIndex={0} label="Suggest a book"
                                                        icons={[[shareIcon, "Suggest book"]]}
                                                />
                                            </a>
                                        </div>
                                    </li>
                                }
                            </For>
                        </ol>
                    </Match>
                </Switch>
                
                <Button label={"Remove all books from personal library"}
                        onclick={() => removeAll()} text="Reset"
                        disabled={library().length == 0}
                        icons={[[trashIcon, "Clear all books"]]}
                />
                
            </div>
        </div>
    )
}