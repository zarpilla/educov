<template>
  <section class="main-container">
    
    <div class="zcolumns zhas-margin-top-3 is-multiline is-desktop" v-if="intents && intents.length > 0">
      <table class="educov mt-2 table is-full">
        <tr>
          <th>REPTE
          </th>
          <th>CORRECTES
          </th>          
          <th>PENDENTS
          </th>
          <th>QUAN
          </th>
          <th>RESULTAT
          </th>          
          <th>PÚBLIC
          </th>          
          <th>VEURE
          </th>
        </tr>
        <tr v-for="intent in intents" v-bind:key="intent.id">
          <td>
            <router-link :to="`/repte/${intent.boxId}`">
            {{ boxes.find(b => b.id == intent.boxId).name }}
            </router-link>
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
            {{ intent.public ? 'SÍ' : 'NO' }}
          </td>
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
  props: {
    intents: Array    
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