<template>
  <section class="main-container">
    <div class="columns">
      <div class="column">
        <h3 class="title is-spaced">Els meus reptes</h3>
      </div>
      <div class="column zhas-margin-top-2 is-one-third ">
        <router-link v-if="userBoxes && userBoxes.length > 0" class="is-pulled-right button" to="/box-edit">Afegeix un repte</router-link>
      </div>
    </div>
    <div class="columns is-multiline is-desktop" v-if="userBoxes && userBoxes.length > 0">
      <div class="column is-one-third" v-for="box in userBoxes" v-bind:key="box.id">
        <BoxItemDetail :box="box"></BoxItemDetail>
      </div>
    </div>
    <p class="desc has-margin-top-3" v-if="userBoxes && userBoxes.length == 0">
      Encara no has creat cap repte
    </p>
    <router-link v-if="userBoxes && userBoxes.length == 0" class="button has-margin-top-2" to="/box-edit">Afegeix un repte</router-link>
  </section>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
import BoxItemDetail from '@/components/BoxItemDetail'

export default {
  components: {
    BoxItemDetail
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "userBoxes"])
  },
  created () {
  },
  methods: {
  }
};
</script>
<style scoped>
p.desc{
  font-size: 16px;
  font-family: 'Varela Round';
  color: #a3a3a3;
  line-height: 30px;
}
</style>