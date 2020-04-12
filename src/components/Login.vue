<template>
  <div id="login" class="main-container">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p class="loading-info">Carregant...</p>
      </div>
    </transition>
    <section class="login-section">
      <div class="columns is-vcentered">
        <div class="column hero is-primary is-fullheight is-hidden-mobile">
          <div class="hero-body">
            <div class="container is-centered">
              <!-- <p class="title">
                EDUCOV
              </p> -->
              <img alt="EDUCOV" class="educov-login" src="@/assets/images/educov-white-logo.png" />
              <p class="subtitle">Benvingut/da</p>
            </div>
          </div>
        </div>
        <div
          class="column hero is-fullheight is-vcentered"
          :class="{ 'signup-form': !showLoginForm && !showForgotPassword }"
        >
          <div class="hero-body">
            <section class="is-fullwith">
              <form v-if="showLoginForm" @submit.prevent>
                <h1 class="title">Entra</h1>

                <label class="label" for="email1">Correu</label>
                <input
                  v-model.trim="loginForm.email"
                  type="text"
                  placeholder="elteu@email.com"
                  id="email1"
                />

                <label class="label" for="password1">Contrasenya</label>
                <input
                  v-model.trim="loginForm.password"
                  type="password"
                  placeholder="******"
                  id="password1"
                />

                <button @click="login" class="button">Entra</button>

                <div class="extras">
                  <a @click="togglePasswordReset">He oblidat la meva contrasenya</a>
                  <a @click="toggleForm">Crea un compte</a>
                </div>
              </form>
              <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
                <h1 class="title">Comença</h1>

                <label class="label" for="name">Nom</label>
                <input
                  v-model.trim="signupForm.name"
                  type="text"
                  placeholder="Com et dius?"
                  maxlength="150"
                  id="name"
                />

                <label class="label" for="email2">Correu</label>
                <input
                  v-model.trim="signupForm.email"
                  type="text"
                  placeholder="elteu@email.com"
                  id="email2"
                />

                <label class="label" for="password2">Contrasenya</label>
                <input
                  v-model.trim="signupForm.password"
                  type="password"
                  placeholder="mín 6 caràcters"
                  id="password2"
                />

                <label class="checkbox desc" for="checkbox">
                  No farem servir les teves dades per a res que no estigui relacionat amb el funcionament d'aquesta web. 
                  <br>
                  <br>
                  Accepto la <router-link to="/privacitat">política de privacitat</router-link>
                  <input class="has-text-left"
                    v-model.trim="signupForm.checkbox"
                    type="checkbox"                  
                    id="checkbox"
                  />
                </label>

                <button @click="signup" :disabled="signupForm.checkbox == false || signupForm.name == '' || signupForm.email == '' || signupForm.password == ''" class="button">Registra't</button>

                <div class="extras">
                  <a @click="toggleForm">Torna al login</a>
                </div>
              </form>
              <form v-if="showForgotPassword" @submit.prevent class="password-reset">
                <div v-if="!passwordResetSuccess">
                  <h1 class="title">Resseteja la contasenya</h1>
                  <p style="margin-bottom:1rem">T'enviarem un correu amb per canviar la teva contasenya</p>

                  <label class="label" for="email3">Email</label>
                  <input
                    v-model.trim="passwordForm.email"
                    type="text"
                    placeholder="elteu@email.com"
                    id="email3"
                  />

                  <button @click="resetPassword" class="button">Envia</button>

                  <div class="extras">
                    <a @click="togglePasswordReset">Torna al login</a>
                  </div>
                </div>
                <div v-else>
                  <h1 class="title">Correu enviat</h1>
                  <p>Comprova el teu correu per ressetejar la contrasenya</p>
                  <button @click="togglePasswordReset" class="button">Torna al login</button>
                </div>
              </form>

              <transition name="fade">
                <section v-if="errorMsg !== ''" class="zcolumns is-fullwith">
                  <div class="error-msg zcolumn is-full">
                    <p>{{ errorMsg }}</p>
                  </div>
                </section>
              </transition>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        email: "",
        password: "",
        checkbox: false
      },
      passwordForm: {
        email: ""
      },
      showLoginForm: true,
      showForgotPassword: false,
      passwordResetSuccess: false,
      performingRequest: false,
      errorMsg: ""
    };
  },
  methods: {
    toggleForm() {
      this.errorMsg = "";
      this.showLoginForm = !this.showLoginForm;
    },
    togglePasswordReset() {
      if (this.showForgotPassword) {
        this.showLoginForm = true;
        this.showForgotPassword = false;
        this.passwordResetSuccess = false;
      } else {
        this.showLoginForm = false;
        this.showForgotPassword = true;
      }
    },
    login() {
      this.performingRequest = true;

      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          
          this.$store.commit("setCurrentUser", user.user);
          this.$store.dispatch("fetchUserProfile");
          this.performingRequest = false;
          this.$router.push("/verify");
                      
          
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    signup() {
      if (this.signupForm.checkbox == false) {

      }
      this.performingRequest = true;

      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(user => {
          this.$store.commit("setCurrentUser", user.user);

          // create user obj
          fb.usersCollection
            .doc(user.user.uid)
            .set({
              name: this.signupForm.name,
              email: this.signupForm.email,              
              balance: 0,
              uploads: 0,
              xp: 0,
              downloads: 0,
              userLevel: 1,
              role: 'user',
              createdOn: new Date()
            })
            .then(() => {

              const actionCodeSettings = {            
                url: `${process.env.URLBASE}/verify`,
                handleCodeInApp: true
              };

              user.user.sendEmailVerification(actionCodeSettings);

              this.$store.dispatch("fetchUserProfile");
              this.performingRequest = false;
              this.$router.push("/verify");
            })
            .catch(err => {
              console.log(err);
              this.performingRequest = false;
              this.errorMsg = err.message;
            });
          
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    resetPassword() {
      this.performingRequest = true;

      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false;
          this.passwordResetSuccess = true;
          this.passwordForm.email = "";
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>
<style scoped>
.extras{
  margin-top: 2rem;
}
.extras a{
  display: block;
  margin-bottom:1rem;
}
.loading-info{
  font-family: 'Varela Round';
}
.login-section{
  margin-top: -10px;
}
#login{
  margin-top: 0px;
  margin-bottom: 0px;
}
.desc{
  font-family: 'Varela Round';
  color:#999
}
.checkbox input{
  width: 30px;
  margin-top: 1rem;
}
.educov-login{
  max-height: 40px;
  margin-bottom: 2rem;
}
</style>