import { createSignal, For, Show } from "solid-js";
import {BOOKS, Randomizer} from "../../scripts/Randomizer";
import type {Chapter, Task} from "../../scripts/Randomizer";

export function OutputCard(){
    const [book, setBook] = createSignal(BOOKS[0])
    const [chapter, setChapter] = createSignal({
        fullname: "No chapter",
        number: 0,
        tasks: new Array<Task>()
    })
    const [task, setTask] = createSignal({
        task: 0,
        section: "Undefined"
    })
    
    const randomizer : Randomizer = new Randomizer(book());

    function random(memorize: Boolean){
        randomizer.setNew(memorize);
        setChapter(randomizer.getChapter());
        setTask(randomizer.getTask());
    }

    return (
        <div class="output-card">
			<h2 id="chapter">{chapter().fullname}</h2>
			<h3 id="output">{chapter().number + "." + task().task}</h3>
			<div id="buttons">
				<button aria-label="randomize" id="random" onclick={(event) => {random(false)}}><img src="/src/assets/refresh.svg" /></button>
				<button aria-label="completed" id="done" onclick={(event) => {random(true)}}>
                    <img src="/src/assets/tick.svg" />
                    <img src="/src/assets/refresh.svg" />
                </button>
				<button aria-label="reset book" id="reset" onclick={(event) => {randomizer.resetSpentTasks()}}><img src="/src/assets/trash.svg" /></button>
			</div>

			<div id="checkboxes">
				<h4>Filter chapters:</h4>
                <For each={book().chapters}>
                    {(chapter) => <input type="checkbox" checked onchange={(event) => {
                        if (!event.target.checked){
                            randomizer.addToFilter(chapter);
                        } else {
                            randomizer.removeFromFilter(chapter);
                        }}} />}
                </For>
			</div>

			<h4>Choose book:</h4>
			<select id="course-select" name="course" />
		</div>
    )
}