import FMAB20 from '../content/tasks/manssonlinalg.json';

export function getRandomChapter(excludedChapters : number[]){
    var filtered = FMAB20.filter((chapter) => !(excludedChapters.indexOf(chapter.chapter.number) > -1));
    return filtered[Math.floor(Math.random() * filtered.length)]; // First gets a random chapter from the book
}

export function getRandomTaskInChapter(chapter: any){
    return chapter.tasks[Math.floor(Math.random() * chapter.tasks.length)]; // Then a random task in that chapter
}

class Checkbox extends HTMLElement {
    constructor () {
        super();
        var box = document.createElement("input");
        box.setAttribute("type", "checkbox");
        this.appendChild(box);
    }
}

class OutputCard extends HTMLElement {
    constructor () {
        super();
        var course : String = "No course selected";
        var excludedChapters : number[] = [];

        const taskOutput = this.querySelector('#output')!;
        const chapterOutput = this.querySelector('#chapter')!;
        const button = this.querySelector('#random')!;  
        const selector = this.querySelector('#course-select')!;
        course = selector.value;

        button.addEventListener("click", () => {
            var currentChapter = getRandomChapter(excludedChapters);
            var currentTask = getRandomTaskInChapter(currentChapter);

            taskOutput.textContent = currentChapter.chapter.number + "." + currentTask.task;
            chapterOutput.textContent = currentChapter.chapter.fullname;
        });

        var checkboxes: Element[] = [];
        FMAB20.forEach((chapter) => checkboxes.push(new Checkbox()));
        checkboxes.forEach((checkbox) => this.appendChild(checkbox));

        
    }
}

customElements.define('checkbox-element', Checkbox);
customElements.define('output-card', OutputCard);


