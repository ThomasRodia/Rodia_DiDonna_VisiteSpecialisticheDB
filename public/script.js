import { initTable } from './components/table.js';
import { createListOfButtons } from './components/listOfButtons.js';
import { createModalForm } from './components/modalForm.js';
import { getMondayOfDate, chooseType } from './utils.js';
import { gestorePrenotazioniCache } from './librerie/prenotazioneCacheRemota.js';

const form = createModalForm(document.getElementById("modal-bd"));
const listOfButtons = createListOfButtons(document.getElementById("tipologie"));
const appTable = initTable(document.getElementById("appuntamenti"));
const next = document.getElementById("avanti");
const previous = document.getElementById("indietro");

fetch("./conf.json").then(r => r.json()).then((keyCache) => {

    let cacheRemota= gestorePrenotazioniCache(keyCache.otherInfo.cacheToken,"prenotazioni");
    
    // Lista di bottoni
    listOfButtons.build([...keyCache.otherInfo.tipologie], (currentActiveBtn) => {
        appTable.build(
            appTable.getCurrentDate(), 
            chooseType(cacheRemota.mostraPrenotazioniCache(), currentActiveBtn),
            currentActiveBtn
        );
        appTable.render();
    });

    listOfButtons.render();

    // Form
    form.onsubmit((result) => {
        let prenotazione="";
        prenotazione+=listOfButtons.getCurrentSelectedCategory()+"-"
        let data=result[0].split("-").reverse().join("")
        prenotazione+=data+"-"
        prenotazione+=result[1]

        let check=true
        for (const key in cacheRemota.mostraPrenotazioniCache()){
            let elementi=key.split("-")
            if(elementi[1]===data && elementi[2]===result[1]){
                check=false
            }
        }

        if(data.length > 0 && result[1].length >0 && result[2].length > 0 && check){
            cacheRemota.aggiungerePrenotazioneCache(prenotazione,result[2])
            appTable.build(
                appTable.getCurrentDate(), 
                chooseType(cacheRemota.mostraPrenotazioniCache(), listOfButtons.getCurrentSelectedCategory()), 
                appTable.getCurrentTypo()
            );
            appTable.render();
            document.getElementById("prompt").innerHTML = "Prenotazione effettuata!";
        } else {
            document.getElementById("prompt").innerHTML = "Prenotazione errata";
        }
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
            chooseType(cacheRemota.mostraPrenotazioniCache(), appTable.getCurrentTypo()), 
            appTable.getCurrentTypo()
        );
        appTable.render();
    }

    previous.onclick = () => {
        const newDate = new Date(appTable.getCurrentDate());
        newDate.setDate(newDate.getDate() - 7)
        appTable.build(
            newDate, 
            chooseType(cacheRemota.mostraPrenotazioniCache(), appTable.getCurrentTypo()), 
            appTable.getCurrentTypo()
        );
        appTable.render();
    }

    form.render();

    const intervalId = setInterval(() => {
        if (cacheRemota.mostraPrenotazioniCache()) {
            clearInterval(intervalId);
            let actualDate = new Date().toISOString().split('T')[0];
            appTable.build(
                getMondayOfDate(actualDate), 
                chooseType(cacheRemota.mostraPrenotazioniCache(), keyCache.otherInfo.tipologie[0]),
                keyCache.otherInfo.tipologie[0],
            );
            appTable.render();
        }
    }, 100)

    // Ripetizione
    setInterval(() => {
        cacheRemota= gestorePrenotazioniCache(keyCache.otherInfo.cacheToken,"prenotazioni");
        appTable.build(
            appTable.getCurrentDate(), 
            chooseType(cacheRemota.mostraPrenotazioniCache(), appTable.getCurrentTypo),
            appTable.getCurrentTypo(),
        );
    }, 300000)

    document.getElementById("button0").click()
});