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
import eyeOpen from "/src/assets/eye-open.svg";
import eyeClosed from "/src/assets/eye-closed.svg";

import {createSignal, For, Match, Show, Switch} from "solid-js";

import {dummyBook, getPersonalLibrary, libraryHasIdPersonal, removeBook, removeAllBooks, insertBook} from "../../scripts/Books.ts";
import {generateBook, exportBook} from "../../scripts/BookGenerator.ts";
import type {Book } from "../../scripts/BookGenerator.ts";

import {isValid as _isValid} from "../../scripts/Utils.ts";
import Button from "../interactive/Button.tsx";

type ChapterEntry = {
    number: number;
    title: string;
    amount: number;
}

export function AddCard(){
    const [save, setSave] = createSignal(true);
    const [displayEmpty, setDisplayEmpty] = createSignal(true);

    const [library, setLibrary] = createSignal(getPersonalLibrary());
    const [title, setTitle] = createSignal("");
    const [link, setLink] = createSignal("");
    const [chapters, setChapters] = createSignal<Array<ChapterEntry>>(new Array({number: 1, title: "", amount: 0}), { equals: false })

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
        setChapters(book.chapters.map(chapter => {return {
            number: chapter.number,
            title: chapter.fullname,
            amount: chapter.tasks.length
        }}))
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
        const input : [string,number][] = chapters().map(c => [c.title, c.amount]);
        return generateBook(input, title(), link(), "", true);
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
            const currentChapters = chapters();
            const entry = currentChapters[index];
            currentChapters[index] = {
                number: entry.number,
                title: event.currentTarget.value,
                amount: entry.amount
            }
            setChapters(currentChapters);
        }
    }

    /**
     * Changes the amount of tasks, if valid
     * @param index The chapter index
     * @param event The input event
     */
    function handleAmountChange(index: number, event : Event & {currentTarget : HTMLInputElement}){
        if (event.currentTarget.validity.valid){
            const currentChapters = chapters();
            const entry = currentChapters[index];
            currentChapters[index] = {
                number: entry.number,
                title: entry.title,
                amount: parseInt(event.currentTarget.value)
            }
            setChapters(currentChapters);
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

    const addEntry = () => {
        var newC = chapters(); 
        newC.push({number: newC.findLast(() => true)!.number+1, title: "", amount: 0}); 
        setChapters(newC);
        console.log(chapters())
    }

    const removeEntry = (chapter: ChapterEntry) => {
        const newChapters = chapters();
        const index = newChapters.findIndex(c => c.number == chapter.number);
        newChapters[index] = {
            number: chapter.number,
            amount: 0,
            title: ""
        }
        setChapters(newChapters);
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
                        <div class="interactive-group button-group">
                            <Button id="add-entry" label="Add entry" title="Add an entry" type="button"
                                    onclick={addEntry} text="Add entry"
                                    icons={[[plusIcon, ""]]}
                            />
                            <Button id="toggle-empty" label={(displayEmpty() ? "Hide" : "View") + " empty"} type="button" iconOnly={true}
                                    onclick={() => setDisplayEmpty(!displayEmpty())}
                                    icons={[[displayEmpty() ? eyeOpen : eyeClosed, (displayEmpty() ? "Hide" : "View") + " empty icon"]]}
                            />
                            
                        </div>
                        
                        <ol class="input-list input-list--vertical" data-display-empty={displayEmpty()}>
                            <For each={chapters()}>
                                {chapter => {
                                    const index = chapters().indexOf(chapter);
                                    return (
                                    <li class="interactive-group input-group chapter-input" data-empty={chapter.amount == 0 && index != 0}>
                                        <label id={"label-"+index+1} for={"chapter-"+index+1} >{chapter.number}</label>
                                        <input id={"chapter-"+index+1} type="text" value={chapter.title} placeholder="Chapter title*" 
                                        onblur={event => handleChapterTitlesChange(index, event)} 
                                        onchange={event => handleChapterTitlesChange(index, event)} 
                                        aria-labelledby={"label-"+index+1}/>
                                        <input type="number" min="0" inputmode="numeric" pattern="[0-9]*" value={chapter.amount} placeholder="# tasks*" 
                                        onchange={event => handleAmountChange(index, event)}
                                        onblur={event => handleAmountChange(index, event)} 
                                        aria-required="true" aria-labelledby={"label-"+index+1} required/>
                                        <Button class="remove-entry" label={"Remove chapter " + index + 1} type="button" iconOnly={true}
                                            onclick={() => removeEntry(chapter)}
                                            icons={[[trashIcon, "Remove chapter"]]}
                                        />
                                    </li>)
                                    }
                                }
                            </For>
                        </ol>
                        <Show when={!displayEmpty()}>
                            <p role="note" class="tip">{chapters().slice(1).filter(c => c.amount == 0).length} hidden chapters</p>
                        </Show>
                    </div>

                    
                    <Show when={libraryHasIdPersonal(title()+":[P]")}>
                        <p role="alert" class="warning">There already exists a book under this name. Saving will overwrite it!</p>
                    </Show>

                    <div role="menu" class="interactive-group button-group" id="form-controls">
                        <Button id="done" label="Save book" title="Save book to browser memory"
                                onclick={() => setSave(true)} text="Save" type="submit"
                                icons={[[tickIcon, "Save book"]]}
                        />
                        <Button id="export" label="Export book" title="Save book to disk"
                                onclick={() => setSave(false)} text="Export" type="submit"
                                icons={[[downloadIcon, "Export book"]]}
                        />
                        <input type="file" aria-label="Import file" aria-hidden="true" aria-labelledby="file-import-label" id="file-import" onchange={handleFileSelect} title="Import file from disk"></input>
                        <label tabIndex="0" role="button" class="faux-button" id="file-import-label" aria-label="Import file" for="file-import"><img src={uploadIcon.src} alt="Import book" title="Import file from disk"/><p>Import</p></label>

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
                                        <div aria-label={"Make choices about the book named " + book.name} role="menu" class="interactive-group button-group interactive-group--tight" tabIndex="0">
                                            <Button tabIndex={0} label={"Remove the book named " + book.name} title={"Remove \"" + book.name + "\""}
                                                    onclick={() => remove(book)}
                                                    icons={[[trashIcon, "Remove book"]]}
                                            />
                                            <Button tabIndex={0} label={"Export the book named " + book.name} title={"Remove \"" + book.name + "\""}
                                                    onclick={() => exportBook(book)}
                                                    icons={[[downloadIcon, "Export book"]]}
                                            />
                                            <Button tabIndex={0} label={"Import the book named " + book.name} title={"Remove \"" + book.name + "\""}
                                                    onclick={() => importBook(book)}
                                                    icons={[[uploadIcon, "Import book"]]}
                                            />
                                            <a tabIndex="-1" href={"https://github.com/mikael-ros/slumper/issues/new?assignees=&labels=book+suggestion&projects=&template=book-suggestion.md&title=%5BBook+suggestion%5D+" + book.name} target="_blank">
                                                <Button tabIndex={0} label={"Suggest the book named " + book.name + " to be added to the default library"} title={"Suggest \"" + book.name + "\" to be added to the default library"}
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