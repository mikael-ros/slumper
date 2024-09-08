/** A task is just a synonym for a number, really. The interface is just here for readability, and possibility for expansion */
export interface Task {
    task: number;
}

/** A chapter is a name, a number id, and a list of tasks */
export interface Chapter {
    fullname: string;
    number: number;
    tasks: Task[];
}

/** A book is mainly just it's name, the background image and a list of chapters. Amongst those are some more properties that are useful behind the scenes */
export interface Book {
    name: string;
    previewImagePath: string;
    source: string;
    chapters: Chapter[];
    generatorVersion: string; // Tracks which version of the generator generated the book. Useful in case I end up making feature breaking changes later on
    custom: boolean; // Whether the book was user created. Used to seperate books, so a user can't break the tool by naming their book the same as an included one
    id: string; // An id for the book, based on the name and the custom value
}

/**
 * Generates a book
 * @param input The book represented as a map of strings to chapter numbers
 * @param bookName The name of the book
 * @param bookPreviewImagePath The URL of the image used
 * @param source Where you can acquire the book
 * @param custom Wheter the book is a result of user generation
 * @returns The book object
 */
export function generateBook(input: [string, number][], bookName: string, bookPreviewImagePath: string, source: string, custom: boolean){
    const generatorVersion = "1.0.5";
    
    var parsedChapters: Chapter[] = [];

    input.forEach(chapter => { // For every chapter given
        var taskList: Task[] = Array.from({length: chapter[1]}, (_, i) => {return {task: i + 1}}); // Create an array of tasks

        var chapterObj: Chapter = {
            fullname: chapter[0],
            number: 0,
            tasks: taskList
        };
        parsedChapters.push(chapterObj);
    });
    parsedChapters.forEach(chapter => chapter.number = parsedChapters.indexOf(chapter) + 1); // Set the numbers based on index automatically 

    var book: Book =  {
        name: bookName,
        previewImagePath: bookPreviewImagePath,
        source: source,
        chapters: parsedChapters,
        generatorVersion: generatorVersion,
        custom: custom,
        id: bookName + (custom ? ":[P]" : "")
    }
    return book;
}

/**
 * Exports a book to a JSON file
 * @param book The book to be exported
 */
export function exportBook(book: Book) {
    // https://www.30secondsofcode.org/js/s/json-to-file/
    const blob = new Blob([JSON.stringify(book, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.name.replaceAll(/[^a-zA-Z0-9]/g,"").toLowerCase()}.json`; // Creates a compliant file name automatically
    a.click();
    URL.revokeObjectURL(url);
}

export function exportAndGenerateBook(input: [string, number][], bookName: string, bookPreviewImagePath: string, source: string){
    exportBook(generateBook(input,bookName,bookPreviewImagePath,source,true));
}