## Descrizione
### Richiesta
_Crea un sistema di “micro” API Rest che espone in sola lettura i dati di un e-commerce salvati su file system all’interno di una cartella dove ogni file CSV rappresenta una tabella. Definisci la struttura di queste “tabelle”: users (utenti/clienti della piattaforma), items (prodotti in vendita), orders (ordini effettuati dai clienti). L’autenticazione non è richiesta, ma è un plus. Scegli il framework JS che preferisci, utilizza il minor numero possibile di librerie e realizza un README.md con le istruzioni per lanciare il progetto._

### Scelte tecniche
- Il framework scelto è Nest.js
- i file csv risiedono nella cartella `data`
- la tabella `users` contiene i seguenti campi
  - id
  - username
  - fullName
- la tabella `items` contiene i seguenti campi
  - id
  - code
  - description
- la tabella `orders` contiene i seguenti campi
  - id
  - userId
  - itemIds
  - date
  - address
- uno swagger per le API è accessibile all'indirizzo http://localhost:3000/api
- per `users` e `items` sono presenti due endpoint, uno che restituisce tutti i record (e un totale di record presenti) e uno che restituisce il record per uno specifico `id`
- per `orders` esiste più granularità, esistono infatti quattro endpoint:
  - per recuperare tutti gli ordini
  - per recuperare l'ordine con uno specifico `id`
  - per recuperare gli ordini di uno specifico user
  - per recuperare gli ordini contenenti uno specifico item
- ognuno degli endpoint relativi agli orders ha due argomenti `includeUser` e `includeItems` che controllano l'inclusione (in ogni ordine) rispettivamente dello user che lo ha effettuato e degli item contenuti oltre agli specifici id sempre presenti
- i file csv vengono letti come stream

### Criticità
- per evitare eccessiva complessità non ho gestito una cache dei dati che vengono quindi riletti ogni volta necessario
- non è gestita l'autenticazione per questione di tempistiche. Avendo a disposizione maggior tempo avrei scelto di implementare un sistema di autenticazione basato su JWT con un'eventuale blacklist per poter invalidare token prima della loro naturale scadenza
- non sono presenti test sempre per questione di tempistiche. Avendo a disposizione più tempo avrei mockato la lettura dei csv per potermi assicurare l'indipendenza dei test dai dati presenti nel filesystem
- l'esercizio è puramente un PoC, un applicativo reale avrebbe probabilmente diverse versioni di modelli per lo stesso dato e una classe per effettuare il mapping da uno al altro (es. dalla rappresentazione su DB a quella restituita chiamando le API, in cui, a titolo di esempio, non viene restituito il campo password dell'utente)

## Installazione

```bash
$ pnpm install
```

## Eseguire il codice

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
