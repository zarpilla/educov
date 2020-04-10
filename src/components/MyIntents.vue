<template>
  <section class="main-container">
    <h3 class="title is-spaced">Reptes realitzats</h3>

    <UserIntents :intents="userIntents"></UserIntents>

    <p class="desc has-margin-top-3" v-if="userIntents && userIntents.length == 0">
      Encara no has superat cap repte
    </p>

  </section>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
import BoxItemDetail from "@/components/BoxItemDetail";
import UserIntents from "@/components/UserIntents";
import moment from "moment";

export default {
  components: {
    BoxItemDetail, UserIntents
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "userIntents", "boxes"])
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