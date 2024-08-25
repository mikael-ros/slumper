import type {Book, Chapter, Task} from "./BookGenerator.ts";
import {addSpentTaskToBook, getSpentTasksFromBook, getSpentTasksFromChapter, resetSpentTasksFromBook, dummyChapter, dummyTask} from "./Books.ts";

/**
 * Randomizes tasks from a book
 */
export class Randomizer{
    book: Book; // The book
    spentTasks: Book; // The corresponding spent tasks from the book
    disclude: Set<Number> = new Set<Number>(); // Which chapters to disclude from the process
    filtered: Set<Number> = new Set<Number>();
    
    filteredChapters: Chapter[]; // The chapters included

    currentChapter: Chapter; // The currently displayed chapter
    currentTask: Task; // The currently displayed task

    constructor(book: Book){
        this.book = book;
        this.currentTask = dummyTask;
        this.currentChapter = dummyChapter;
        this.filteredChapters = book.chapters;
        this.updateFilteredChapters();
        [this.currentChapter, this.currentTask] = this.bookIsSpent() ? [dummyChapter, dummyTask] : this.getNew(false); // If the book is completely exhausted, display dummy tasks
        this.spentTasks = getSpentTasksFromBook(this.book);
    }

    /** Updates the filtered chapters based on disclude and filter */
    updateFilteredChapters(){
        this.book.chapters.forEach(chapter => { // Add any discluded chapters right off the bat
            if (this.chapterIsSpent(chapter))
                this.disclude.add(chapter.number);
        })
        this.filteredChapters = this.book.chapters.filter(chapter => this.chapterIsEnabled(chapter));
    }
    
    /** Discludes a chapter, and then updates the filter based on that */
    addToFilter(chapter: Chapter){
        this.filtered = this.filtered.add(chapter.number);
        this.updateFilteredChapters();
    }
    
    /** Removes a chapter from the disclusion list, and updates the filter */
    removeFromFilter(chapter: Chapter){
        this.filtered.delete(chapter.number)
        this.updateFilteredChapters();
    }

    toggleFilter(chapter: Chapter) {
        if (this.chapterIsFiltered(chapter)) {
            this.removeFromFilter(chapter);
        } else {
            this.addToFilter(chapter);
        }
    }

    /** Resets the disclude list, and updates the filter too */
    resetFilter(){
        this.disclude = new Set;
        this.filtered = new Set;
        this.updateFilteredChapters();
    }

    /** Sets what filters should be discluded based on browser storage, immideately */
    setInitialSpent(){
        this.book.chapters.forEach(chapter => {if (this.chapterIsSpent(chapter)) {this.disclude.add(chapter.number)}});
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

    /** Retrieve a new task, and set it */
    setNew(memorize: Boolean) {
        [this.currentChapter, this.currentTask] = this.getNew(memorize);
    }

    /** Gets a random chapter out of the available chapters */
    getRandomChapter() : Chapter{
        return this.filteredChapters.length > 0 
        ? this.filteredChapters[Math.floor(Math.random() * this.filteredChapters.length)]
        : dummyChapter; // Return dummy chapter if exhausted
    }

    /** Retrieves a random task from a chapter in the book */
    getRandomTaskInChapter(chapter: Chapter) : Task{
        const spentTasksFromChapter = getSpentTasksFromChapter(this.book, chapter);
        if (this.chapterIsSpent(chapter)){
            this.disclude.add(chapter.number);
            return dummyTask; // Return a dummy task if exhausted
        } else {
            const filteredTasks: Task[] = chapter.tasks.filter((task) => spentTasksFromChapter.find((spentTask) => spentTask.task == task.task) == undefined);
            return filteredTasks[Math.floor(Math.random() * filteredTasks.length)];
        }
    }

    /** Checks wheter the length of the corresponding chapter in spent memory is the same length, which would indicate there are no tasks left in said chapter */
    chapterIsSpent(chapter: Chapter){
        const spentTasksFromChapter = getSpentTasksFromChapter(this.book, chapter);
        return spentTasksFromChapter.length >= chapter.tasks.length;
    }

    /** Checks filter status of chapter */
    chapterIsFiltered(chapter: Chapter) : boolean {
        return this.filtered.has(chapter.number);
    }

    /** Checks wether the chapter is discluded*/
    chapterIsDisabled(chapter: Chapter) : boolean {
        return this.disclude.has(chapter.number);
    }

    chapterIsEnabled(chapter: Chapter) : boolean {
        return !this.chapterIsFiltered(chapter) && !this.chapterIsDisabled(chapter);
    }

    /** Checks whether all chapters are spent, which would indicate the book being spent */
    bookIsSpent(){
        return this.book.chapters.every(chapter => this.chapterIsSpent(chapter));
    }

    /** Retrieve new spent tasks */
    updateSpentTasks() {
        this.spentTasks = getSpentTasksFromBook(this.book);
    }

    /** Clear the memory, and update filters */
    resetSpentTasks() {
        resetSpentTasksFromBook(this.book);
        this.resetFilter();
        this.updateSpentTasks();
        this.setInitialSpent();
    }

    /** Retrieves the saved task */
    getTask() : Task {
        return this.currentTask;
    }

    /** Retrieves the saved chapter */
    getChapter() : Chapter {
        return this.currentChapter;
    }

}