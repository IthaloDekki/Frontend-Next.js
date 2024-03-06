interface ITask{
    readonly id: number;
    text: string;
    checked: boolean;
    labelId: number;
}

export class Task implements ITask{
    readonly id: number;
    text: string;
    checked: boolean;
    labelId: number;

    constructor(id:number, text:string, checked:boolean, labelId: number) {
        this.id = id
        this.text = text
        this.checked = checked
        this.labelId = labelId
    }
}