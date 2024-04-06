import FMAB20 from '../content/tasks/manssonlinalg.json';

interface Task {
    task: number;
    section: string;
}

interface Chapter {
    fullname: string;
    number: number;
    tasks: Task[];
}

export function getRandomChapter(includedChapters : number[]){
    const filtered: Chapter[] = FMAB20.filter((chapter) => includedChapters.indexOf(chapter.number) > -1);
    return filtered[Math.floor(Math.random() * filtered.length)]; // First gets a random chapter from the book
}

export function getRandomTaskInChapter(chapter: Chapter){
    return chapter.tasks[Math.floor(Math.random() * chapter.tasks.length)]; // Then a random task in that chapter
}

class OutputCard extends HTMLElement {
    course: string;
    
    taskOutput: HTMLElement;
    chapterOutput: HTMLElement;
    randButton: HTMLElement;
    doneButton: HTMLElement;
    resetButton: HTMLElement;
    selector: HTMLElement;

    checkboxes: HTMLInputElement[];


    constructor () {
        super();
        this.course = "No course selected";

        this.taskOutput = this.querySelector('#output')!;
        this.chapterOutput = this.querySelector('#chapter')!;
        this.randButton = this.querySelector('#random')!;  
        this.doneButton = this.querySelector('#done')!;  
        this.resetButton = this.querySelector('#reset')!;
        this.selector = this.querySelector('#course-select')!;
        this.course = this.selector.value;

        this.randButton.addEventListener("click", () => {this.getRandom(false)});
        this.doneButton.addEventListener("click", () => {this.getRandom(true)});
        this.resetButton.addEventListener("click", () => {localStorage.removeItem("spent"); this.getRandom(false)});

        this.checkboxes = [];

        FMAB20.forEach((chapter) => this.checkboxes.push(document.createElement("input")));
        this.checkboxes.forEach((checkbox) => {
            checkbox.setAttribute("type", "checkbox");
            checkbox.checked = true;
            this.appendChild(checkbox)
        });
        this.getRandom(false);
    }

    getRandom(remember: boolean){
        var currentChapter = getRandomChapter(this.checkboxes.filter((box) => box.checked).map((box) => this.checkboxes.indexOf(box) + 1));
        var currentTask = getRandomTaskInChapter(currentChapter);

        this.taskOutput.textContent = currentChapter.number + "." + currentTask.task;
        this.chapterOutput.textContent = currentChapter.fullname;
    }
}

customElements.define('output-card', OutputCard);


