<template>
  <div id="dashboard" class="main-container">
    <section v-if="currentUser" >
      <div class="columns" v-if="!currentUser.emailVerified">
        <div class="column">
          <p class="desc mt-2" v-if="!showEmailSent">Si us plau, verifica el teu correu per continuar.</p>

          <p class="desc" v-if="!showEmailSent">Comprova la safata d'entrada de <b>{{ currentUser.email }}</b>. Si no hi tinguessis un correu nostre, revisa la carpeta d'spam, o demana'n un altre</p>
          
          <button v-if="!showEmailSent" :disabled="timeout > 0" class="mt-2 button" @click="sendEmailVerification">
            Envia un altre correu
            <span style="padding-left:8px" v-if="timeout > 0"> ({{ timeout }}) </span>
          </button>

          <transition name="fade">
            <p v-if="showEmailSent" class="success has-text-primary is-primary">Correu enviat</p>
          </transition>

        </div>
      </div>

      <div class="columns has-margin-top-3" v-if="currentUser.emailVerified">
        <div class="column is-touch">
          <h3 class="title all-boxes" style="padding-top:40px">
            Vols resoldre un repte?          
          </h3>
          <router-link to="/" class="button">Comença!</router-link>

        </div>
        <div class="column">
          <h3 class="title all-boxes is-info" style="padding-top:40px">
            Vols crear un repte?          
          </h3>
          <router-link to="/box-edit" class="button">Crea'n!</router-link>

        </div>
      </div>

    </section>

  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
const fb = require("../firebaseConfig.js");

export default {
  data() {
    return {      
      showEmailSent: false,
      urlBase: process.env.URLBASE,
      timeout: 0
    };
  },
  components: {      
  },
  computed: {
    ...mapState(["userProfile", "currentUser"])
  },
  mounted() {
      this.timeout = 30;
      let int = setInterval(() => {
        this.timeout--;
        if (this.timeout <= 0) {
          clearInterval(int)
        }
      }, 1000)
    // }
  },
  methods: {    
    startInterval() {
      this.timeout = 60;
      let int = setInterval(() => {
        this.timeout--;
        if (this.timeout <= 0) {
          clearInterval(int)
        }
      }, 1000)
    },
    sendEmailVerification() {
      const actionCodeSettings = {
        url: `${this.urlBase}/verify`,
        handleCodeInApp: true
      }

      this.currentUser.sendEmailVerification(actionCodeSettings)
      this.showEmailSent = true
      this.startInterval();

      setTimeout(() => { this.showEmailSent = false }, 2000)
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    }
  }
};
</script>
<style scoped>
.section {
  padding: 3rem 0;
}
#dashboard{
  margin-top: -30px;
}
.desc{
  margin-bottom: 1rem;
  white-space: pre-line;
  color: #727475;
}
.mt-2{
  margin-top: 2rem;
}
</style>
