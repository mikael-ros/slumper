import { createSignal, For, onMount, Show } from "solid-js";
import { Randomizer} from "../../scripts/Randomizer";
import { Timer } from "./Timer.tsx";
import complete from "../../assets/complete.wav";

import type {Book, Chapter, Task} from "../../scripts/Books.ts";
import {library, dummyChapter, dummyTask, getBook} from "../../scripts/Books.ts";
import {getSetOrElse, set} from "../../scripts/StorageHandler.ts";

export function OutputCard(){
    var defaultTimer : number = 180;
    const completionSound = new Audio(complete);
    completionSound.volume = 0.1; // replace with volume output

    const [displayTimer, setDisplayTimer] = createSignal(false);
    const [timer, setTimer] = createSignal(defaultTimer, { equals: false });

    const [book, setBook] = createSignal<Book>(getBook(getSetOrElse("prior", library[0].name)));
    const [chapter, setChapter] = createSignal(dummyChapter);
    const [task, setTask] = createSignal(dummyTask);
    const [unchecked, setUnchecked] = createSignal<Set<Number>>(new Set<Number>);
    const [abort, setAbort] = createSignal(false);


    var randomizer : Randomizer = new Randomizer(book());

    document.body.style.backgroundImage = "url(" + book().previewImagePath + ")"; 

    function setNewBook(book : Book){
        setBook(book);
        set("prior", book.name);
        randomizer = new Randomizer(book);
        document.body.style.backgroundImage = "url(" + book.previewImagePath + ")"; 
        setChapter(dummyChapter);
        setTask(dummyTask);
        setUnchecked(new Set<Number>);
        updateChecks();
        random(false);
    }

    function random(memorize: Boolean){
        randomizer.setNew(memorize);
        setChapter(randomizer.getChapter());
        setTask(randomizer.getTask());
        updateChecks();
        setTimer(defaultTimer);
        if (memorize)
            completionSound.play();
    }

    function setNewTimer(timer : number){
        defaultTimer = timer;
        setTimer(timer);
    }

    onMount(() => {
        random(false);
    })

    function updateChecks(){
        var unchecked : Set<Number> = new Set<Number>();
        book().chapters.forEach((chapter) => {if (randomizer.chapterIsSpent(chapter)){
            unchecked.add(chapter.number);
        }});
        setUnchecked(unchecked);
        
        setAbort(unchecked.size == book().chapters.length || randomizer.disclude.size == book().chapters.length);
    }

    function filtered(chapter: Chapter){
        return !unchecked().has(chapter.number) && !randomizer.disclude.has(chapter.number);
    }

    function warn(valid: boolean, event){
        event.target.style.color = valid ? "var(--text-color-negative)" : "red";
    }

    function handleInput(event){
        const number = event.target.value.length != 0 ? parseInt(event.target.value) : defaultTimer; 
        const valid = !Number.isNaN(number) && number > 0 && number <= 3600;
        warn(valid, event);
    }

    function handleChange(event){
        const number = event.target.value.length != 0 ? parseInt(event.target.value) : defaultTimer; // Makes sure empty input is handled correctly
        const valid = !Number.isNaN(number) && number > 0 && number <= 3600;
        
        if (valid && number != defaultTimer) // Only set a number if it is non negative and actually a number, and if it is actually changed
            setNewTimer(number)
        warn(valid, event);
    }

    return (
        <div class="card-group">
            <div class ="card small timer">
                <div style={  "height: " + (displayTimer() ? "3em" : "0em") + ";"
                            + " transition-property: height;"
                            + " transition-duration: var(--transition-duration-medium);"}>
                    <Show when={displayTimer()}>
                        <Timer time={timer()}/>
                    </Show>
                </div>
                <div id="timer-config">
                    <button style={displayTimer() ? "width: 70%;" : "width: 100%"} aria-label="toggle timer" id="toggle" onclick={event => setDisplayTimer(!displayTimer())}><img src="/src/assets/timer.svg" /><p>Toggle timer</p></button>
                    <Show when={displayTimer()}>
                        <input placeholder={timer().toString()} 
                        onchange={event => handleChange(event)} 
                        oninput={event => handleInput(event)}
                            /><p>seconds</p>
                    </Show>
                </div>
            </div>
            
            <div class="card output">
                <h2 id="chapter">{chapter().fullname}</h2>
                <h3 id="output">{(book().chapters.length > 1 ? chapter().number + "." : "") + task().task}</h3>
                <div id="buttons">
                    <button class="icon-only" aria-label="randomize" id="random" 
                    onclick={event => random(false)} 
                    disabled={abort()}>
                        <img src="/src/assets/refresh.svg" />
                    </button>
                    <button class="icon-only" aria-label="completed" id="done" 
                    onclick={event => random(true)} 
                    disabled={abort()}>
                        <img src="/src/assets/tick.svg" />
                        <img src="/src/assets/refresh.svg" />
                    </button>
                    <button class="icon-only" aria-label="reset book" id="reset" 
                    onclick={(event) => {randomizer.resetSpentTasks(); random(false)}}>
                        <img src="/src/assets/trash.svg" />
                    </button>
                </div>

                <Show when={book().chapters.length > 1}>
                    <div >
                        <h4>Filter chapters:</h4>
                        <div id="checkboxes">
                            <For each={book().chapters}>
                                {(chapter) => 
                                    <input type="checkbox" 
                                    disabled={unchecked().has(chapter.number)} 
                                    checked={filtered(chapter)} 
                                    onchange={(event) => {
                                        if (filtered(chapter)){
                                            randomizer.addToFilter(chapter);
                                        } else {
                                            randomizer.removeFromFilter(chapter);
                                        }
                                        updateChecks();
                                    }} />
                                }
                            </For>
                        </div>
                    </div>
                </Show>

                <h4>Choose book:</h4>
                <div id="course-select-wrapper">
                    <select id="course-select" name="course" onchange={(event) => {setNewBook(JSON.parse(event.target.value))}}>
                        <option value={JSON.stringify(book())}>{book().name}</option>
                        <For each={library.filter((_book) => _book.name != book().name)}>
                            {(book) =>
                                <option value={JSON.stringify(book)}>{book.name}</option>
                            }
                        </For>
                    </select>
                    <a href="add"><button aria-label="add book" id="add"><img src="/src/assets/plus.svg" /><p>Add</p></button></a>
                </div>
                
            </div>
        </div>
    )
}