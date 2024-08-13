import type {Book, Chapter, Task} from "./BookGenerator.ts";
import {addSpentTaskToBook, getSpentTasksFromBook, getSpentTasksFromChapter, resetSpentTasksFromBook, dummyChapter, dummyTask} from "./Books.ts";

export class Randomizer{
    book: Book;
    disclude: Set<Number> = new Set<Number>();
    spentTasks: Book;

    filteredChapters: Chapter[];

    currentChapter: Chapter;
    currentTask: Task;

    constructor(book: Book){
        this.book = book;
        this.setInitialSpent();

        this.currentTask = dummyTask;
        this.currentChapter = dummyChapter;
        this.filteredChapters = book.chapters;
        this.updateFilteredChapters();
        [this.currentChapter, this.currentTask] = this.getNew(false);
        this.spentTasks = this.getSpentTasks();
    }

    updateFilteredChapters(){
        this.filteredChapters = this.book.chapters.filter((chapter) => !this.disclude.has(chapter.number));
    }

    updateFilter(newDisclude: Set<Number>){
        this.disclude = newDisclude;
        this.updateFilteredChapters();
    }
    
    addToFilter(chapter: Chapter){
        this.updateFilter(this.disclude.add(chapter.number));
    }

    resetFilter(){
        this.updateFilter(new Set);
    }
    
    removeFromFilter(chapter: Chapter){
        this.disclude.delete(chapter.number)
        this.updateFilteredChapters();
    }

    setInitialSpent(){
        this.book.chapters.forEach(chapter => {if (this.chapterIsSpent(chapter)) {this.addToFilter(chapter)}});
    }

    /**
     * Gets a new random task and chapter
     * @returns A new chapter and task
     */
    getNew(memorize: Boolean) : [Chapter, Task] {
        if (memorize && this.currentTask != dummyTask){
            addSpentTaskToBook(this.book, this.currentChapter, this.currentTask);
        }
        const chapter: Chapter = this.getRandomChapter();
        return [chapter, this.getRandomTaskInChapter(chapter)];
    }

    setNew(memorize: Boolean) {
        [this.currentChapter, this.currentTask] = this.getNew(memorize);
    }

    getRandomChapter() : Chapter{
        return this.filteredChapters.length > 0 
        ? this.filteredChapters[Math.floor(Math.random() * this.filteredChapters.length)]
        : this.currentChapter; // Return an empty dummy chapter when there are no chapters left (usually due to exhaustion)
    }

    getRandomTaskInChapter(chapter: Chapter) : Task{
        const spentTasksFromChapter = getSpentTasksFromChapter(this.book, chapter);
        if (this.chapterIsSpent(chapter)){
            this.addToFilter(chapter);
            return dummyTask;
        } else {
            const filteredTasks: Task[] = chapter.tasks.filter((task) => spentTasksFromChapter.find((spentTask) => spentTask.task == task.task) == undefined);
            return filteredTasks[Math.floor(Math.random() * filteredTasks.length)];
        }
    }

    chapterIsSpent(chapter: Chapter){
        const spentTasksFromChapter = getSpentTasksFromChapter(this.book, chapter);
        return spentTasksFromChapter.length >= chapter.tasks.length;
    }

    getSpentTasks() : Book {
        return getSpentTasksFromBook(this.book);
    }

    updateSpentTasks() {
        this.spentTasks = this.getSpentTasks();
    }

    resetSpentTasks() {
        resetSpentTasksFromBook(this.book);
        this.resetFilter();
        this.updateSpentTasks();
        this.setInitialSpent();
    }

    getTask() : Task {
        return this.currentTask;
    }

    getChapter() : Chapter {
        return this.currentChapter;
    }

}