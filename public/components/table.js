const createTable = (parentElement) => {
    let data;
    return {
        build: (dataInput) => {
            data = dataInput;
        },
        render: () => {
            let htmlTable = '<table class="table table-striped">';
            htmlTable += data.map((row) =>
                "<tr>" + row.map((col) =>
                    "<td>" + col + "</td>"
                ).join("")
            ).join("") + "</tr>";
            htmlTable += "</table>";
            parentElement.innerHTML = htmlTable;
        }
    }
}



const initTable = (parentElement) => {
    let date;
    let data;
    let type;
    return {
        build: (dateInput, dataInput, typo) => {
            date = dateInput;
            data = dataInput;
            type = typo;
        }, 
        render: () => {
            // Gli orari
            let tableStructure = [];
            let dateRow = ["Orario", "Lunedì " + new Date(date).toISOString().split('T')[0]];
            const giorni = ["Martedì", "Mercoledì", "Giovedì", "Venerdì"];

            for (let i = 1; i < 5; i++) {
                let weekDate = new Date(date);
                weekDate.setDate(weekDate.getDate() + i);
                dateRow.push(giorni[i - 1] + " " + weekDate.toISOString().split('T')[0]); 
            }

            tableStructure.push(dateRow);

            // Gli orari
            for (let i = 8; i <= 12; i++) {
                let tableRow = [];
                for (let i = 0; i < dateRow.length - 1; i++) tableRow.push("");
                tableStructure.push([i, ...tableRow]);
            }

            const getCorrectDate = (date) => date.split("-").reverse().join("");

            for (let key in data) {
                const coords = key.split("-");
                let j = dateRow
                        .slice(1)
                        .findIndex((e) => getCorrectDate(e.split(" ")[1]) == coords[1]) + 1;
                let i = tableStructure.findIndex((e) => e[0] == coords[2])

                if (i != 0 && j != 0) {
                    tableStructure[i][j] = data[key];
                }
            }

            const table = createTable(parentElement);
            table.build(tableStructure);
            table.render();
        },
        getCurrentDate: () => {
            return date;
        },
        getCurrentTypo: () => {
            return type;
        }
    }
}

export { initTable };



