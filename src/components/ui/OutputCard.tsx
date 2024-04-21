import { createSignal, For, Show } from "solid-js";
import {BOOKS, Randomizer} from "../../scripts/Randomizer";

export function OutputCard(){
    const [book, setBook] = createSignal(BOOKS[0])
    const [chapter, setChapter] = createSignal("No chapter")
    const [task, setTask] = createSignal("No task")
    
    const randomizer : Randomizer = new Randomizer(book());

    function random(memorize: Boolean){
        randomizer.getNew(memorize);
        setChapter(randomizer.getChapter().fullname);
        setTask(randomizer.getTask().task.toString());
    }

    return (
        <div class="output-card">
			<h2 id="chapter">{chapter()}</h2>
			<h3 id="output">{task()}</h3>
			<div id="buttons">
				<button aria-label="randomize" id="random" onclick={(event) => {random(false)}}><img src="/src/assets/refresh.svg" /></button>
				<button aria-label="completed" id="done" onclick={(event) => {random(false)}}>
                    <img src="/src/assets/tick.svg" />
                    <img src="/src/assets/refresh.svg" />
                </button>
				<button aria-label="reset book" id="reset" onclick={(event) => {randomizer.resetSpentTasks()}}><img src="/src/assets/trash.svg" /></button>
			</div>

			<div id="checkboxes">
				<h4>Filter chapters:</h4>
			</div>

			<h4>Choose book:</h4>
			<select id="course-select" name="course" />
		</div>
    )
}