export enum ControlType{
    AI,
    KEYS,
    DUMMY    
}

export class Control{
    foward: boolean = false;
    left: boolean = false;
    right: boolean = false;
    reverse: boolean = false;

    constructor(controlType: ControlType){
        switch(controlType){
            case ControlType.KEYS:
                this.addKeyboardListener();
                break;
            case ControlType.DUMMY:
                this.foward=true;
                break;
        }
    }

    private addKeyboardListener(){
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowUp":
                    this.foward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
            }
        }
        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowUp":
                    this.foward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
            }
        }
    }
}