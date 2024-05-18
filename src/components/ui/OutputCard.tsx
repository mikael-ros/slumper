import { createSignal, For, onMount, Show } from "solid-js";
import { Randomizer} from "../../scripts/Randomizer";

import type {Book, Chapter, Task} from "../../scripts/Books.ts";
import {library, dummyChapter, dummyTask, getBook} from "../../scripts/Books.ts";
import {getSetOrElse, set} from "../../scripts/StorageHandler.ts";

export function OutputCard(){
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

    return (
        <div class="card output">
			<h2 id="chapter">{chapter().fullname}</h2>
			<h3 id="output">{chapter().number + "." + task().task}</h3>
			<div id="buttons">
				<button class="icon-only" aria-label="randomize" id="random" onclick={(event) => {random(false)}} disabled={abort()}><img src="/src/assets/refresh.svg" /></button>
				<button class="icon-only" aria-label="completed" id="done" onclick={(event) => {random(true)}} disabled={abort()}>
                    <img src="/src/assets/tick.svg" />
                    <img src="/src/assets/refresh.svg" />
                </button>
				<button class="icon-only" aria-label="reset book" id="reset" onclick={(event) => {randomizer.resetSpentTasks(); random(false)}}><img src="/src/assets/trash.svg" /></button>
			</div>

			<div >
				<h4>Filter chapters:</h4>
                <div id="checkboxes">
                    <For each={book().chapters}>
                        {(chapter) => <input type="checkbox" disabled={unchecked().has(chapter.number)} checked={filtered(chapter)} onchange={(event) => {
                            if (filtered(chapter)){
                                randomizer.addToFilter(chapter);
                            } else {
                                randomizer.removeFromFilter(chapter);
                            }
                            updateChecks();}} />}
                    </For>
                </div>
			</div>

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
    )
}