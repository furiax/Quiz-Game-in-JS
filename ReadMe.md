# Quiz Game

In deze app krijgt de gebruiker 5 multiple-choice vragen die hij moet beantwoorden.  
De vraag wordt opgevraagd via een externe quiz-API.  
De gebruiker krijgt de vraag te zien samen met 4 mogelijke antwoorden.  

## Functionaliteit

- De vraag wordt voorgelezen en de gebruiker kan ook zijn antwoord inspreken indien gewenst.  
- Na het beantwoorden wordt gecontroleerd of het antwoord correct is.  
- De app geeft feedback of het antwoord juist of fout was.  
- Na 2 seconden wordt de volgende vraag gesteld.  

## Spraakfunctionaliteit

- **Voorlezen van vragen:** Dit gebeurt met behulp van `SpeechSynthesisUtterance`.  
- **Inspreken van antwoorden:** De gebruiker kan zijn antwoord inspreken door op het microfoon-symbool te klikken. Dit wordt mogelijk gemaakt door `SpeechRecognition`.  

> **Opgelet:** Niet elke browser ondersteunt `SpeechRecognition`. Als het niet werkt, probeer een andere browser.  

## Aanbevolen gebruik

Voor een goede werking is het raadzaam om te wachten tot de vraag volledig is voorgelezen voordat je antwoordt.  

## Gekende problemen

- **Te snel beantwoorden:**  
  Wanneer de vragen te snel worden beantwoord, geeft de API een time-out en wordt er geen nieuwe vraag gegenereerd. De app zit dan vast.  
- **Speciale karakters in voorleesfunctie:**  
  Speciale karakters worden voorgelezen als hun ASCII-code, wat de begrijpelijkheid kan verminderen.  
- **Doorlopende voorleesfunctie:**  
  Als men de antwoorden niet volledig laat voorlezen, zal de voorleesfunctie deze verder voorlezen bij de volgende vraag.  
- **Speciale karakters in antwoorden:**  
  Antwoorden die een speciaal karakter bevatten, worden als foutief beschouwd, zelfs als ze correct zijn.  
