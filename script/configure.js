//*************************************************************************
// App Werte
//*************************************************************************

/**
 * Die Nummer des aktiven Modells
 * @type {number}
 */
var activeModel = 1;

/**
 * Die Einstellung zur Anzeige des Gittergerüstes
 * @type {boolean}
 */
var showLine = document.getElementById("show_line").checked;

/**
 * Der Infotext für das angezeigte Modell
 * @type {HTMLElement}
 */
var infoText = document.getElementById("info_text");

/**
 * Der Infolink für das angezeigte Modell
 * @type {HTMLElement}
 */
var infoLink = document.getElementById("info_link");

//*************************************************************************
// UI Handler
//*************************************************************************

/**
 * Setzt den Wert für die Anzeige des Gittermodells und startet das Neuzeichnen
 */
document.getElementById("show_line").onchange = () => {
    showLine = document.getElementById("show_line").checked;
    RefreshWaves(activeModel);
}

/***
 * Setzt den angezeigten Text anhand des aktuellen Modells
 */
function setInfoText() {
    document.getElementById("figure1").classList.remove("btn-success");
    document.getElementById("figure2").classList.remove("btn-success");
    document.getElementById("figure3").classList.remove("btn-success");

    switch (activeModel) {
        case 1:
            // code block
            // http://www.3d-meier.de/tut3/Seite17.html
            infoText.innerText = "Aktuell wird die Figur 1 (Schnecke) angezeigt";
            document.getElementById("figure1").classList.add("btn-success");
            infoLink.href = "http://www.3d-meier.de/tut3/Seite17.html";
            infoLink.style.visibility="visible";
            infoLink.innerText="(Basis)";
            break;
        case 2:
            // code block
            // http://www.3d-meier.de/tut3/Seite22.html
            infoText.innerText = "Aktuell wird die Figur 2 (Whitney Umbrella) angezeigt";
            document.getElementById("figure2").classList.add("btn-success");
            infoLink.href = "http://www.3d-meier.de/tut3/Seite22.html";
            infoLink.style.visibility="visible";
            infoLink.innerText="(Basis)";
            break;
        case 3:
            // code block
            // Basiert auf dem Spinnennetz
            infoText.innerText = "Aktuell wird die Figur 3 (Zahnrad) angezeigt";
            document.getElementById("figure3").classList.add("btn-success");
            infoLink.style.visibility="hidden";
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


