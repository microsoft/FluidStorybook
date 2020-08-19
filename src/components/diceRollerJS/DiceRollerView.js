/**
 * The entirety of the View logic is encapsulated within the App.
 * The App uses the provided model to interact with Fluid.
 */

export function DiceRollerView(model, contentDiv) {
    let diceChar = null;
    let diceColor = null;
    let diceRollerDiv = null;

    const onDiceRolled = () => {
        const diceValue = model.value;
        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        diceChar = String.fromCodePoint(0x267F + diceValue);
        diceColor = `hsl(${diceValue * 60}, 70%, 50%)`;
        updateDOM();
    };

    const updateDOM = () => {
        document.title = `${diceChar} - ${model.id}`;
        // <h1>ID: ${model.id}</h1>
        let html = `
            <div style="font-size: 200px; color: ${diceColor}">${diceChar}</div>
        `;
        diceRollerDiv.innerHTML = html;
    }     

    const render = () => {
        diceRollerDiv = document.createElement('div');
        contentDiv.appendChild(diceRollerDiv);
        contentDiv.appendChild(createButton());
        // Listen for changes to DiceRoller values
        model.on("diceRolled", onDiceRolled);
        // Trigger initial roll
        model.roll();
    }

    const createButton = () => {
        let button = document.createElement("button");
        button.style.fontSize = "50px";
        button.style.marginLeft = "10px";
        button.innerText = "Roll";
        button.addEventListener('click', () => model.roll());
        return button;
    }

    return {
        render
    };
}

// DOM class example (if preferred over functions)

// export class DiceRollerView {
//     // model is our DiceRoller Fluid DataObject
//     constructor(model, contentDiv) {
//         this.model = model;
//         this.diceChar = null;
//         this.diceColor = null;
//         this.diceRollerDiv = document.createElement('div');
//         contentDiv.appendChild(this.diceRollerDiv);
//         contentDiv.appendChild(this.createButton());

//         // Listen for changes to DiceRoller values
//         model.on("diceRolled", () => this.onDiceRolled());
//         // To remove listener
//         // model.off("diceRolled", this.onDiceRolled);
//         this.model.roll();
//     }

//     onDiceRolled() {
//         const diceValue = this.model.value;
//         // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
//         this.diceChar = String.fromCodePoint(0x267F + diceValue);
//         this.diceColor = `hsl(${diceValue * 60}, 70%, 50%)`;
//         this.render();
//     };

//     render() {
//         document.title = `${this.diceChar} - ${this.model.id}`;
//         let html = `
//             <h1>ID: ${this.model.id}</h1>
//             <div style="font-size: 200px; color: ${this.diceColor}">${this.diceChar}</div>
//         `;
//         this.diceRollerDiv.innerHTML = html;
//     }     

//     createButton() {
//         let button = document.createElement("button");
//         button.style.fontSize = "50px";
//         button.innerText = "Roll";
//         button.addEventListener('click', () => this.model.roll());
//         return button;
//     }
// }
