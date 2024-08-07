export interface Task {
    task: number;
}

export interface Chapter {
    fullname: string;
    number: number;
    tasks: Task[];
}

export interface Book {
    name: string;
    previewImagePath: string;
    source: string;
    chapters: Chapter[];
    generatorVersion: string;
    custom: boolean;
    id: string;
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
export function generateBook(input: Map<string, number>, bookName: string, bookPreviewImagePath: string, source: string, custom: boolean){
    const generatorVersion = "1.0.3";
    
    var parsedChapters: Chapter[] = [];
    var currentIndex = 1;
    input.forEach((length, chapter) => {
        var taskList: number[] = Array.from({length: length}, (_, i) => i + 1);
        var processedTasks: Task[] = [];

        taskList.forEach((task) => processedTasks.push({task: task}));
        var chapterObj: Chapter = {
            fullname: chapter,
            number: currentIndex,
            tasks: processedTasks
        };
        parsedChapters.push(chapterObj);
        currentIndex += 1;
    });

    var book: Book =  {
        name: bookName,
        previewImagePath: bookPreviewImagePath,
        source: source,
        chapters: parsedChapters,
        generatorVersion: generatorVersion,
        custom: custom,
        id: bookName + ":" + custom
    }
    return book;
}

export function exportBook(book: Book) {
    // https://www.30secondsofcode.org/js/s/json-to-file/
    const blob = new Blob([JSON.stringify(book, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.name.replaceAll(/[^a-zA-Z0-9]/g,"").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export function exportAndGenerateBook(input: Map<string, number>, bookName: string, bookPreviewImagePath: string, source: string){
    exportBook(generateBook(input,bookName,bookPreviewImagePath,source,true));
}