![image](https://user-images.githubusercontent.com/32162305/150810942-99672aac-99af-47ea-849b-ba263fae0c3f.png)

---

**Graphical Visualisation Technologies**

**Dozent: Prof. Dr. Felix Gers (Berliner Hochschule für Technik)**

**Studiengang Medieninformatik Online MA, Wintersemester 2022/23**

**University of Applied Sciences Emden/Leer, Faculty of Technology, Department of Electrical Engineering and
Informatics**

---

### Einsendeaufgabe EA5 : Kamerabewegung

[zur Webseite](https://gvt.ckitte.de/ea5/)

Im Rahmen der fünften Einsendeaufgabe sollten zunächst zwei Grundkörper, sowie eine rekursive Kugel
erstellt werden. Die Tiefe der Rekursion sollte frei einstellbar, die Darstellung der Linien optional sein.

Die Körper sollen frei betrachtet werden können. Folgene Interaktionen sollen verfügbar sein: 

- Kreisen der Kamera über die **Pfeiltasten**
- Bewegen in XY Richtung mit den **WASD Tasten**
- Entfernung / Radius der Kamera Mit der **N (Shift-N)**

Mit Hilfe des Button "Reset" kann der Anfangszustand wiederhergestellt werden. Über die Checkbox kann
die Anzeige der Linien gesteuert werden.

BILD UI

Um trotz der farbigen Vertices, wie sie für die Farbe der Fragmente notwendig sind, schwarze Linien zu erhalten, wurde
vor deren Ausgabe das entsprechende Farbattribut disabled.

### Aufteilung des Codes

Als Startseite dient wie üblich eine **index.html**. Die Datei **main.css** enthält alle benötigten Klassen, um die
Grafik einfach einzubinden. In der Datei **layout.css** wird das Layout der Webseite selbst festgelegt. Daneben kommt
Bootstrap für die Buttons zum Einsatz.

Die Logik verteilt sich auf mehrere JavaScript Dateien, welche von **main.js** genutzt werden. WebGL selbst und der
Shadercode befinden sich in den Dateien **webglconfig.js** und **shader.js**. In der Datei **configure.js** werden die
Programmeinstellungen gehalten. Die Datei **extendedvertexarray.js** handelt Arrayfunktionen und die Arrays selbst.

Der Canvas als zentrales Ausgabeobjekt wurde in der **index.html** angelegt und mit einer fixen Breite von 1000px
belegt. Alle anderen Einstellungen erfolgen über CSS.
