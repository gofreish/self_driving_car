import { lerp } from "../utils/utils";
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

    static mutate(network: NeuralNetwork|undefined, amount: number=1){
        if(!network) return;
        for (let l = 0; l < network.levels.length; l++) {
            for (let b = 0; b < network.levels[l].biases.length; b++) {
                network.levels[l].biases[b] = lerp(
                    network.levels[l].biases[b],
                    Math.random()*2-1,
                    amount
                );
            }
            for (let i = 0; i < network.levels[l].weights.length; i++) {
                for (let j = 0; j < network.levels[l].weights[i].length; j++) {
                    network.levels[l].weights[i][j] = lerp(
                        network.levels[l].weights[i][j],
                        Math.random()*2-1,
                        amount
                    );
                }
            }
        }
    }

    static compare(network1: NeuralNetwork|undefined, network2: NeuralNetwork|undefined){
        if(!network1 || !network2) return;
        for (let l = 0; l < network1.levels.length; l++) {
            //biais
            for (let b = 0; b < network1.levels[l].biases.length; b++) {
                if(network1.levels[l].biases[b] != network2.levels[l].biases[b]){
                    console.log("N1 != N2");
                    console.log(`${network1.levels[l].biases[b]} != ${network2.levels[l].biases[b]}`);
                }
            }

            //weight
            for (let i = 0; i < network1.levels[l].weights.length; i++) {
                for (let j = 0; j < network1.levels[l].weights[i].length; j++) {
                    if( network1.levels[l].weights[i][j] != network2.levels[l].weights[i][j]){
                        console.log("N1 != N2");
                        console.log(`${network1.levels[l].weights[i][j]} != ${network2.levels[l].weights[i][j]}`);
                    }
                }
                
            }
        }
    }
}