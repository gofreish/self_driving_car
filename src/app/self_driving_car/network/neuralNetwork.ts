import { Level } from "./level";

export enum Brains{
    AI,
    DUMMY
}

export class NeuralNetwork{

    levels: Level[];

    constructor(neuralCounts: number[]){
        this.levels = [];
        for (let i = 0; i < neuralCounts.length-1; i++) {
            
            this.levels.push(
                new Level(neuralCounts[i], neuralCounts[i+1])
            );
            
        }
    }

    static feedFoward(givenInputs: number[], network: NeuralNetwork): number[]{
        let output: number[] = Level.feedFoward(givenInputs, network.levels[0]);

        for (let i = 1; i < network.levels.length; i++) {
            output = Level.feedFoward(output, network.levels[i]);
        }
        return output;
    }
}