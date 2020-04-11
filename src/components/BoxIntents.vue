<template>
  <section class="main-container">
    
    <div class="zcolumns zhas-margin-top-3 is-multiline is-desktop" v-if="intents && intents.length > 0">
      <table class="educov mt-2 table is-full">
        <tr>
          <th>QUI
          </th>
          <th>CORRECTES
          </th>          
          <th>PENDENTS
          </th>
          <th>QUAN
          </th>
          <th>RESULTAT
          </th>
          <th>VEURE
          </th>
        </tr>
        <tr v-for="intent in intents" v-bind:key="intent.id">
          <td>
            <router-link :to="`/user/${intent.userId}`" v-if="intent.public == true">
              {{ intent.userName }}
            </router-link>
            <span v-if="!intent.public || intent.public == false">
              Anònim
            </span>
          </td>
          <td>
            {{ intent.result.summary.resultsOK }} / {{ intent.result.results.length }}
          </td>          
          <td>
            {{ intent.result.summary.resultsPending }}
          </td>
          <td>
            {{ intent.endedOn | formatDate }}
          </td>
          <td>
            <span class="tag" v-bind:class="{ 'is-success': intent.result.summary.resultsOK >= intent.result.summary.resultsNeeded, 'is-danger': intent.result.summary.resultsOK < intent.result.summary.resultsNeeded }">
              {{ intent.result.summary.resultsOK >= intent.result.summary.resultsNeeded ? 'SUPERAT' : 'FALLAT' }}
            </span>          
          <td>
            <router-link class="button" :to="`/intent/${intent.id}`">
            VEURE
            </router-link>
          </td>
        </tr>
      </table>
    </div>

  </section>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
import BoxItemDetail from "@/components/BoxItemDetail";
import moment from "moment";

export default {
  components: {
    BoxItemDetail
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "boxes"])
  },
  data() {
    return {
      intents: [],
      boxId: '',
      users: [],
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.boxId = this.$route.params.id;
      this.viewIntents()
    }
  },
  watch: {
    $route(to, from) {
      // react to route changes...
      //console.log("to", to, from);
      if (this.$route.params.id) {
        this.boxId = this.$route.params.id;
        this.viewIntents()
      }
    }
  },
  methods: {
    viewIntents() {
      fb.intentsCollection.where("ended", "==", true).where("boxId", "==", this.boxId).orderBy('endedOn', 'desc')
        .onSnapshot(querySnapshot => {                            
            let intents = []
            querySnapshot.forEach(doc => {
                let intent = doc.data()
                intent.id = doc.id

                let userId = intent.userId

                if (intent.public == true) {
                  if (!this.users.find(u => u.id == userId)) {                    
                    fb.usersCollection.doc(userId).get().then(ref => {
                      let user = ref.data()
                      user.id = ref.id
                      let userInfo = { id: user.id, name: user.name }
                      this.users.push(userInfo)                      
                      this.$set(intent, 'userName', userInfo.name)

                    })
                  }
                  else {
                    let userName = this.users.find(u => u.id == userId).name
                    this.$set(intent, 'userName', userInfo.name)
                  }
                }
                
                intents.push(intent)
            })

            this.intents = intents
        })
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      moment.locale('ca')
      return moment(date).fromNow();
    },
    formatDate2(val) {
      if (!val) {
        return "";
      }
      return moment.unix(val).format("DD/MM/YYYY");
    },
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
th{
  color: #727475;
}
</style>