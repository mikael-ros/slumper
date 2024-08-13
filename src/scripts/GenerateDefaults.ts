// This file is to be run locally.
import { writeFile } from 'fs/promises';
/**
 * Generates a book
 * @param input The book represented as a map of strings to chapter numbers
 * @param bookName The name of the book
 * @param bookPreviewImagePath The URL of the image used
 * @param source Where you can acquire the book
 * @returns The book object
 */
export function generateBook(input: Map<string, number>, bookName: string, bookPreviewImagePath: string, source: string){
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
        custom: false,
        id: bookName + ":" + false
    }
    return book;
}

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

async function writeBook(book: Book){
    try {
        await writeFile("../content/tasks/" + book.name.replaceAll(/[^a-zA-Z0-9]/g,"").toLowerCase()+".json", JSON.stringify(book));
        console.log('JSON file saved successfully:', book.name);
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

export default async function generateDefaultLibrary(){
    const PGK1_2022 = new Map<string,number>([
        ["Introduktion", 37],
        ["Program och kontrollstrukturer", 18],
        ["Funktioner och abstraktion", 19],
        ["Objekt och inkapsling", 20],
        ["Klasser och datamodellering", 17],
        ["Mönster och felhantering", 22],
        ["Sekvenser och enumerationer", 27],
    ]) 

    const PGK2_2022 = new Map<string,number>([
        ["Nästlade och generiska strukturer", 10],
        ["Mängder och tabeller", 14],
        ["Arv och komposition", 12],
        ["Kontextuella abstraktioner och varians", 9],
    ]) 

    const programmingInHaskell = new Map<string,number>([
        ["Introduction", 5],
        ["First steps", 5],
        ["Types and classes", 5],
        ["Defining functions", 8],
        ["List comprehensions", 10],
        ["Recursive functions", 9],
        ["Higher-order functions", 10],
        ["Declaring types and classes", 9],
        ["The countdown problem", 6],
        ["Interactive programming", 6],
        ["Unbeatable tic-tac-toe", 4],
        ["Monads and more", 8],
        ["Monadic parsing", 9],
        ["Foldables and friends", 5],
        ["Lazy evaluation", 6],
        ["Reasoning about programs", 9],
        ["Calculating compilers", 1],
    ]) 

    const datakommunikationOchNatverk = new Map<string,number>([
        ["Introduktion", 0],
        ["Information och bitar", 11],
        ["Att skicka signaler på en länk", 18],
        ["Tillförlitlig dataöverföring", 17],
        ["Access till nätet", 10],
        ["Stora datanät", 5],
        ["Internet", 10],
        ["Grunderna för routing", 4],
        ["Routingprotokoll", 3],
        ["Transportprotokoll", 9],
        ["Säker datakommunikation", 0],
        ["Applikationer", 0],
        ["Telekommunikationssystem", 0],
        ["Stamnät", 0],
        ["Internet of Things (IoT)",0],
        ["Prestanda och QoS", 6],
    ]) 

    const toGen = new Map([
        [PGK1_2022, 
            [
                "Introduktion till programmering med Scala, del 1", 
                "https://github.com/lunduniversity/introprog/blob/master/img/compendium-cover-part1-2022.png?raw=true", 
                "https://cs.lth.se/pgk/compendium/"
            ]
        ],
        [PGK2_2022, 
            [
                "Introduktion till programmering med Scala, del 2", 
                "https://github.com/lunduniversity/introprog/blob/master/img/compendium-cover-part2-2022.png?raw=true", 
                "https://cs.lth.se/pgk/compendium/"
            ]
        ],
        [programmingInHaskell, 
            [
                "Programming in Haskell, second edition", 
                "https://www.cs.nott.ac.uk/~pszgmh/pih.jpg", 
                "https://www.amazon.co.uk/Programming-Haskell-Graham-Hutton/dp/1316626229"
            ]
        ],
        [datakommunikationOchNatverk,
            [
                "Datakommunikation och nätverk, andra upplagan",
                "https://www.studentlitteratur.se/globalassets/inriver/resources/978-91-44-13502-1_01_coverimage2.jpg?preset=quality90",
                "https://www.studentlitteratur.se/kurslitteratur/teknik/tele--och-datakommunikation/datakommunikation-och-natverk/?srsltid=AfmBOor6Qss-WlACmeqRhSWCGIEnTvrmREXMb-HaluoK0BmoB3LyzqIg"
            ]
        ]
    ])
    
    toGen.forEach((values, book) => writeBook(generateBook(book,values[0],values[1], values[2])))

}

generateDefaultLibrary();