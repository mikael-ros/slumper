import type {Book, Chapter, Task} from "./Randomizer.ts";

/**
 * @returns The raw value of the key spent, without any safety
 */
function getRawSpent(){
    return localStorage.getItem("spent");
}

/**
 * @returns Wheter or not the key spent is empty
 */
function spentIsEmpty() : Boolean{
    return getRawSpent() == null;
}

/**
 * @returns The whole memory
 */
function getSpentTasks() : Book[]{
    if (spentIsEmpty()) {
        setSpentTasks(new Array<Book>);
    }
    return JSON.parse(getRawSpent()!) 
}

/**
 * Sets the whole memory at once
 * @param spentTasks The value to override the current with
 */
function setSpentTasks(spentTasks: Book[]){
    localStorage.setItem("spent", JSON.stringify(spentTasks));
}

/**
 * @param book The book queried
 * @returns Wheter or not book is currently registered in the memory
 */
function spentIsEmptyFromBook(book: Book) : Boolean{
    return getSpentTasks().find((spentBook) => spentBook.name == book.name) == undefined;
}

/**
 * @param book The book queried
 * @returns The spent tasks corresponding the book
 */
export function getSpentTasksFromBook(book: Book) : Book{
    if (spentIsEmptyFromBook(book)){
        addBook(book);
    }

    return getSpentTasks().find((spentBook) => spentBook.name == book.name)!;
}

/**
 * @param book The book which the chapter calls "home"
 * @param chapter The chapter queried
 * @returns The spent tasks from that chapter
 */
export function getSpentTasksFromChapter(book: Book, chapter: Chapter) : Task[]{
    var spentTasks : Book = getSpentTasksFromBook(book);
    if (spentIsEmptyFromChapter(book, chapter)){
        addChapter(book, chapter);
    }

    return spentTasks.chapters.find((spentChapter) => spentChapter.number == chapter.number)!.tasks;
}

/**
 * Adds a new empty book
 * @param book The book added
 */
function addBook(book: Book){
    setBook({
        name: book.name,
        previewImagePath: book.previewImagePath,
        chapters: new Array<Chapter>()
    });
}

/**
 * Simply calls addBook(book) to reset the book, as addBook will override the book.
 * @param book The book to be reset
 */
export function resetSpentTasksFromBook(book: Book){
    addBook(book);
}

/**
 * @param book The book to be added to
 * @param chapter The chapter to be added
 */
function addChapter(book: Book, chapter: Chapter){
    setChapter(book, {
        fullname: chapter.fullname,
        number: chapter.number,
        tasks: []
    })
}

/**
 * Overwrites the memory for a book
 * @param book The book to be set
 */
function setBook(book: Book){
    var spentTasks: Book[] = getSpentTasks();
    const bookIndex = spentTasks.findIndex((spentBook) => spentBook.name == book.name);
    if (bookIndex == -1){
        spentTasks.push(book);
    } else {
        spentTasks[bookIndex] = book;
    }
    setSpentTasks(spentTasks);
}

/**
 * Overwrites the chapter in memory
 * @param book The book to be overwritten to
 * @param chapter The chapter to be overwritten to
 */
function setChapter(book: Book, chapter: Chapter){
    var spentTasks : Book = getSpentTasksFromBook(book);
    spentTasks.chapters.push(chapter);
    setBook(spentTasks);
}

function spentIsEmptyFromChapter(book: Book, chapter: Chapter) : Boolean{
    return getSpentTasksFromBook(book).chapters.find((spentChapter) => spentChapter.number == chapter.number) == undefined;
}

/**
 * Adds a task to the spent memory
 * @param book The book added to
 * @param chapter The chapter the task belongs to
 * @param task The task
 */
export function addSpentTaskToBook(book: Book, chapter: Chapter, task: Task){
    var spentTasks : Book = getSpentTasksFromBook(book);
    
    spentTasks.chapters.find((spentChapter) => spentChapter.number == chapter.number)!.tasks.push(task);

    setBook(spentTasks);
}