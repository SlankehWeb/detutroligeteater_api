# Overlook API
API'et er bygget i NodeJS, Express og Sequelize med MySQL database som datakilde.
## Overordnet filstruktur
API'ets modeller og controllers  er delt i mapperne *App* og *Core*. I Core mappen finder du faste elementer som brugere, brugergrupper og organisationer. I App mappen ligger alle de filer som hører til den specifikke løsning - det vil sige arrangementer, skuespiller, nyheder, reservationer osv.

Alle routes ligger fordelt på filerne *app*, *core* og *install* i mappen *Routes*.
## Postman

Der ligger en Postman dokumentation på nedenstående link som giver et overblik over de forskellige endpoints i API'et og hvordan de skal kaldes:
https://documenter.getpostman.com/view/6540576/2s9Y5cugYY

Du skal selv oprette en database og indtaste dine bruger oplysninger til din denne i filen `.env`. Når du har gjort det kan du installere alle data ved at gå ind i mappen *System => Install* i Postman og kalde endpointet *Install datamodels*. 

> OBS! Ovenstående kommando vil geninstallere alle tabeller og data og dermed slette de eksisterende. 

## Modeller & Data
Modeller og data er relateret. Det betyder at en model i mappen Models indlæser data fra en csv fil i mappen Data når der køres en *Install datamodels*. 

Derfor skal du huske at tilpasse datafilerne hvis du laver ændringer til datastrukturen i en af model filerne.  

## .env
Der kan du også angive portnummer og levetid i sekunder for dine tokens. Standard portnummer er 3000.

## Billeder
I mappen `Assets/Images` finder du alle billeder til sitet. 

Disse kan kopieres til din frontend løsning.

I nogle endpoints får du kun filnavnet ud og du skal derfor selv indsætte stien i dataudtrækket. 

## Users, Usergroups & Organisations
API'et har en brugertabel med relationer til brugergrupper og organisationer. Som udgangspunkt kan du bare bruge brugertabellen til login men 

- **Organisations (*orgs*):** bruges til at oprette virksomheder, foreninger eller lignende. En bruger kan kun være medlem af en organisation.

- **Brugergrupper (*groups*):** bruges til at oprette forskellige grupper med. Disse kan bruges til til at at lave forskellige grupperinger af brugere. Eksempelvis kan man have en gruppe for admin brugere, webshopkunder eller modtagere af et nyhedsbrev. En bruger kan være medlem af mange grupper.

## Start API'et
Kør `nodemon .` i terminalen for at starte projektet. Databasen skal selvfølgelig være sat op før at API'et vil virke.