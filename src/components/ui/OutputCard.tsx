import "./Card.css";
import "./OutputCard.css";
import "../../styles/interactives.css"

import tickIcon from "/src/assets/tick.svg";
import refreshIcon from "/src/assets/refresh.svg";
import trashIcon from "/src/assets/trash.svg";
import linkIcon from "/src/assets/link.svg";
import plusIcon from "/src/assets/plus.svg";

import { createSignal, For, onMount, Show } from "solid-js";
import { Randomizer} from "../../scripts/Randomizer";
import { Timer } from "./Timer.tsx";
import complete from "../../assets/complete.wav";

import {dummyChapter, dummyTask, getBook, getLibrary} from "../../scripts/Books.ts";
import type {Book} from "../../scripts/BookGenerator.ts";
import {getSetOrElse, set} from "../../scripts/StorageHandler.ts";
import Button from "../interactive/Button.tsx";

export function OutputCard(){
    const completionSound = new Audio(complete);
    completionSound.volume = getSetOrElse("volume", 1.0);

    const [library, setLibrary] = createSignal(getLibrary());
    const [book, setBook] = createSignal<Book>(getBook(getSetOrElse("prior", library()[0].id)));
    const [chapter, setChapter] = createSignal(dummyChapter);
    const [task, setTask] = createSignal(dummyTask);
    
    const [checked, setChecked] = createSignal<Set<Number>>(new Set<Number>);
    const [abort, setAbort] = createSignal(false);

    var randomizer : Randomizer = new Randomizer(book());

    document.body.style.backgroundImage = "url(" + book().previewImagePath + ")"; 

    function setNewBook(book : Book){
        setBook(book);
        set("prior", book.id);
        randomizer = new Randomizer(book);
        document.body.style.backgroundImage = "url(" + book.previewImagePath + ")"; 
        setChecked(new Set<Number>);
        updateChecks();
        random(false);
    }

    /**
     * Retrieves a random task from the randomizer object, and does the relevant logic
     * @param memorize Wheter to put the task into memory or not
     */
    function random(memorize: Boolean){
        randomizer.setNew(memorize);
        setChapter(randomizer.getChapter());
        setTask(randomizer.getTask());
        updateChecks();
        if (memorize){
            completionSound.volume = getSetOrElse("volume", 1.0); // Updates the volume to current level. Would ideally be handled by a context provider, but I couldn't figure it out
            completionSound.play();
        }
    }

    onMount(() => { // Randomize on load
        random(false);
    })

    function updateChecks(){
        setChecked(new Set(book().chapters
                        .filter(chapter => randomizer.chapterIsEnabled(chapter))
                        .map(chapter => chapter.number)));
        
        setAbort(checked().size == 0 || book().chapters.every(chapter => randomizer.chapterIsDisabled(chapter)));
    }

    onMount(() => {
        if (getSetOrElse("refreshPersonalLibrary", false)) { // Refresh the library if necessary
            setLibrary(getLibrary());
            set("refreshPersonalLibrary", false);
        }
    })

    const formatTask = () => {
        return task() != dummyTask ? (book().chapters.length > 1 ? chapter().number + "." : "") + task().task : "No task left in chapter";
    }

    return (
        <div class="card-group">

            <Timer closeOn={abort} refreshOn={task}/>
            
            <div class="card output">
                <div id="output-wrapper">
                    <h2 id="chapter">{chapter().fullname}</h2>
                    <h3 id="output">{formatTask()}</h3>
                </div>
                
                <div class="interactive-group button-group">
                    <Button iconOnly={true} id="random" label="Randomize" title="Randomize new task"
                            disabled={abort()} onclick={() => random(false)} 
                            icons={[[refreshIcon, "Randomize"]]}
                    />
                    <Button iconOnly={true} id="done" label="Complete task" title="Randomize new task, and mark prior as complete"
                            disabled={abort()} onclick={() => random(true)} 
                            icons={[[tickIcon, "Complete (tick) icon"], [refreshIcon, "Randomize icon, below complete"]]}
                    />
                    <Button iconOnly={true} id="reset" label="Reset memory" title="Randomize new task"
                            onclick={() => {randomizer.resetSpentTasks(); random(false)}} 
                            icons={[[trashIcon, "Reset memory"]]}
                    />
                </div>

                <Show when={book().chapters.length > 1}>
                    <div id="checkbox-wrapper">
                        <h4>Filter chapters</h4>
                        <div id="checkboxes">
                            <For each={book().chapters}>
                                {(chapter) => 
                                    <div class="checkbox">
                                        <input id={chapter.fullname.toLowerCase().replace(/\s/g, "")} type="checkbox" 
                                        disabled={!checked().has(chapter.number) && randomizer.chapterIsDisabled(chapter)} 
                                        checked={checked().has(chapter.number)} 
                                        onchange={() => {
                                            randomizer.toggleFilter(chapter);
                                            updateChecks();
                                        }} 
                                        title={"Toggle chapter " + chapter.number}
                                        aria-label={"Toggle chapter " + chapter.number}
                                        aria-labelledby={"checkbox-" + chapter.fullname.toLowerCase().replace(/\s/g, "")}/>
                                        <label class="checkbox-label" id={"checkbox-" + chapter.fullname.toLowerCase().replace(/\s/g, "")} for={chapter.fullname.toLowerCase().replace(/\s/g, "")}>{chapter.number}</label>
                                    </div>
                                }
                            </For>
                        </div>
                    </div>
                </Show>

                <div id="course-select-wrapper">
                    <select id="course-select" value={JSON.stringify(book())} name="course" onchange={event => {setNewBook(JSON.parse(event.target.value))}} title="Select a book" aria-label="Select a book" aria-required="false">
                        <For each={library()}>
                            {(book) =>
                                <option value={JSON.stringify(book)}>{(book.custom ? "[P] " : "") + book.name}</option>
                            }
                        </For>
                    </select>
                    <Show when={book().source != ""}>
                        <a href={book().source} id="get">
                            <Button label="Go to the source" title="Go to the source of the book" text="Get"
                                    icons={[[linkIcon, "Book source"]]} />
                        </a>
                    </Show>
                    <a href="add" id="add">
                        <Button label="Add a custom book" title="Add a custom book (leaves page)" text="Add"
                                icons={[[plusIcon, "Add book"]]} />
                    </a>
                </div>
                
            </div>
        </div>
    )
}