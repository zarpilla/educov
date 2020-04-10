<template>
  <section class="main-container">
    <div class="zcontainer">

      <div class="level">
        <div class="level-left">
          <div class="level-item user-photo" v-if="user.photo != ''">
            <UserPhoto class="z"  v-bind:editable="false" v-bind:user-id="user.id" ></UserPhoto>            
          </div>
          <div class="level-item">
            <h3 class="title">{{ user.name }}</h3>      
          </div>
        </div>
      </div>
      
      <p class="desc mt-3">{{ user.description }}</p>
            
      <h4 class="title is-spaced mt-3">Reptes realitzats</h4>
      <UserIntents v-if="intents.length > 0" :intents="intents"></UserIntents>

      <p class="desc" v-if="intents.length == 0"> {{ user.name }} encara no te reptes</p>

      <h4 class="title is-spaced mt-3">Reptes proposats</h4>
      <div class="columns is-multiline is-desktop">
        <div class="column is-one-third" v-for="box in userBoxes" v-bind:key="box.id">
          <BoxItemDetail :box="box"></BoxItemDetail>
        </div>
      </div>
      <p class="desc" v-if="userBoxes.length == 0"> {{ user.name }} encara no te reptes</p>

      

    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
import BoxItemDetail from '@/components/BoxItemDetail'
import UserPhoto from '@/components/UserPhoto'
import UserIntents from '@/components/UserIntents'

export default {
  components: {
    BoxItemDetail, UserPhoto, UserIntents
  },
  data() {
    return {
      showSuccess: false,
      userId: "",
      user: {},
      userBoxes: [],
      intents: []
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser"])
  },
  mounted() {    
    if (this.$route.params.id) {
      this.userId = this.$route.params.id;
      this.viewUser();
    }
  },
  watch: {
    $route(to, from) {
      // react to route changes...
      if (this.$route.params.id) {
        this.userId = this.$route.params.id;
        this.viewUser();
      }
    }
  },
  created() {},
  methods: {
    viewUser() {
      fb.usersCollection
        .doc(this.userId)
        .get()
        .then(doc => {
          if (doc.exists) {
            let user = doc.data()
            user.id = doc.id
            this.user = user
            this.getUserBoxes()
            this.getUserIntents()
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getUserBoxes() {

      let states = ['active', 'new']

      if (this.userId == this.currentUser.uid) {
          states.push('new')
          states.push('draft')
      }
            
      fb.boxesCollection.where("environment", "==", process.env.BOX_ENV).where("userId", "==", this.userId).where('state', 'in', states).orderBy('createdOn', 'desc')
            .onSnapshot(querySnapshot => {
                            
                let userBoxes = []
                querySnapshot.forEach(doc => {
                    let box = doc.data()
                    box.id = doc.id
                    userBoxes.push(box)
                })

                this.userBoxes = userBoxes

                //commit('setUserBoxes', userBoxes)            

            });
    },
    getUserIntents() {
      fb.intentsCollection.where("ended", "==", true).where("userId", "==", this.userId).where("public", "==", true).orderBy('endedOn', 'desc')
        .get().then(docs => {
            let intents = []
            docs.forEach(doc => {
                let intent = doc.data()
                intent.id = doc.id
                intents.push(intent)
            })
            this.intents = intents
        });
    }
  }
};
</script>
<style scoped>
.mt-3{
  margin-top: 3rem;
}
p.desc{
  font-size: 16px;
  font-family: 'Varela Round';
  color: #a3a3a3;
  line-height: 30px;
}
.table td{
  text-align: center;
}
@media screen and (min-width: 742px) {
  .user-photo{
    margin-right: 30px!important;
  }
}



</style>
