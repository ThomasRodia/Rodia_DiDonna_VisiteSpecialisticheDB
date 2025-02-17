const getMondayOfDate = (inputDate) => {
    const date = new Date(inputDate);
    date.setDate(date.getDate() - (date.getDay() - 1));
    return date.toISOString().split('T')[0];
}

/*

    Questa funzione sarà utile quando dovremmo creare le tabelle per TIPOLOGIA
    tu clicchi sul bottone della tipologia, e lui ti ricrea il dizionario con solo quella tipologia

*/

const chooseType = (dictionary, type) => {
    let newDictionary = {};

    for (let key in dictionary) {
        if(key.split("-")[0] == type) newDictionary[key] = dictionary[key];
    }

    return newDictionary;
}

export { getMondayOfDate, chooseType };