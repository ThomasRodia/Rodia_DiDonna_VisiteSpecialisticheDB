const gestorePrenotazioniCache = (keyCacheRemota,nomeDatabaseRemoto) => {
    let keyCache=keyCacheRemota
    let nomeDatabase=nomeDatabaseRemoto
    let dizionarioPrenotazioni;
    fetch("http://ws.cipiaceinfo.it/cache/get", { 
        method: "POST",
        headers: {
            "content-type": "application/json",
            "key": keyCache
        },
        body: JSON.stringify({
                key: nomeDatabase
            })
    }).then(r => r.json()).then(r=>dizionarioPrenotazioni=JSON.parse(r.result)).catch(error => { throw(error) })
    return {
        aggiungerePrenotazioneCache : (prenotazione,persona) => {
            let check= true
            if(Object.keys(dizionarioPrenotazioni).length > 0){
                for (const key in dizionarioPrenotazioni){
                    if (key === prenotazione){
                        check= false
                    }
                }
            }
            if (check){
                dizionarioPrenotazioni[prenotazione]=persona;
            fetch("http://ws.cipiaceinfo.it/cache/set", { 
                method: "POST",
                headers: {
                    "content-type": "application/json",
                     "key": keyCache
                },
                body: JSON.stringify({
                    key : nomeDatabase,
                    value : JSON.stringify(dizionarioPrenotazioni)
                })
            }).then(r => r.json())
              .then(r => {console.log(r.result)})
            }
        },
        resetDizionarioPrenotazioniCache : () => {
            dizionarioPrenotazioni={}
            fetch("http://ws.cipiaceinfo.it/cache/set", { 
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "key": keyCache
                },
                body: JSON.stringify({
                    key : nomeDatabase,
                    value : JSON.stringify({})
                })
            })
            .then(r => r.json())
            .then(r => {console.log(r.result)})
        },
        mostraPrenotazioniCache : () => {
            return dizionarioPrenotazioni
        }
    }
}

export { gestorePrenotazioniCache }
