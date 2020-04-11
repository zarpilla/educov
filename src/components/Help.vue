<template>
  <div class="main-container">   
    <section class="zsection preserve-lines">        
        
<h2 class="title">Què és EDUCOV?</h2>

EDUCOV neix durant la crisi del Coronavirus de les necessitats detectades per part de mestres, professorat i famílies d’una eina o plataforma que els permetés fer reculls de recursos educatius i activitats que motivin a l’autoaprenentatge des de casa. EDUCOV és un projecte desenvolupat per l'equip 070-webcoopz (<a target="_blank" href="https://webcoop.cat">webcoop</a>) durant la <a target="_blank" href="https://hackovid.cat/">hackató hackovid</a> per aportar solucions a les necessitats de la ciutadania durant el confinament.

Aquesta plataforma intenta respondre a aquestes necessitats. És tracta d’una plataforma digital en obert amb diferents continguts eductius i reptes per ajudar a interioritzar el contingut o a validar-ne l’aprenentatge.

La plataforma està pensada per al professorat i l’alumnat dels diferents cursos de primària i secundària, i està dividida per les diferents àrees del curriculum educatiu català.

Dins de cada àrea, l’alumnat hi pot trobar diferents continguts i reptes que l’ajudaran, de forma autònoma, a millorar els seus coneixements i aptituds en la matèria.

<div class="text-center video-container">  
  <iframe class="has-margin-bottom-3" width="560" height="315" src="https://www.youtube.com/embed/awAkrCmyVik" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h2 class="title has-margin-top-3">Com funciona?</h2>

<br>
<h4 class="subtitle">Qui genera els continguts i els reptes?</h4>
La plataforma és oberta, això vol dir que qualsevol persona amb els coneixements suficients pot ser generadora de continguts i reptes. És a dir, un/a mestre/a pot crear un contingut i un repte o activitat pensant en el seu alumnat o en altres infants sobre un àmbit en concret. La plataforma però, no limita la creació de continguts i reptes a professionals «experts», sinó que un/a alumne/a podria ser també generar reptes i continguts. Ens basem en la idea de que <b>tothom és capaç d’ensenyar o ser ensenyat.</b>

<br><br><br>

<h4 class="subtitle">Quins tipus de continguts o reptes es poden crear?</h4>
La plataforma permet crear continguts associats a les diferents àrees de coneixement dels currículums d’educació primària i educació secundària obligatòria.

Els continguts es poden presentar en diferents formats: documents escrits o documents audiovisuals (àudios o vídeos).

Respecte a les activitats o reptes, cada contingut pot anar acompanyat d’activitats o reptes que ajudin a interioritzar-lo. Aquestes són opcionals i la plataforma permet inserir-los en format test (pregunta i resposta concreta) o en format de pregunta i resposta oberta.

Algunes activitats poden tenir informació (data, hora i enllaç) de videoconferències per a fer trobades en directe.


<h4 class="subtitle">Com es valoren els continguts i els reptes?</h4>
Cada vegada que una persona realitza un repte el pot avaluar en una escala de l’1 al 5. Es tracta d’una avaluació quantitativa per part dels/les usuaris/es que servirà com a guia a altres persones que vulguin realitzar el repte.


<h4 class="subtitle">M’he de registrar?</h4>
Si vols penjar un contingut i/o repte/activitat, sí, has de crear-te un usuari i contrasenya.

Si vols consultar un contingut i repte o realitzar-lo, tens la opció de registrar-te o no. Si et registres, en el teu usuari podràs veure el teu progrés.





<h3 class="title">Codi obert</h3>
Aquest <a target="_blank" href="https://github.com/zarpilla/educov">projecte és de codi obert</a> i ha estat desenvolupat gràcies a altres projectes de codi obert:

<a target="_blank" href="https://www.npmjs.com">npm</a><br>
<a target="_blank" href="https://nodejs.org">nodejs</a><br>
<a target="_blank" href="https://vuejs.org">Vue</a><br>
<a target="_blank" href="https://bulma.io/">Bulma.io</a><br>
<a target="_blank" href="https://material.io/resources/icons/?style=baseline">Material icons</a>

Les imatges que conté aquest portal tenen <a target="_blank" href="https://www.freepik.com/">llicència d'ús lliure freepik.</a>
<br>
<br>
<br>

    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
const fb = require("../firebaseConfig.js");


export default {  
  
};
</script>
<style scoped>
.video-container{
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 30px; 
  height: 0; 
  overflow: hidden;
  text-align: center;
}
.video-container iframe{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
@media screen and (min-width: 1024px) {
  .video-container{    
    padding-bottom:380px;
  }
  .video-container iframe{
    width: 560px;
    height: 315px;
    position: relative;
  }
}   
h4.subtitle{
  margin-bottom: 10px;
}
</style>
