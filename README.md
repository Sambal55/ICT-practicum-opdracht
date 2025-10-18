# ICT-practicum-opdracht

Zorgtechnologie minor ICT opdracht

Doel van de applicatie:
Het is de bedoeling dat een speler (gebruiker) blokjes verzamelt door het gehele kasteel en hier dan een trap van maakt,
zodat de speler kan ontsnappen uit het kasteel.

Controller bediening:

- Grip (links en rechts)  Het verplaatsen van een blok. Wordt gebruikt om blokken op te pakken en los te laten. Pak een
  blok op door de raycaster van de controller te richten op een blok, en houdt vervolgens de grip knop ingedrukt om het
  blok op te tillen. Door de controller te bewegen en te roteren kan de speler de blokken verplaatsen.
- Trigger (links en rechts)  Het dynamisch of statisch maken van een blok. Richt met de linker of rechter controller op
  een object. Klik vervolgens met de trigger van de controller waarmee gericht wordt op het object om deze statisch of
  dynamisch te maken
- Rechter joystick  Camera naar links en rechts draaien. Door de rechter joystick naar links of rechts te bewegen draai
  je je camera naar links of rechts.
- Bewegen:
  o Linker joystick  bewegen. Je beweegt door je linker joystick in de richting te duwen die je op wilt gaan.
  o “x” knop  Springen. Als je wil springen draai je je hoofd (of beweeg camera) naar de richting waar je heen wilt
  springen. Vervolgens loop je een klein stukje die kant op. Als de speler dan op de “x” knop drukt wordt er gesprongen
  in de richting waarin je het laatst hebt gelopen.
- “a” knop  Debug logs aan of uit zetten.

Desktop bediening: Met WASD bediening en de debug logs kunnen aan- en uitgezet worden met de letter Q.

Visuele aspecten:

- Raycasters  de rechter controller heeft een blauwe raycaster, en de linker controller heeft een gele raycaster.
- Blokkleuren:
  o Rode blokken zijn altijd statisch, en hebben dus altijd een vaste plek in de VR wereld en kunnen ook niet dynamisch
  worden gemaakt, en ook niet worden verplaatst
  o Zwarte blokken kunnen weer dynamisch worden gemaakt met de trigger knop. De zwarte blokken kun je niet bewegen.
  o Groene blokken kunnen statisch gemaakt worden met de trigger knop. De groene blokken kunnen ook worden verplaatst

Extra files die niet zijn gebruikt voor het eindreslultaat:
main/extraHTML/handControllers.html
main/js/handControllers.js
Hier was de bedoeling van de applicatie om met handgebaren blokken te kunnen oppakken en bewegen. Helaas waren er veel
problemen met het oppakken van blokken met handgebaren, en is er besloten om over te schakelen naar het werken met
controllers. Wat wel al werkte met handgebaren, was dat er een pinch gebaar gedetecteerd kon worden, en dat er in de VR
wereld de handen van de speler te zien waren en die in realtime veranderen van positie en meebewegen met de echte handen
van de speler.
De blokken konden ook van kleur veranderen als erop werd gericht met een van de handen van de speler. Roze als er op een
blok gericht werd, en het blok werd groen als er niet op een blok gericht was met een van de handen.
