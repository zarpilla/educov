<template>
  <footer class="footer">
    <cookie-law theme="blood-orange" 
      buttonText="D'acord" 
      message="Aquest portal utilitza cookies per donar una bona experiència durant la visita."
      buttonLinkText="Més informació"
      buttonLink="/privacitat"
      position="bottom" 
      transitionName="fade"
      >
    </cookie-law>
    <div class="educov has-text-centered">      
      EDU<b>COV</b>
    </div>
    <div class="developed has-text-centered">
      Projecte desenvolupat per <a href="https://webcoop.cat" target="_blank">webcoop</a> durant la <a href="https://hackovid.cat" target="_blank">hackató hackovid</a> per aportar solucions a les necessitats de la ciutadania durant el confinament
    </div>
    <div class="container line">
      <router-link class="footer-link" to="/">INICI</router-link>
      
      <router-link class="footer-link" to="/ajuda">COM FUNCIONA</router-link>

      <router-link class="footer-link" to="/privacitat">PRIVACITAT</router-link>
      <span class="powered">
      IMPULSAT PER
      </span>
      <a target="_blank" href="https://webcoop.cat" class="footer-link">webcoop</a>
    </div>
  </footer>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";
import CookieLaw from 'vue-cookie-law'


export default {
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  components: { CookieLaw },
  mounted() {
  }
};
</script>
<style scoped>
.footer{
  background-color: #272727;
  padding-bottom: 1.0rem;
  margin-top: 12px;
  border-top: 4px solid #49ADC1;
}
.educov{
  text-transform: uppercase;
font-weight: bold;
color: #49ADC1;
color: #fff;
font-family: 'Varela Round';
font-weight: bold;
font-size: 24px;
margin-bottom: 2rem;
}
.line{
  border-top:1px solid #595959;
  text-align: right;
}
.footer-link{
  color: #a3a3a3;
  margin-left: 40px;
  font-size: 14px;
  outline: none;
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
@media screen and (min-width: 1024px) {
  .footer-link{
    display: inline-block;
    margin-top: 0;
    margin-bottom: 0;
  }
}   
.footer-link:hover{
  color: #49ADC1;
}
.developed{
  color: #fff;
  margin-bottom: 10px;
}
.developed a:hover{
  color:#fff
}
.powered{
  margin-left: 3rem;
  display: inline-block;
  color:#666;
  font-size:14px;
}
.educov b{
  font-weight: normal;
}
</style>