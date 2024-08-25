import "./Card.css";
import "./OutputCard.css";

import tickIcon from "/src/assets/tick.svg";
import refreshIcon from "/src/assets/refresh.svg";
import trashIcon from "/src/assets/trash.svg";
import timerIcon from "/src/assets/timer.svg";
import linkIcon from "/src/assets/link.svg";
import plusIcon from "/src/assets/plus.svg";

import { createSignal, For, onMount, Show } from "solid-js";
import { Randomizer} from "../../scripts/Randomizer";
import { Timer } from "./Timer.tsx";
import complete from "../../assets/complete.wav";

import {dummyChapter, dummyTask, getBook, getLibrary} from "../../scripts/Books.ts";
import type {Chapter,Book} from "../../scripts/BookGenerator.ts";
import {getSetOrElse, set} from "../../scripts/StorageHandler.ts";

export function OutputCard(){
    var defaultTimer : number = 180;
    const completionSound = new Audio(complete);
    completionSound.volume = getSetOrElse("volume", 1.0);

    const [displayTimer, setDisplayTimer] = createSignal(false);
    const [timer, setTimer] = createSignal(defaultTimer, { equals: false });

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
        setTimer(defaultTimer);
        if (memorize){
            completionSound.volume = getSetOrElse("volume", 1.0); // Updates the volume to current level. Would ideally be handled by a context provider, but I couldn't figure it out
            completionSound.play();
        }
    }

    function setNewTimer(timer : number){
        defaultTimer = timer;
        setTimer(timer);
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

    function warn(valid: boolean, event : Event & {currentTarget : HTMLInputElement}){
        event.currentTarget.style.color = valid ? "var(--text-color-negative)" : "red";
    }

    function handleInput(event : Event & {currentTarget : HTMLInputElement}){
        const number = event.currentTarget.value.length != 0 ? parseInt(event.currentTarget.value) : defaultTimer; 
        const valid = !Number.isNaN(number) && number > 0 && number <= 3600;
        warn(valid, event);
    }

    function handleChange(event : Event & {currentTarget : HTMLInputElement}){
        const number = event.currentTarget.value.length != 0 ? parseInt(event.currentTarget.value) : defaultTimer; // Makes sure empty input is handled correctly
        const valid = !Number.isNaN(number) && number > 0 && number <= 3600;
        
        if (valid && number != defaultTimer) // Only set a number if it is non negative and actually a number, and if it is actually changed
            setNewTimer(number)
        warn(valid, event);
    }

    onMount(() => {
        if (getSetOrElse("refreshPersonalLibrary", false)) { // Refresh the library if necessary
            setLibrary(getLibrary());
            set("refreshPersonalLibrary", false);
        }
    })

    return (
        <div class="card-group">
            <div class ="card small" id="timer">
                <div id="timer-display" data-open={displayTimer() && !abort()}>
                    <Show when={displayTimer() && !abort()}>
                        <Timer time={timer()}/>
                    </Show>
                </div>
                <div id="timer-config">
                    <button data-open={displayTimer() && !abort()} aria-label="Toggle timer" aria-controls="timer-display" id="toggle" onclick={() => setDisplayTimer(!displayTimer())} disabled={abort()}><img src={timerIcon.src} alt="Timer icon"/><p>Timer</p></button>
                    <Show when={displayTimer() && !abort()}>
                        <input type="text" inputmode="numeric" pattern="[0-9]*" placeholder={timer().toString()} 
                        onchange={handleChange} 
                        oninput={handleInput}
                        aria-required="false"/><p>seconds</p>
                    </Show>
                </div>
            </div>
            
            <div class="card output">
                <div id="output-wrapper">
                    <h2 id="chapter">{chapter().fullname}</h2>
                    <h3 id="output">{task().task != -1 ? (book().chapters.length > 1 ? chapter().number + "." : "") + task().task : "No task left in chapter"}</h3>
                </div>
                
                <div class="button-group">
                    <button class="icon-only" aria-label="Randomize" id="random" 
                    onclick={() => random(false)} 
                    disabled={abort()}
                    title="Randomize new task">
                        <img src={refreshIcon.src} alt="Randomize"/>
                    </button>
                    <button class="icon-only" aria-label="Complete task" id="done" 
                    onclick={() => random(true)} 
                    disabled={abort()}
                    title="Randomize new task, and mark prior as complete">
                        <img src={tickIcon.src} alt="Complete (tick) icon"/>
                        <img src={refreshIcon.src} alt="Randomize icon, below complete"/>
                    </button>
                    <button class="icon-only" aria-label="Reset memory" id="reset" 
                    onclick={() => {randomizer.resetSpentTasks(); random(false)}}
                    title="Reset the task memory" >
                        <img src={trashIcon.src} alt="Reset memory"/>
                    </button>
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
                    <select id="course-select" value={JSON.stringify(book())} name="course" onchange={(event) => {setNewBook(JSON.parse(event.target.value))}} title="Select a book" aria-label="Select a book" aria-required="false">
                        <For each={library()}>
                            {(book) =>
                                <option value={JSON.stringify(book)}>{(book.custom ? "[P] " : "") + book.name}</option>
                            }
                        </For>
                    </select>
                    <Show when={book().source != ""}>
                        <a href={book().source} id="get"><button aria-label="Go to the source" title="Go to the source of the book"><img src={linkIcon.src} alt="Book source"/><p>Get</p></button></a>
                    </Show>
                    <a href="add" id="add"><button aria-label="Add a custom book" title="Add a custom book (leaves page)"><img src={plusIcon.src} alt="Add book"/><p>Add</p></button></a>
                </div>
                
            </div>
        </div>
    )
}