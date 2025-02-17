/*
Struttura dizionario

{
    "etichetta" : [
        "tipo",
        [valore1, valore2, valore3]
    ]
}

*/

const createModalForm = (parentElement) => {
let data;
let callback = null;

return {
    setLabels: (labelsAndType) => {
        data = labelsAndType;
    },
    onsubmit: (callbackInput) => {
        callback = callbackInput
    },
    render: () => {
        let modalHTML = "";
        for (let key in data) {
            if (data[key][1] == null) {
                modalHTML += `<div>${key}\n<input class='underPadding2' id="${key}" type="${data[key][0]}"/></div>` + '\n';
            } else {
                modalHTML += `
                    <div class='underPadding2'>
                        ${key}
                        <${data[key][0]} id="${key}">
                          ${Object.entries(data[key][1]).map((value) => 
                            `<option value="${value[1]}">${value[1]}</option>`
                          ).join('')}
                        </${data[key][0]}>
                    </div>
                `; 
            }
        }

        document.querySelector("#prenotare").onclick = () => {
            const result = Object.keys(data).map((name) => {
                return document.querySelector("#" + name).value;
            });

            Object.keys(data).forEach(e => document.querySelector("#" + e).value = "")

            callback(result);
        }
        parentElement.innerHTML = modalHTML;
    }
}
}

export { createModalForm };



