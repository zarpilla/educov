<template>  
  <div id="dashboard" >
    <div>
      <div class="hero hero0">
        <div class="hero-bg" v-bind:style="{ backgroundImage: 'url(' + require(`@/assets/images/educov.jpg`) }"></div>

        <div class="container has-margin-top-3">
          <div class="columns">
            <div class="column is-9">
              <div class="title" id="educov">EDU<b>COV</b></div>
              <div class="more">
                <div class="subtitle" id="educov-title">Autoaprenentatge</div>
                <p class="desc" id="educov-subtitle">
                  {{ text2[0] }}
                </p>
              </div>              
            </div>
            <div class="column is-3">
            </div>
          </div>                    
        </div>

        
      </div>

      </div>

      <div class="container main-container">

        <h3 class="title all-boxes-create">Vols crear un repte?</h3>
        <router-link to="/login" class="button has-margin-bottom-3 is-info">Registra't!</router-link>

        <section class="zsection">
          <AllBoxes></AllBoxes>
        </section>

        <h3 class="title all-boxes-create">Vols crear un repte?</h3>
        <router-link to="/login" class="button has-margin-bottom-3 is-info">Registra't!</router-link>
      </div>

      
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
const fb = require("../firebaseConfig.js");
import AllBoxes from "@/components/AllBoxes";
import { scopes } from "../services/scope.service";

export default {
  components: {
    AllBoxes
  },
  created() {
    this.slideText()
  },
  data() {
    return{
      text1: ["Autoaprenentatge", "Obert", "Dinàmic", "En directe"],
      text2: ["Els recursos permeten un aprenentatge de forma autònoma", "Tothom hi té accés. És una eina lliure i gratuïta", "Permet la creació de nous continguts i reptes adaptats a les necessitats de cada moment.", "Es poden crear reptes en directe per treballar conjuntament a través de videoconferències"],
      counter: 0,
      interval: 0,
      polling: null
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
  },
  methods: {    
    bgImage(scope) {
      let image = scopes.find(s => s.id == scope) ? scopes.find(s => s.id == scope).image : 'ALT'
      return require(`@/assets/images/${image}`)
    },
    slideText() {
      this.counter = 1
      this.polling = setInterval(() => {
        this.change()
      }, 4000)
    },
    change() {
      let elem1 = document.getElementById('educov-title')
      let elem2 = document.getElementById('educov-subtitle')
      if (elem1) {
        elem1.innerHTML = this.text1[this.counter]
      }
      if (elem2) {
        elem2.innerHTML = this.text2[this.counter]
      }
        //elem.html(text[counter]);
      this.counter++;
      if(this.counter >= this.text1.length) { this.counter = 0; }
    }
  }
};
</script>
<style scoped>
.section {
  padding: 3rem 0;
}
#dashboard {
  margin-top: -30px;
}
.desc {
  margin-bottom: 1rem;
}
.mt-2 {
  margin-top: 2rem;
}
.hero {  
  color:#4a4a4a;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #eee;
  border-bottom: 0;
  
}
.desc-intro {
  text-align: center;
  font-size: 18px;
  font-family: 'Montserrat';  
  
}
.info-hero{ 
  padding-bottom: 2rem;
  margin-top: 1rem;
}
.info-hero span{
  color:#727475;
  color:#4a4a4a;
  font-size: 40px;
  font-weight: bold;
  font-family: 'Varela Round';
  
}
.info-hero i{
  color:#727475;
  color:#2c9cb2;
  font-size: 70px;
  display: block;
}
.hero-bg{
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  top:0;
  bottom:0;
  width:100%;
  height: 650px;
  opacity: 0.4;
  background-position: center;
}

@media screen and (min-width: 1024px) {
  .hero-bg{
    opacity: 1;
  }
}  

.hero0{
  height: 650px;
  position: relative;
  margin-left: -20px;
  margin-right: -20px;
}
.hero0 .container{
  width: 100%;
}

@media screen and (max-width: 1024px) {
  .hero0 .container{
    margin: 0 20px;
  }
}   

.hero0 .title{
  color:#49ADC1;
  font-size: 50px;
  font-family: 'Varela Round';  
  margin-top:90px;
}
.hero0 .subtitle{
  color:#49ADC1;
  font-size: 26px;
  font-family: 'Varela Round';
  text-transform: uppercase;
  font-weight: bold;  
}
.more{
  margin-top:160px;
  color:#49ADC1;
  width: 50%;
  font-size: 18px;
}
.title b{
  font-weight: normal;
}
.all-boxes-create{
  padding-top: 4rem;
}
</style>
