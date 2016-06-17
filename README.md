# mmis2

if one of the graph types is chosen on the side, the bookmark should stay pulled out

2D plot legend problem if only 1 feature for one country is chosen


designdodos:
- tagcloud übedenken
- ui für 'was' und 'wie' man es sehen will
    - hier ist zu bedenken
        - selection
        - gruppen
        - achsen dimensions assozaition
        - man kann auf eine achse Keys auftragen (jahr, coutry, feature) oder values (viewModel.data[..][..][..])
        - sortierung

todos:
- map
- bar
- histogramm
- 2d scatter
- bubble (3d scatter mit radius)


bugs:
- label fehlt wenn nur eine gruppe existiert


ACHTUNG: ich hab erst angefangen den text als markdown zu formatieren, des ist auf githab aber noch nicht lesbar,
also am besten das README.md als plain text im atom lesen.

# Technische sichtweise der assoziationen:
sry, das hätt ich dir früher zusammenschreiben sollen, weil an der stelle müssen wir
irgendwie ein gemeinsames interface finden.

##Graph api, alias definiere achsen, alias assoziationen:
das graph api besteht aus einem set von assoziationen.
es muss mindestens eine assoziation geben (x) sonst sieht man gar nix, die anderen sind optional.
je mehr assoziationen desto mehr visible bzw. eigenschaften wie farbe kann man im graph sehen. 1D bis 3D plus farbe...
man kann assoziationen für folgende 'visible' machen: x, y, z, gruppe, radius, color                 (achse is a blödes wort, weil farbe gruppe radius auch dabei ist (vll 'visible'?))


1. eine assoziation definiert was das 'visible' darstellt                                         ('visible' statt 'achse'?)
   (bzw. nicht nur auf der achse, sonden auch anderen eigenschaften der des graphen,
    wie z.b. 'welche punkte bilden eine linie' oder was hat die gleiche farbe)

2. eine assoziation hat folgende form:  
    ```javascript
                                             (kann man auch als := sehen)
                                             ↓
        (x | y | z | group | radius | color) : const
                                             | featureKey | countryKey | yearKey
                                             | data[featureSelection|const][countrySelection|const][yearSelection|const]

        x: countrySelection

        // const steht hier für konstante zahl oder string.
        // hier sei angemerkt, das die alle ausdrücke rechts immer ein string, number, oder Date sein müssen,
        // weil plotly nur diese typen akzeptiert.
        //    setzt man eine konstante ein muss man darauf selbst achten
        //    countryKey und featureKey nimmt immer string werte an (in der selection sind immer strings)
        //    yearKey nimmt immer number werte an (in der year selection sind immer numbers) (ja, das in ein Date zu konvertieren solten wir noch machen)
        //    für data[a][b][c] kein problem, ist eh immer number    
        // theoretisch könnte man hier auch js expressinos einsetzen, aber das sollten wir im ui weglassen (zu kompliziert)
    ```

3. die formen der assoziation auf der rechten seite im detail:

    3.1. es wird eine konstante auf die achse aufgetragen: x:3                                              
            -> für den user sinnlos, weil immer das selbe auf der achse angezeit wird (gerade), aber erklärt das technische prinzip

    3.2. es wird ein ...Key auf die achse aufgetragen: x:countryKey | x:yearKey | x:featureKey
            -> dann sieht man alle länder oder jahre oder features der selection auf dieser 'achse'

    3.3. es wird ein wert aus der db auf die 'achse' aufgetragen, dabei gibt es wieder 3 fälle,
            die sich aus dem notwendigen array zugriff ergeben (viewModel.data[...][...][...])

            3.3.1. nur konstanten als index: viewModel.data['gdp']['Austria']['1970']
                -> man sieht auf der achse immer den selben feature wert. auch recht sinnlos.

            3.3.2. ...key als index: viewModel.data[featureKey][countryKey][yearKey]:
                -> man sieht auf der achse für jedes element der selection genau einen wert
                   jeder ...Key hat seine eigene selection
                   man sieht also selection.features.length * selection.country.length * selection.year.length viele punkte

            3.3.3. mischform: x:viewModel.data[featureKey][countryKey]['1970']:
                -> man sieht auf der achse für jedes element der selected features UND countries den wert von 1970.
                   (das sind selection.features.length * selection.country.length viele werte)

                diese form beinhaltet aber auch: viewModel.data['gdp'][countryKey][yearKey]:
                -> das wird bei scatterplot verwendet. z.b. lifexpectancy über gdp: (sogar 2 mal diese form)
                        x:viewModel.data['gdp'][countryKey][yearKey]
                        y:viewModel.data['life_expectancy'][countryKey][yearKey]
                   anmerkung: das zeigt jetzt für jeden selected country, und jedes selected year einen punkt, (countryKey * yearKey viele werte)
                              man könnte auch anstatt die selection zu verwenden das year constant einsetzten:
                              x:viewModel.data['gdp'][countryKey]['1970']
                              y:viewModel.data['life_expectancy'][countryKey]['1970']
                              -> (selection.country.length viele werte) oder einfach gesagt: endlich für jedes land genau ein punkt :D

## selections
wird dann gebraucht wenn ein ...Key verwendet wird, und definiert welche werte ...Key annimmt.
verwendet man den ...Key NICHT aber es gibt eine selection kann es zu problemen kommen (mein problem?)

## eine (wage) theorie wie wann die achsen labels berechnen kann
je nach assoziations form wird das label unterschiedlich berechnet:
wenn form:
3.2   --> achenlabel der linken seite = rechte seite ohne 'Key', und falls featureKey ist es dessen wert
3.3.2 --> achenlabel der linken seite = 'existiert'
3.3.3 --> achsenlabel der linken seite = das in der [] des verwendeten feature index


## die formen unserer derzeitigen examples:
- typische graphen verwenden eine assoziatin der form (3.3) und der rest ist die form (3.2).
  also einmal (3.3) für einen zahlen wert aus der db.
  und 0 bis 3 mal die form (3.2) falls eine 'achse' die länder, jahre oder features (für den user eher komisch) zeigen soll.
  so z.b unser 2D liniengraph. der diverse zahlen werte auf y über der zeit auf x anzeigt. (y = form 3.3, x = form 3.2 )

- graphen die nur anzeigen welche werte VORHANDEN sind, werwenden ausschließlich die form (3.2)
  (das beruht darauf weil die graph update implementierungen die undefined wertw mit den if's rausfiltert) (die if's kennst du)

- scatterplots verwenden öfter als ein man die form (3.3)

- enthält eine assoziation eine form mit konstanten gibt es einen design bug.
  nimmt man z.b. konstante das feature 'gdp' hat aber viel mehr features in der selection,
  so wird gdp selection.length oft gezeichnet :( (nicht so wichtig)

## derzeitige examples javascript (assoziation + selection + graphtype = examples)
der folgende code ist in view.js.
er definiert die examples assoziations scripts die man mit 'next' und 'prev' durchschalten kann.

im folgenden js code ist:
   assoziation = script
   selection = selection
   graphtype = defView

es ist nicht gesagt das defView der einzige sinnvolle graph typ ist,
es können mehrere sein. defView definiert nur welcher als default angezeigt wird.

note: wird undefined als selection verwendet bedeutet dies ALLE (features, länder, jahre) sind ausgewählt

```javascript
{   // zeigt für welche indizes werte vorhanden sind (innerhalb der selection) (3D)
    script: 'x:featureKey, y:countryKey, z:yearKey, group:countryKey',
    selection: {
        features:  undefined,
        countries: { 'United States':true, 'China':true, 'Saudi Arabia':true, Austria:true, Aruba:true },
        years:     undefined
    },
    defView: '3D Scatter'
},
{
    // zeigt für welche indizes werte vorhanden sind (innerhalb der selection)
    // (2D) has heißt man sieht nicht in welchem jahr der wert da ist sondern nur OB
    // (z hat ja immer den gleichen wert, und wird deshalb immer an die selbe stelle gezeichnet)
    // selektiert man ein jahr erledigt sich das problem (eine dimension weniger und der 2d graph passt)
    script: "x:yearKey, y:featureKey, z:yearKey, group:featureKey",
    selection: {
        features:  undefined,
        countries: { 'United States':true, 'China':true, 'Saudi Arabia':true },
        years:     undefined
    },
    defView: '2D'
},
{
    // zeigt die ausgewähltn features der ausgewählten lander über der zeit,
    // grupperit nach feature und land
    script: "x:yearKey, y:viewModel.data[featureKey][countryKey][yearKey], group:countryKey + '-' + featureKey",
    selection: {
        features:  { 'Arms_imports[$]':true, 'Arms_exports[$]':true },
        countries: { 'United States':true, 'China':true, 'Saudi Arabia':true },
        years:     undefined
    },
    defView: '2D'
},
{
    // scatterplot: countries.selection.length * year.selection.length viele punkte
    script: "x:viewModel.data['Country_GDP[$]'][countryKey][yearKey], y:viewModel.data['Suicides[#]'][countryKey][yearKey], group:countryKey",
    selection: {
        features:  { 'Austria':'not used'},
        countries: { 'United States':true, 'China':true, 'Saudi Arabia':true },
        years:     undefined
    },
    defView: '2D Scatter'
}
```
