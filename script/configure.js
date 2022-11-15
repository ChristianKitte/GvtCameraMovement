//*************************************************************************
// App Werte
//*************************************************************************

/**
 * Die Nummer des aktiven Modells
 * @type {number}
 */
var activeModel = 1;

/**
 * Der Infotext für die Rekursiontiefe
 * @type {number}
 */
var recursionDeep = 1;

/**
 * Die Einstellung zur Anzeige des Gittergerüstes
 * @type {boolean}
 */
var showLine = document.getElementById("show-line").checked;

/**
 * Der Infotext für das angezeigte Modell
 * @type {HTMLElement}
 */
var infoText = document.getElementById("info_text");

//*************************************************************************
// UI Handler
//*************************************************************************

/**
 * Setzt den Wert für die Anzeige des Gittermodells und startet das Neuzeichnen
 */
document.getElementById("show-line").onchange = () => {
    showLine = document.getElementById("show-line").checked;
    RefreshWaves(activeModel);
}

/**
 * Setzt den Wert für die Rekursionstiefe der Kugel und initiiert das Neuzeichnen
 */
document.getElementById("recursion-deep").oninput = () => {
    recursionDeep = parseInt(document.getElementById("recursion-deep").value);
    document.getElementById("recursion-value").innerText = "Rekursionstiefe: " + recursionDeep + " (Einstellen mit Schieberegler)";

    RefreshWaves(activeModel);
}

/***
 * Setzt den angezeigten Text anhand des aktuellen Modells
 */
function setInfoText() {
    document.getElementById("figure1").classList.remove("btn-success");
    document.getElementById("figure2").classList.remove("btn-success");
    document.getElementById("figure3").classList.remove("btn-success");
    document.getElementById("figure4").classList.remove("btn-success");

    switch (activeModel) {
        case 1:
            // code block
            infoText.innerText = "Aktuell wird die Figur 1 (Zylinder) angezeigt";
            document.getElementById("figure1").classList.add("btn-success");
            break;
        case 2:
            // code block
            infoText.innerText = "Aktuell wird die Figur 2 (Kegel) angezeigt";
            document.getElementById("figure2").classList.add("btn-success");
            break;
        case 3:
            // code block
            infoText.innerText = "Aktuell wird die Figur 3 (Kugel) angezeigt";
            document.getElementById("figure3").classList.add("btn-success");
            break;
        case 4:
            // code block
            infoText.innerText = "Aktuell wird die Figur 4 (Torus) angezeigt";
            document.getElementById("figure4").classList.add("btn-success");
            break;
    }
}

/**
 * Zeigt die 1.Figur an
 */
document.getElementById("figure1").onclick = () => {
    activeModel = 1;
    setInfoText();
    RefreshWaves(activeModel);
}

/**
 * Zeigt die 2.Figur an
 */
document.getElementById("figure2").onclick = () => {
    activeModel = 2;
    setInfoText();
    RefreshWaves(activeModel);
}

/**
 * Zeigt die 3.Figur an
 */
document.getElementById("figure3").onclick = () => {
    activeModel = 3;
    setInfoText();
    RefreshWaves(activeModel);
}

/**
 * Zeigt die 4.Figur an
 */
document.getElementById("figure4").onclick = () => {
    activeModel = 4;
    setInfoText();
    RefreshWaves(activeModel);
}

/**
 * Zeigt die 5.Figur an
 */
document.getElementById("figure5").onclick = () => {
    activeModel = 5;
    setInfoText();
    RefreshWaves(activeModel);
}