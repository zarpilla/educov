<template>
  <div>
    <section class="login-bar">
      <div class="container">
        <div v-if="currentUser && userProfile">

          <span class="tag is-white is-help" title="Reptes superats">{{ userProfile.xp ? userProfile.xp : 0 }} SUPERATS</span>

          <span class="tag is-white is-help" title="Reptes proposats">{{ userProfile.uploads != null ? userProfile.uploads : '' }} PROPOSATS</span>

          <router-link class="user-profile ellipsis" to="/perfil" title="Actualitza el perfil">
            <i class="material-icons person">
            person
            </i>
            {{ userProfile.name }}
          </router-link>            
          
          <a class="button button-logout" @click="logout">
            <span class="is-hidden-mobile">SORTIR</span>
            <i class="material-icons exit">
            exit_to_app
            </i>
          </a>
        </div>
        <div v-if="!currentUser">
          <router-link class="button button-logout" to="/login">
            <span class="is-hidden-mobile">ENTRAR</span>
            <i class="material-icons exit">
            exit_to_app
            </i>
          </router-link>
        </div>
      </div>
    </section>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <router-link class="navbar-item logo" to="/">
            <img src="@/assets/images/educov-logo.png" />
          </router-link>
          

          <a
            role="button"
            class="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <router-link class="navbar-item zhas-text-primary" to="/">Tots els reptes</router-link>

            <router-link class="navbar-item zhas-text-primary" to="/superats" v-if="currentUser && userProfile && currentUser.emailVerified">Reptes realitzats</router-link>

            <router-link class="navbar-item zhas-text-primary" to="/els-meus" v-if="currentUser && userProfile && currentUser.emailVerified">Reptes proposats per tu</router-link>

            <router-link class="navbar-item zhas-text-primary" to="/ajuda">Com funciona</router-link>

            <router-link class="navbar-item zhas-text-primary" v-if="!currentUser" to="/login">Entrar</router-link>

            <a class="navbar-item zhas-text-primary is-hidden-desktop" v-if="currentUser"  @click="logout">Sortir</a>

            <router-link class="navbar-item zhas-text-primary" v-if="currentUser && userProfile && currentUser.emailVerified && userProfile.role != 'user'" to="/admin">Admin</router-link>

          </div>

          
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  mounted() {
    const $navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll(".navbar-burger"),
      0
    );

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach(el => {
        el.addEventListener("click", () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle("is-active");
          $target.classList.toggle("is-active");
        });
      });
    }
  },
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
nav{
  background: #FAFAFA;
  border-bottom: 1px solid #E6ECF0;
}
.login-bar{
  background-color: #49adc1;
  background-color: #49adc1;
  height: 40px;  
  text-align: right;
  font-family: 'Varela Round';
}
.login-bar .tag{
  margin-right: 10px;
  font-weight: bold;
}
a.user-profile{
  text-transform: uppercase;
  line-height: 40px;  
  font-size: 13px;
  color:#fff;
  margin: auto 20px;
  display: inline-block;
  max-width: 85px;
}
a.user-profile:hover{
  color:#0a0a0a;
}
.button-logout{
  padding: 0;
  background-color: #5fd8c2;
  background-color: #2c9cb2;
  border-radius: 0;
  margin-left: 10px;
  text-transform: uppercase;
  color:#0a0a0a;
  font-size: 13px;
  line-height: 40px;
  height: 40px;
}
.button-logout:hover{
  background-color: #49adc1;
  background-color: #49adc1;
  color:#fff;
}
a.navbar-item.logo{
  text-transform: uppercase;
  font-weight: bold;
  color: #49adc1;
  font-family: 'Varela Round';
  font-weight: bold;
  font-size: 24px;
}
a.navbar-item:not(.logo){
  color:#727475;
  font-size: 16px;
  font-family: 'Montserrat';
  padding: 0.5rem 1.25rem;
  text-transform: uppercase;
}
a.navbar-item:not(.logo):hover{
  color:#49ADC1;
  color:#49adc1;
}
.navbar-start{
  margin-left: .15rem;
}
.tag-notificacio{
  vertical-align: 15px;
}

.tag-notificacio:hover{
  color:#0a0a0a;
}
.person{
  vertical-align: -7px;
  margin-right: 4px;
}
.notifications{
  font-size: 18px;
  margin-left: 4px;
}
.exit{
  margin-left: 4px;
}
.is-help{
  cursor: help;
  vertical-align: 15px;
}
.logo b{
  font-weight: normal;
}
</style>