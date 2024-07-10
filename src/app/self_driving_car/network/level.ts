export class Level{

    inputs: number[];
    outputs: number[];
    biases: number[];
    weights: number[][];

    constructor(inputCount: number, outputCount: number){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = new Array(inputCount);
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
            
        }
        Level.randomize(this);
    }

    private static randomize(level: Level){
        for (let i = 0; i < level.weights.length; i++) {
            for (let j = 0; j < level.weights[i].length; j++) {
                level.weights[i][j] = Math.random()*2-1;
            }            
        }
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random()*2-1;
            
        }
    }

    static feedFoward(givenInputs: number[], level: Level): number[]{
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let j = 0; j < level.outputs.length; j++) {
            let sum = 0;
            for (let i = 0; i < level.inputs.length; i++) {
                sum+=level.inputs[i]*level.weights[i][j]                
            }
            if(sum>level.biases[j])
                level.outputs[j] = 1;
            else
                level.outputs[j] = 0;
        }
        return level.outputs;
    }
}