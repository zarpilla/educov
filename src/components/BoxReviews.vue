<template>
  <section style="">

   <div class="columns">
     <div class="column is-one-fifth stars">
       5 estrelles
    </div>
    <div class="column">
      <div class="bar">
        <div class="bar-inner" :style="{ width: p5 + '%' }"></div>
      </div>
    </div>
    <div class="column is-one-fifth value">
      {{ n5 }}
    </div>
  </div>
  <div class="columns">
     <div class="column is-one-fifth stars">
       4 estrelles
    </div>
    <div class="column">
      <div class="bar">
        <div class="bar-inner" :style="{ width: p4 + '%' }"></div>
      </div>
    </div>
    <div class="column is-one-fifth value">
      {{ n4 }}
    </div>
  </div>
  <div class="columns">
     <div class="column is-one-fifth stars">
       3 estrelles
    </div>
    <div class="column">
      <div class="bar">
        <div class="bar-inner" :style="{ width: p3 + '%' }"></div>
      </div>
    </div>
    <div class="column is-one-fifth value">
      {{ n3 }}
    </div>
  </div>
  <div class="columns">
     <div class="column is-one-fifth stars">
       2 estrelles
    </div>
    <div class="column">
      <div class="bar">
        <div class="bar-inner" :style="{ width: p2 + '%' }"></div>
      </div>
    </div>
    <div class="column is-one-fifth value">
      {{ n2 }}
    </div>
  </div>
  <div class="columns">
     <div class="column is-one-fifth stars">
       1 estrella
    </div>
    <div class="column">
      <div class="bar">
        <div class="bar-inner" :style="{ width: p1 + '%' }"></div>
      </div>
    </div>
    <div class="column is-one-fifth value">
      {{ n1 }}
    </div>
  </div>

  <div v-if="!canReview && currentUser && box.userId != currentUser.uid">
    <p class="desc">No pots valorar aquest repte per què encara no hi has participat</p>
  </div>
  <div v-if="currentUser && box.userId == currentUser.uid">
    <p class="desc">No pots valorar aquest repte per què és teu</p>
  </div>
  <div v-if="!canReview && !currentUser">
    <router-link to="/to" class="button has-margin-top-2" v-if="!currentUser">
      Registra't per poder fer valoracions
    </router-link>
  </div>


  <div v-if="canReview  && box.userId != currentUser.uid">        

    <h4 class="subtitle has-margin-top-2">
      La teva valoració
    </h4>

    <div class="my-stars">
      <i class="material-icons " @click="review(1)"  v-bind:class="{ 'has-text-grey-lighter' : myReviewValue == 0, 'has-text-warning' : myReviewValue >= 1 }">
      star
      </i>

      <i class="material-icons " @click="review(2)"  v-bind:class="{ 'has-text-grey-lighter' : myReviewValue <= 1, 'has-text-warning' : myReviewValue >= 2 }">
      star
      </i>

      <i class="material-icons " @click="review(3)"  v-bind:class="{ 'has-text-grey-lighter' : myReviewValue <= 2, 'has-text-warning' : myReviewValue >= 3 }">
      star
      </i>

      <i class="material-icons " @click="review(4)"  v-bind:class="{ 'has-text-grey-lighter' : myReviewValue <= 3, 'has-text-warning' : myReviewValue >= 4 }">
      star
      </i>

      <i class="material-icons " @click="review(5)"  v-bind:class="{ 'has-text-grey-lighter' : myReviewValue <= 4, 'has-text-warning' : myReviewValue >= 5 }">
      star
      </i>
    </div>
        
  </div>

  </section>
</template>

<script>
import { mapState } from "vuex";
import MyBoxes from '@/components/MyBoxes'
import { createNotification } from "../services/notifications.service";
import moment from "moment";
import { levelDescription, scopeDescription, stateDescription } from '../services/descriptions.filters';
import BoxContent from "@/components/BoxContent.vue";
const fb = require("../firebaseConfig.js");

export default {
  components: {
  },
  props: {
    boxId: 0,
    box: {},
    canReview: false,    
  },
  data() {
    return {
      reviews: [],
      myReviewValue: 0,
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0,
      n5: 0,
      p1: 0,
      p2: 0,
      p3: 0,
      p4: 0,
      p5: 0
    };
  },
  mounted() {
    this.viewReviews();
  },
  watch: {
  },
  computed: {
    ...mapState(["userProfile", "currentUser"])
  },
  methods: {    
    viewReviews() {
      fb.reviewsCollection.where('boxId', '==', this.boxId)
      .get()
      .then(docs => {
        let reviews = []
        docs.forEach(doc => {
          let review = doc.data()
          review.id = doc.id
          
          console.log('viewReviews')
          
          if (this.currentUser != null && review.userId == this.currentUser.uid) {
            this.myReviewValue = review.value
          }
          else {
            reviews.push(review)
          }
        })
        this.reviews = reviews
        
        this.calcReviews()
        
      })
    },    
    calcReviews() {
      let reviews = this.reviews.map(r => { return { value : r.value} })

      if (this.myReviewValue > 0) {
        reviews.push({ value: this.myReviewValue })  
      }      

      this.n1 = 0
      this.n2 = 0
      this.n3 = 0
      this.n4 = 0
      this.n5 = 0

      reviews.forEach(review => {
          if (review.value == 1) {
            this.n1++
          }
          if (review.value == 2) {
            this.n2++
          }
          if (review.value == 3) {
            this.n3++
          }
          if (review.value == 4) {
            this.n4++
          }
          if (review.value == 5) {
            this.n5++
          }
      })

      if (reviews.length > 0) {
          this.p1 = this.n1 / reviews.length * 100
          this.p2 = this.n2 / reviews.length * 100
          this.p3 = this.n3 / reviews.length * 100
          this.p4 = this.n4 / reviews.length * 100
          this.p5 = this.n5 / reviews.length * 100
      }

    },
    review(value) {

      let docId = `${this.currentUser.uid}_${this.boxId}`

      fb.reviewsCollection
        .doc(docId)
        .set({
          boxId: this.boxId,
          userId: this.currentUser.uid,
          value: value,
          weight: this.userProfile.userLevel,
          createdOn: new Date()
        })
        .then(() => {

          fb.reviewsCollection.where('boxId', '==', this.boxId).get()
          .then(docs => {
            let reviewsArray = [];

            let reviews = 0
            let reviewsValue = 0
            let weight = 0

            docs.forEach(doc => {
              let review = doc.data();
              reviews++
              weight = weight + review.weight
              reviewsValue = reviewsValue + ( review.value * review.weight)

              if (review.userId == this.currentUser.uid) {
                this.myReviewValue = review.value
              }
            });
            reviewsValue = reviewsValue / weight

            fb.boxesCollection
            .doc(this.boxId)
            .update({
              reviews: reviews,
              reviewsValue: reviewsValue,
            }).then(() => {

              this.calcReviews()

              this.$emit('reviewsUpdated', { reviews: reviews, reviewsValue: reviewsValue })

              //this.box.reviews = reviews
              //this.box.reviewsValue = reviewsValue
            })

          })        

        })
    },
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
    }
  },
  filters: {    
    formatDate(val) {
      if (!val) {
        return "";
      }
      return moment.unix(val).format("DD/MM/YYYY")
    }
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
.bar{
  width: 100%;
  float: left;
  height: 10px;
  background-color:#e4e4e4;
  border-radius: 3px;
  margin-top: 6px;
  position: relative;
}
.bar-inner{
  background-color:#ffb72f;
  position: absolute;
  top:0;
  left: 0;
  height: 10px;
  /* border-top-left-radius: 3px;
  border-bottom-left-radius: 3px; */
  border-radius: 3px;
}
.stars{  
  color: #727475;
  font-weight: bold;
  
}
.value {
  font-family: 'Varela Round'; 
  color: #a3a3a3;
  margin-left: 20px;
}
.my-stars i{
  font-size: 40px;
  cursor: pointer;
}
</style>