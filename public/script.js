import { initTable } from './components/table.js';
import { createListOfButtons } from './components/listOfButtons.js';
import { createModalForm } from './components/modalForm.js';
import { getMondayOfDate, chooseType } from './utils.js';


const form = createModalForm(document.getElementById("modal-bd"));
const listOfButtons = createListOfButtons(document.getElementById("tipologie"));
const appTable = initTable(document.getElementById("appuntamenti"));
const next = document.getElementById("avanti");
const previous = document.getElementById("indietro");
function formatDate(dateString) {
  
    const date = new Date(dateString);
    

    return date.toISOString().split('T')[0];
}

function transformTableDatas(tableDatasArray) {
    const result = {};

    tableDatasArray.forEach(data => {
        const { date, hour, name, type } = data;
        
        
        const formattedDate = new Date(date);
        const day = String(formattedDate.getDate()).padStart(2, '0');
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const year = formattedDate.getFullYear();
        const formattedDateString = `${day}${month}${year}`;

        const key = `${type}-${formattedDateString}-${hour}`;
        
       
        result[key] = name;
    });

    return result;
}

   let tableDatas;
    fetch("/prenotation/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(response => response.json())
      .then(data => {
        tableDatas = data;
        tableDatas= transformTableDatas(tableDatas)
      

fetch("./conf.json").then(r => r.json()).then((keyCache) => {

    console.log(tableDatas);
    
   
    listOfButtons.build(keyCache.otherInfo.tipologie, (currentActiveBtn) => {
        appTable.build(
            appTable.getCurrentDate(), 
            chooseType(tableDatas, currentActiveBtn),
            currentActiveBtn
        );
        appTable.render();
    });
    

    listOfButtons.render();

    
    form.onsubmit((result) => {
        console.log("result"+result);
        let prenotazione = "";
        prenotazione += listOfButtons.getCurrentSelectedCategory() + "-";
        let data = result[0].split("-").reverse().join("");  
        prenotazione += data + "-";
        prenotazione += result[1]; 
        console.log("data"+data);
        let check = true;
        for (const key in tableDatas) {
            let elementi = key.split("-");
            if (elementi[1] === data && elementi[2] === result[1]) {
                check = false;
            }
        }
    
        if (data.length > 0 && result[1].length > 0 && result[2].length > 0 && check) {
            
            let string =listOfButtons.getCurrentSelectedCategory();
            console.log("categoria"+string);
            let idType;
            if(string==="Cardiologia"){
                idType=1;
            }else if(string==="Psicologia"){
                idType=2;
            }else if(string==="Oncologia"){
                idType=3;
            }
            else if(string==="Ortopedia"){
                idType=4;
            }
            else if(string==="Neurologia"){
                idType=5;
            }


            const prenotazioneData = {
                date: formatDate(`${data.substring(4, 8)}-${data.substring(2, 4)}-${data.substring(0, 2)}T23:00:00.000Z`),
                hour: parseInt(result[1]),  
                name: result[2],  
                idtype: idType  
            };
            console.log(prenotazioneData);

            fetch("/prenotation/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(prenotazioneData),  
            })
            .then((response) => response.json())
            .then((result) => {
                console.log("Success:", result);
                // Rende aggiornata la tabella
                appTable.build(
                    appTable.getCurrentDate(),
                    chooseType(tableDatas, listOfButtons.getCurrentSelectedCategory()),
                    appTable.getCurrentTypo()
                );
                appTable.render();
                document.getElementById("prompt").innerHTML = "Prenotazione effettuata!";
            })
            .catch((error) => {
                console.error("Error:", error);
                document.getElementById("prompt").innerHTML = "Errore durante l'invio della prenotazione.";
            });
        } else {
            document.getElementById("prompt").innerHTML = "Prenotazione errata";
        }
        appTable.render();
        
    });
    
    
    form.setLabels({
        "Data" : [
            "Date",
            null
        ],
        "Ora" : [
            "select",
            ["8","9","10","11","12"]
        ],
        "Nominativo" : [
            "text",
            null
        ]
    });

    next.onclick = () => {
        const newDate = new Date(appTable.getCurrentDate());
        newDate.setDate(newDate.getDate() + 7)
        appTable.build(
            newDate, 
            chooseType(tableDatas, appTable.getCurrentTypo()), 
            appTable.getCurrentTypo()
        );
        appTable.render();
    }

    previous.onclick = () => {
        const newDate = new Date(appTable.getCurrentDate());
        newDate.setDate(newDate.getDate() - 7)
        appTable.build(
            newDate, 
            chooseType(tableDatas, appTable.getCurrentTypo()), 
            appTable.getCurrentTypo()
        );
        appTable.render();
    }

    form.render();

    const intervalId = setInterval(() => {
        if (tableDatas) {
            clearInterval(intervalId);
            let actualDate = new Date().toISOString().split('T')[0];
            appTable.build(
                getMondayOfDate(actualDate), 
                chooseType(tableDatas, keyCache.otherInfo.tipologie[0]),
                keyCache.otherInfo.tipologie[0],
            );
            appTable.render();
        }
    }, 100)

    setInterval(() => {
        appTable.build(
            appTable.getCurrentDate(), 
            chooseType(tableDatas, appTable.getCurrentTypo),
            appTable.getCurrentTypo(),
        );
    }, 300000)

    document.getElementById("button0").click()
});
})