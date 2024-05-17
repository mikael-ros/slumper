import { writeFile } from 'fs/promises';

interface Task {
    task: number;
    section: string;
}

interface Chapter {
    fullname: string;
    number: number;
    tasks: Task[];
}

interface Book {
    name: string;
    previewImagePath: string;
    chapters: Chapter[];
}

export default async function generateJSON(input: Map<string, number>, bookName: string, bookPreviewImagePath: string, outputPath: String){
    var parsedChapters: Chapter[] = [];
    var currentIndex = 1;
    input.forEach((length, chapter) => {
        var taskList: number[] = Array.from({length: length}, (_, i) => i + 1);
        var processedTasks: Task[] = [];

        taskList.forEach((task) => processedTasks.push({task: task, section: "Undefined"}));
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
        chapters: parsedChapters
    }

    try {
        await writeFile(outputPath+".json", JSON.stringify(book));
        console.log('JSON file saved successfully:', outputPath);
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

var manssonlinalg = new Map<string, number>();
manssonlinalg.set("Vektorer", 40);
manssonlinalg.set("Vektorer som geometriska objekt", 39);
manssonlinalg.set("Linjära ekvationssystem", 31);
manssonlinalg.set("Matriser", 30);
manssonlinalg.set("Några centrala begrepp inom linjär algebra", 35);
manssonlinalg.set("Determinanter", 33);
manssonlinalg.set("Linjära avbildningar", 18);
manssonlinalg.set("Egenskaper hos linjära avbildningar", 28);
manssonlinalg.set("Bas- och koordinatbyte", 10);
manssonlinalg.set("Egenvektorer och egenvärden", 22);
manssonlinalg.set("Diagonalisering", 16);
manssonlinalg.set("Kapitel B", 32);

generateJSON(manssonlinalg, "Linjär algebra (Månsson; Nordbeck)", "https://s1.adlibris.com/images/50965756/linjar-algebra.jpg", "manssonlinalg");

var fmab20instudering = new Map<string, number>();
fmab20instudering.set("Linjära ekvationssystem", 2);
fmab20instudering.set("Geometriska vektorer", 9);
fmab20instudering.set("Linjer och plan", 11);
fmab20instudering.set("Skalärprodukt", 12);
fmab20instudering.set("Vektorprodukt", 6);
fmab20instudering.set("Rummet R^n", 4);
fmab20instudering.set("Matriser", 22);
fmab20instudering.set("Linjära avbildningar", 10);
fmab20instudering.set("Determinanter", 14);
fmab20instudering.set("Egenvärden och egenvektorer", 4);

generateJSON(fmab20instudering, "FMAB20: Instuderingsfrågor i Linjär algebra; ht 2011", "/src/assets/previews/fmab20instudering.png", "fmab20instudering");

var edaf052023 = new Map<string, number>();
edaf052023.set("EDAF05 example questions 2023",40);

generateJSON(edaf052023, "EDAF05 example questions 2023", "/src/assets/previews/edaf052023.png", "edaf052023");