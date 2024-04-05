import FMAB20 from '../content/tasks/manssonlinalg.json';

export function getRandomChapter(includedChapters : number[]){
    var filtered = FMAB20.filter((chapter) => includedChapters.indexOf(chapter.chapter.number) > -1);
    return filtered[Math.floor(Math.random() * filtered.length)]; // First gets a random chapter from the book
}

export function getRandomTaskInChapter(chapter: any){
    return chapter.tasks[Math.floor(Math.random() * chapter.tasks.length)]; // Then a random task in that chapter
}

class OutputCard extends HTMLElement {
    course: String;
    
    taskOutput: HTMLElement;
    chapterOutput: HTMLElement;
    button: HTMLElement;
    selector: HTMLElement;

    checkboxes: HTMLInputElement[];


    constructor () {
        super();
        this.course = "No course selected";

        this.taskOutput = this.querySelector('#output')!;
        this.chapterOutput = this.querySelector('#chapter')!;
        this.button = this.querySelector('#random')!;  
        this.selector = this.querySelector('#course-select')!;
        this.course = this.selector.value;

        this.button.addEventListener("click", () => {this.getRandom()});

        this.checkboxes = [];

        FMAB20.forEach((chapter) => this.checkboxes.push(document.createElement("input")));
        this.checkboxes.forEach((checkbox) => {
            checkbox.setAttribute("type", "checkbox");
            checkbox.checked = true;
            this.appendChild(checkbox)
        });
    }

    getRandom(){
        var currentChapter = getRandomChapter(this.checkboxes.filter((box) => box.checked).map((box) => this.checkboxes.indexOf(box) + 1));
        var currentTask = getRandomTaskInChapter(currentChapter);

        this.taskOutput.textContent = currentChapter.chapter.number + "." + currentTask.task;
        this.chapterOutput.textContent = currentChapter.chapter.fullname;
    }
}

customElements.define('output-card', OutputCard);


