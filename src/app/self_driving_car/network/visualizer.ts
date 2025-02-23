import { getRGBA, lerp } from "../utils/utils";
import { Level } from "./level";
import { NeuralNetwork } from "./neuralNetwork";

export class Visualizer{
    static drawNetwork(context: CanvasRenderingContext2D|null, network: NeuralNetwork){
        if(!context) return;
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = context.canvas.width-margin*2;
        const height = context.canvas.height-margin*2;

        const levelHeight = height/network.levels.length;
        for (let i = network.levels.length-1; i >= 0; i--) {
            const levelTop = top+lerp(
                height-levelHeight, 
                0, 
                network.levels.length==1
                ?0.5
                :i/(network.levels.length-1)
            );

            context.setLineDash([7,3]);
            Visualizer.drawLevel(
                context, network.levels[i], 
                left, levelTop, 
                width, levelHeight,
                i==network.levels.length-1 
                ? ['\u2191', '\u2190','\u2192','\u2193']
                : []
            );
        }
    }

    private static drawLevel(context: CanvasRenderingContext2D, level: Level, 
        left: number, top: number, width: number, height: number,
        labels: string[]
    ){
        const right = left+width;
        const bottom = top+height;
        const {inputs, outputs, weights, biases} = level;
        const nodeRadius = 18;
        //Draw connections
        for (let i = 0; i < inputs.length; i++) {
            const inputX = Visualizer.getNodeX(inputs.length, i, left, right);
            for (let j = 0; j < outputs.length; j++) {
                const outputX = Visualizer.getNodeX(outputs.length, j, left, right);
                context.beginPath();
                context.moveTo(inputX, bottom);
                context.lineTo(outputX, top);
                context.lineWidth = 2;
                context.strokeStyle = getRGBA(weights[i][j]);
                context.stroke();
            }            
        }
        //Draw input nodes
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.getNodeX(inputs.length, i, left, right);
            context.beginPath();
            context.arc(x, bottom, nodeRadius, 0, 2*Math.PI);
            context.fillStyle = "black";
            context.fill();
            context.beginPath();
            context.arc(x, bottom, nodeRadius*0.6, 0, 2*Math.PI);
            context.fillStyle = getRGBA(inputs[i]);
            context.fill();
        }
        //Draw outputs nodes
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.getNodeX(outputs.length, i, left, right);
            context.beginPath();
            context.arc(x, top, nodeRadius, 0, 2*Math.PI);
            context.fillStyle = "black";
            context.fill();
            
            context.beginPath();
            context.arc(x, top, nodeRadius*0.6, 0, 2*Math.PI);
            context.fillStyle = getRGBA(outputs[i]);
            context.fill();

            context.beginPath();
            context.arc(x, top, nodeRadius*0.8, 0, 2*Math.PI);
            context.strokeStyle = getRGBA(biases[i]);
            context.setLineDash([3,3]);
            context.stroke();
            context.setLineDash([]);

            if(labels[i]){
                context.beginPath();
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = "black";
                context.strokeStyle = "white";
                context.font = (nodeRadius*2)+'px Arial';
                context.fillText(labels[i], x, top);
                context.lineWidth = 0.5;
                context.strokeText(labels[i], x, top);
            }
        }
    }

    private static getNodeX(total: number, index: number, left: number, right: number){
        return lerp(left, right, 
            total==1 ? 0.5 : index/(total-1)
        );
    }
}