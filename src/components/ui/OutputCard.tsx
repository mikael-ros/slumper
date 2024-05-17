import { createSignal, For, onMount, Show } from "solid-js";
import {BOOKS, Randomizer} from "../../scripts/Randomizer";
import type {Chapter, Task} from "../../scripts/Randomizer";

export function OutputCard(){
    const [book, setBook] = createSignal(BOOKS[0]);
    const [chapter, setChapter] = createSignal({
        fullname: "No chapter",
        number: 0,
        tasks: new Array<Task>()
    })
    const [task, setTask] = createSignal({
        task: 0,
        section: "Undefined"
    })
    const [checked, setChecked] = createSignal(new Set<Number>);
    const [abort, setAbort] = createSignal(false);
    
    var randomizer : Randomizer = new Randomizer(book());

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
        var checked : Set<Number> = new Set<Number>();
        book().chapters.forEach((chapter) => {if (randomizer.chapterIsSpent(chapter)){
            checked.add(chapter.number);
        }});
        setChecked(checked);
        
        setAbort(checked.size == book().chapters.length || randomizer.disclude.size == book().chapters.length);
    }

    console.log(randomizer.disclude.size + " " + checked().size + " " + book().chapters.length);

    console.log(checked());
    return (
        <div class="output-card">
			<h2 id="chapter">{chapter().fullname}</h2>
			<h3 id="output">{chapter().number + "." + task().task}</h3>
			<div id="buttons">
				<button aria-label="randomize" id="random" onclick={(event) => {random(false)}} disabled={abort()}><img src="/src/assets/refresh.svg" /></button>
				<button aria-label="completed" id="done" onclick={(event) => {random(true)}} disabled={abort()}>
                    <img src="/src/assets/tick.svg" />
                    <img src="/src/assets/refresh.svg" />
                </button>
				<button aria-label="reset book" id="reset" onclick={(event) => {randomizer.resetSpentTasks(); random(false)}}><img src="/src/assets/trash.svg" /></button>
			</div>

			<div >
				<h4>Filter chapters:</h4>
                <div id="checkboxes">
                    <For each={book().chapters}>
                        {(chapter) => <input type="checkbox" disabled={checked().has(chapter.number)} checked={!(checked().has(chapter.number) || randomizer.disclude.has(chapter.number))} onchange={(event) => {
                            if (!event.target.checked){
                                randomizer.addToFilter(chapter);
                            } else {
                                randomizer.removeFromFilter(chapter);
                            }}} />}
                    </For>
                </div>
			</div>

			<h4>Choose book:</h4>
			<select id="course-select" name="course" onchange={(event) => {
                setBook(JSON.parse(event.target.value));
                randomizer = new Randomizer(book());
                random(false);
                setChecked(new Set<Number>);
                updateChecks();}}>
                <For each={BOOKS}>
                    {(book) =>
                        <option value={JSON.stringify(book)}>{book.name}</option>
                    }
                </For>
            </select>
		</div>
    )
}