function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function GenerateBingo() {
    const bingoName = document.querySelector("#bingoName").value;
    const ticketCount = parseInt(document.querySelector("#ticketCount").value, 0);
    const allowedValues = document.querySelector("#allowedValues").value.split("\n");
    const ticketImage = document.querySelector("#ticketImage").value;
    const bingoType = parseInt(document.querySelector('input[name="bingoType"]:checked').value);

    if (!allowedValues || allowedValues.length < 30) {
        alert("É necessário uma lista de, pelo menos, 30 items!");
        return;
    }

    // cleaning output container
    const outputContainer = document.querySelector("#output");
    outputContainer.className = "";
    outputContainer.innerHTML = "";
    outputContainer.classList.add(bingoType === 1 ? "bingo-num" : "bingo-text");

    const generatedBingo = new Bingo(bingoName, bingoType, ticketImage, allowedValues, ticketCount);
    outputContainer.innerHTML = generatedBingo.generateTemplate();
}

class Bingo {
    constructor(name, type, ticketImage, allowedValues, ticketCount) {
        this.name = name;
        this.type = type;
        this.ticketImage = !ticketImage ? "passaros.png" : ticketImage;
        this.ticketCount = ticketCount;
        this.allowedValues = allowedValues;
        this.ticketList = this.createTickets();
    }

    createTickets() {
        var ticketList = [];
        for (let i = 0; i < this.ticketCount; i++) {
            ticketList.push(new Ticket(this.name, this.type, this.ticketImage, this.allowedValues));
        }

        return ticketList;
    }

    generateTemplate() {
        var content = '';
        this.ticketList.forEach(ticket => {
            content += `
            <div class="ticket">
                <h2 class="ticket-title">${this.name} </h2>
                <div class ="ticket-body">
                    ${ticket.fieldList.map((field, i) => `
                        <div class="ticket-line">
                            ${field.map((x, j) => `${
                                x.type == 1 ? `<div class="ticket-field">${x.display} </div>` :
                                `<div class ="ticket-field ticket-field-img"><img src='${x.display}' /></div>`
                            }`).join("")}
                        </div>
                    `
                    )
                    .join("")}
                </div>
            </div>`;
        })
        
        return content;
    }
}

class Ticket {
    constructor(bingoName, bingoType, image, allowedValues) {
        this.name = bingoName;
        this.fieldList = [[], [], [], [], []];
        this.imageField = new TicketField(null, image);
        
        var ticketByValues = [];
        for (let value of allowedValues) {
            ticketByValues.push(new TicketField(value.trim()));
        }

        const sortedNumbers = this.SortFields(ticketByValues, allowedValues.length - 1, bingoType);

        let i = 0;
        let j = 0;
        // cria a matriz bidimensional transposta para ordenar corretamente de cima para baixo
        for (let y = 0; y < 5; y++) {
            for (let x = y, c = 0; c < 5; x += 5, c++) {
                this.fieldList[i][j++] = sortedNumbers[x];
                if (j > 4) {
                    i++;
                    j = 0;
                }

                if (i > 4) break;
            }
        }
    }

    SortFields (ticketList, maxValue, bingoType) {
        let sortedValues = [];
        let usedValues = [];
        let i = 0;
        let j;

        while (i < 25) {
            if (i == 12) {
                i++;
                continue;
            }

            do {
                j = getRandomInt(0, maxValue);
            } while (usedValues[j] === true);

            usedValues[j] = true;
            sortedValues.push(ticketList[j]);
            i++;
        }

        // order list if bingo type is numeric
        if (bingoType === 1) {
            sortedValues = sortedValues.sort(
                (a, b) => parseInt(a.display, 10) - parseInt(b.display, 10)
            );
        }
        // include image field in the midle of ticket
        sortedValues.splice(12, 0, this.imageField);
        return sortedValues;
    };
}

class TicketField {
    constructor(value, image) {
        this.display = value != null ? value : image;
        this.type = value != null ? 1 : 2;
    }
}

function generateDefaultValues() {
    const allowedValues = document.querySelector("#allowedValues");
    const bingoType = parseInt(document.querySelector('input[name="bingoType"]:checked').value);
    const amountValuesExample = 90;

    if (bingoType === 1) {
        allowedValues.value = Array(amountValuesExample)
            .fill()
            .map((_, index) => index + 1)
            .toString()
            .split(",")
            .join("\n");
    } else {
        allowedValues.value = "";
    }
}

generateDefaultValues();