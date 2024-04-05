import { writeFile } from 'fs/promises';

interface Task {
    task: number;
    section: string;
}

interface Chapter {
    fullname: String;
    number: number;
}

interface ChapterWithTasks {
    chapter: Chapter;
    tasks: Task[];
}

export default async function generateJSON(input: Map<String, number>, outputPath: String){
    var chapters: ChapterWithTasks[] = [];
    var currentIndex = 1;
    input.forEach((length, chapter) => {
        var taskList: number[] = Array.from({length: length}, (_, i) => i + 1);
        var processedTasks: Task[] = [];

        taskList.forEach((task) => processedTasks.push({task: task, section: "Undefined"}));
        var chapterObj: Chapter = {
            fullname: chapter,
            number: currentIndex
        };
        chapters.push({
            chapter: chapterObj,
            tasks: processedTasks
        })
        currentIndex += 1;
    });

    try {
        await writeFile(outputPath+".json", JSON.stringify(chapters));
        console.log('JSON file saved successfully:', outputPath);
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

var manssonlinalg = new Map<String, number>();
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

generateJSON(manssonlinalg, "manssonlinalg");