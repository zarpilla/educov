<template>
  <section class="main-container">
    <div class="columns row-reverse-mobile" v-if="mode == 'view'">
      <div class="column is-one-quarter">

        <h3 class="title is-spaced is-hidden-desktop">
          {{ box.name }}          
        </h3>

        <div class="box has-text-centered">
          <h3
            class="title is-1 has-text-white has-margin-bottom-1"
          >{{ box.reviewsValue > 0 ? box.reviewsValue : '-' | formatReview }}</h3>
          <div class="stars has-text-warning">
            <i class="material-icons has-text-white" v-if="box.reviewsValue == 0">star</i>
            <i class="material-icons" v-if="box.reviewsValue == 0.5">star_half</i>
            <i class="material-icons" v-if="box.reviewsValue >= 1">star</i>

            <i class="material-icons has-text-white" v-if="box.reviewsValue <= 1">star</i>
            <i class="material-icons" v-if="box.reviewsValue == 1.5">star_half</i>
            <i class="material-icons" v-if="box.reviewsValue > 1.5">star</i>

            <i class="material-icons has-text-white" v-if="box.reviewsValue <= 2">star</i>
            <i class="material-icons" v-if="box.reviewsValue == 2.5">star_half</i>
            <i class="material-icons" v-if="box.reviewsValue > 2.5">star</i>

            <i class="material-icons has-text-white" v-if="box.reviewsValue <= 3">star</i>
            <i class="material-icons" v-if="box.reviewsValue == 3.5">star_half</i>
            <i class="material-icons" v-if="box.reviewsValue > 3.5">star</i>

            <i class="material-icons has-text-white" v-if="box.reviewsValue <= 4">star</i>
            <i class="material-icons" v-if="box.reviewsValue == 4.5">star_half</i>
            <i class="material-icons" v-if="box.reviewsValue > 4.5">star</i>
          </div>
          <div class="reviews">
            {{ box.reviews }}
            <span v-if="box.reviews == 1">valoració</span>
            <span v-if="box.reviews != 1">valoracions</span>
          </div>
        </div>
        <div class="button text-center is-full has-margin-bottom-1" @click="selectedMenu = 6" v-if="box.liveDate && box.liveDate != ''">
          EN DIRECTE!
        </div>
        <ul class="info">
          <li class="has-text-right" v-if="currentUser">
            <span class="text">
              <span class="tag is-info tu-tag" v-if="currentUser && box.userId == currentUser.uid">ETS TU</span>
              <router-link v-if="currentUser"
                class="link-to-user"
                v-bind:to="`/user/${box.userId}`"
              >{{ box.user ? box.user.name : '-' }}</router-link>
              <span v-if="!currentUser">{{ box.user ? box.user.name : '-' }}</span>

              <i class="material-icons">person</i>
            </span>
          </li>          
          <li class="has-text-right">
            {{ box.createdOn ? box.createdOn.seconds : '' | formatDate }}
            <i
              class="material-icons"
            >schedule</i>
          </li>
          <li class="has-text-right">
            {{ ( box.level || '-' ) | levelDescription }}
            <i class="material-icons">menu_open</i>
          </li>
          <li v-for="s in box.scopes" v-bind:key="s" class="has-text-right">
            {{ s | scopeDescription }}
            <i class="material-icons">group_work</i>
          </li>
          <li v-if="box.minAge && box.maxAge" class="has-text-right">
            De {{ box.minAge | ageDescription }} a {{ box.maxAge | ageDescription }}
            <i class="material-icons">supervisor_account</i>
          </li>

          <li v-if="box.milestones && box.milestones.length > 0" class="has-text-right">
            {{ box.milestones.length }} activitats
            <i class="material-icons">build</i>
          </li>          
          <li class="has-text-right">
            {{ box.downloads }} intents
            <span class="material-icons">new_releases</span>
          </li>
          <li class="has-text-right" v-if="!currentUser || box.successIntents == 0">
            {{ box.successIntents }} intents superats
            <span class="material-icons">check_circle</span>
          </li>
          <li class="has-text-right" v-if="currentUser && box.successIntents > 0">
            <router-link :to="`/results/${boxId}`">
              {{ box.successIntents }} intents superats
              <span class="material-icons">check_circle</span>
            </router-link>            
          </li>
          <li class="has-text-right">
            {{ box.comments }} comentaris
            <i class="material-icons">chat</i>
          </li>
        </ul>
        <ul class="info info-buttons">
          <li class="text-center">
            
            <button @click="start()" class="button has-margin-top-2 is-full" v-if="box.milestones.length > 0">
              Començar repte!
            </button>            
          </li>
          <li v-if="currentUser && box.userId == currentUser.uid" class="text-center admin-buttons">
            <button class="button" @click="editBox" v-if="currentUser && box.userId == currentUser.uid">Edita</button>
            <button class="button" @click="deleteBox" v-if="currentUser && box.userId == currentUser.uid && box.state != 'active'">Esborra</button>            
          </li>
        </ul>
      </div>      
      <div class="column">
        <h3 class="title is-spaced is-hidden-mobile">
          {{ box.name }}          
        </h3>

        <nav class="level">
          <div
            class="level-item has-text-centered"
            v-bind:class="{ 'selected-menu': selectedMenu == 0 }"
            @click="selectMenu(0)"
          >Descripció</div>
          <div
            class="level-item has-text-centered"
            v-bind:class="{ 'selected-menu': selectedMenu == 1 }"
            @click="selectMenu(1)"
          >Contingut</div>
          <div v-if="box.liveDate && box.liveDate != ''"
            class="level-item has-text-centered"
            v-bind:class="{ 'selected-menu': selectedMenu == 6 }"
            @click="selectMenu(6)"
          >En Directe!</div>
          <div
            class="level-item has-text-centered"
            v-bind:class="{ 'selected-menu': selectedMenu == 5 }"
            @click="selectMenu(5)"
          >Activitats</div>

          <div
            class="level-item has-text-centered"
            v-bind:class="{ 'selected-menu': selectedMenu == 2 }"
            @click="selectMenu(2)"
          >Comentaris</div>
          <div
            class="level-item has-text-centered"
            v-bind:class="{ 'selected-menu': selectedMenu == 3 }"
            @click="selectMenu(3)"
          >Valoracions</div>
          <div class="level-item" v-bind:class="{ 'selected-menu': selectedMenu == 4 }"></div>
          <div class="level-item" v-bind:class="{ 'selected-menu': selectedMenu == 4 }"></div>
        </nav>
        <div class="detail-info">

          <div v-if="selectedMenu == 0">
            <h4 class="subtitle">
                Descripció            
            </h4>
            <p class="desc preserve-lines"  v-html="box.description" v-linkified></p>

            <h4 v-if="box.targets && box.targets != ''" class="subtitle">Objectius</h4>
            <p
              v-if="box.targets && box.targets != ''"
              class="desc"
              style="white-space: pre-line;"
            >{{ box.targets }}</p>

            <h4 v-if="box.duration && box.duration != ''" class="subtitle">Durada</h4>
            <p v-if="box.duration && box.duration != ''" class="desc">{{ box.duration }}</p>

            <button @click="start()" class="button has-margin-top-2" v-if="box.milestones.length > 0">
              Començar repte!
            </button>
            

          </div>

          <div v-if="selectedMenu == 6">
            <h4 class="subtitle">
                En directe
            </h4>
            <p v-if="box.liveDate != ''" class="desc">Aquest repte te contingut en directe</p>
            <p v-if="box.liveDate != ''" class="desc"><b>Dia:</b> {{ box.liveDate }}</p>
            <p v-if="box.liveHour != ''" class="desc"><b>Hora:</b> {{ box.liveHour }}</p>
            <p class="desc" v-if="liveDateTime != ''">
              <b>Concretament quan?</b> {{ liveDateTime }}
            </p>

            <a class="button has-margin-top-2" target="_blank" :href="box.liveLink" :disabled="box.liveLink == ''">ENLLAÇ AL DIRECTE</a>
          </div>

          <div v-if="selectedMenu == 1">
            <h4 class="subtitle">
                Contingut
            </h4>

            <BoxContent
              v-if="true || canAccess"
              v-bind:prefix="'boxes'"
              v-bind:box-id="boxId"
              v-bind:box="box"
              v-bind:editable="false"
              v-bind:update="false"
            ></BoxContent>

            <table class="links is-full">          
              <tbody>
                <tr v-for="(link, index) in box.links" v-bind:key="link" v-bind:class="{ first: index == 0}">
                  <td>
                    <i class="material-icons is-pulled-left link-icon" >
                      link
                    </i>
                  </td>
                  <td class="link">
                    <span class="ellipsis" v-html="link" v-linkified></span>                
                  </td>
                  <td class="actions">
                    <div class="actions-div">
                      <i class="material-icons is-pulled-left" title="Anar-hi" @click="viewLink(link)">
                      remove_red_eye
                      </i>
                    </div>            
                  </td>
                </tr>
              </tbody>
            </table>
 
            <button @click="start()" class="button has-margin-top-2" v-if="box.milestones.length > 0">
              Començar repte!
            </button>


          </div>

          <div v-if="selectedMenu == 2">
            <h4 class="subtitle">
                Comentaris
            </h4>
            <p class="desc" v-if="comments.length == 0">Encara no hi ha comentaris</p>

            <div class="comments mt-2 is-full" v-if="comments.length > 0">
              <div v-for="c in comments" v-bind:key="c.id" class="comment">
                <div class="level">
                  <div class="level-left">
                    <div class="level-item first-left">
                      <span class="user-initial">
                        {{ c.user.name | firstInitial }}
                      </span>
                    </div>
                    <div class="level-item">
                      <router-link v-if="currentUser" class="link-to-user" v-bind:to="`/user/${c.userId}`">{{ c.user.name }}</router-link>
                      <span v-if="!currentUser">{{ c.user.name }}</span>
                    </div>
                    <div class="level-item">
                      <span class="date">{{ c.createdOn | formatDateComment }}</span>
                    </div>
                  </div>
                </div>
                
                <p class="desc comment-text preserve-lines">{{ c.content }}</p>
              </div>
            </div>
            <h4
              class="subtitle has-margin-top-3"
              v-if="currentUser"
            >Afegeix un comentari</h4>
            <form v-if="currentUser" @submit.prevent>
              <textarea
                v-model.trim="comment"
                type="text"
                :placeholder="'El teu comentari...'"
                maxlength="1500"
              ></textarea>
              <button
                @click="addComment()"
                :disabled="comment == ''"
                class="button is-primary"
              >comentar</button>
            </form>

            <router-link to="/to" class="button has-margin-top-2" v-if="!currentUser">
              Registra't per poder fer comentaris
            </router-link>
          </div>

          <div v-if="selectedMenu == 3">
            <h4 class="subtitle">
                Valoracions
            </h4>
            <BoxReviews
              v-bind:box-id="boxId"
              v-bind:box="box"
              v-bind:can-review="currentUser && userIntents.find(i => i.boxId == this.boxId) != null"
              @reviewsUpdated="onReviewsUpdated"
            ></BoxReviews>
          </div>

          <div v-if="selectedMenu == 5">
            <h4 class="subtitle">
                Activitats
            </h4>
            <p class="desc" v-if="true || !canAccess">
              Aquest repte conté {{ box.milestones.length }} activitats. 
              <br>
              <span v-if="box.okAnswers > 0 && box.okAnswers != box.milestones.length">
              Cal resoldre correctament {{ box.okAnswers }} activitats per superar el repte. 
              </span>
              <span v-if="!box.okAnswers || box.okAnswers == box.milestones.length">
              Cal resoldre correctament totes les activitats per superar el repte. 
              </span>
            </p>

            <button @click="start()" class="button has-margin-top-2" v-if="box.milestones.length > 0">
              Començar repte!
            </button>
          </div>

        </div>

      </div>
      
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import BoxActivities from "@/components/BoxActivities";
import { createNotification } from "../services/notifications.service";
import moment from "moment";
import {
  levelDescription,
  scopeDescription,
  dimensionDescription,
  competenceDescription,
  stateDescription
} from "../services/descriptions.filters";
import BoxContent from "@/components/BoxContent.vue";
import BoxReviews from "@/components/BoxReviews.vue";
import { scopes } from "../services/scope.service";
const fb = require("../firebaseConfig.js");

export default {
  components: {
    BoxActivities,
    BoxContent,
    BoxReviews
  },
  computed: {
    liveLinkFixed() {
      if (this.box && this.box.liveLink && !this.box.liveLink.startsWith('http')) {
        return 'http://' + this.box.liveLink;
      }
      return box.liveLink;
    }
  },
  data() {
    return {
      boxId: 0,
      box: {},
      boxUser: {},
      showSuccess: false,
      canDownload: false,
      canAccess: false,
      myReviewValue: 0,
      comment: "",
      comments: [],
      selectedMenu: 0,      
      mode: 'view',
      intentId: ''
    };
  },
  mounted() {
    if (this.$route.params.id) {
      this.boxId = this.$route.params.id;
      this.viewBox();
    }
  },
  watch: {
    $route(to, from) {
      // react to route changes...
      //console.log("to", to, from);
      if (this.$route.params.id) {
        this.boxId = this.$route.params.id;
        this.viewBox();
      }
    }
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "userIntents"]),
    liveDateTime() {
      if (this.box.liveDate && this.box.liveDate != '' && this.box.liveHour && this.box.liveHour != '') {
        let m = moment(`${this.box.liveDate} ${this.box.liveHour}`, 'DD/MM/YYYY HH:mm')
        moment.locale('ca')
        return m.fromNow();
      }
      else {
        return ''
      }
      
      return 
    }
  },
  methods: {
    selectMenu(menu) {
      this.selectedMenu = menu

      if (window.innerWidth <= 1024) {
        document.querySelector('.detail-info').scrollIntoView({ 
          behavior: 'smooth' 
        });
      }

    },
    viewBox() {
      //console.log('this.boxId', this.boxId)
      fb.boxesCollection
        .doc(this.boxId)
        .get()
        .then(doc => {
          if (doc.exists) {
            let box = doc.data();
            box.id = doc.id;
            this.box = box;

            fb.usersCollection
              .doc(box.userId)
              .get()
              .then(doc => {
                if (doc.exists) {
                  let user = doc.data();
                  user.id = doc.id;
                  this.boxUser = user;
                }
              });


            fb.commentsCollection
              .where("boxId", "==", this.boxId)
              .get()
              .then(docs => {
                let comments = [];
                docs.forEach(doc => {
                  let comment = doc.data();
                  comment.id = doc.id;
                  comment.createdOnSeconds = comment.createdOn.seconds;
                  comments.push(comment);
                });
                this.comments = this.sortByKey(comments, "createdOnSeconds");
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteBox() {
      this.$swal({
        title: "Esborrar repte?",
        text: "Estas segur/a?",
        icon: "question",
        confirmButtonText: "Sí",
        showCancelButton: true,
        cancelButtonText: "No"
      }).then(result => {
        if (result.value) {
          fb.boxesCollection
            .doc(this.boxId)
            .update({
              state: "deleted"
            })
            .then(doc => {
              this.box.state = "deleted";
              this.$router.push("/els-meus");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    editBox() {
      this.$router.push(`/box-edit/${this.boxId}`);
    },
    // review(value) {
    //   let docId = `${this.currentUser.uid}_${this.boxId}`;

    //   fb.reviewsCollection
    //     .doc(docId)
    //     .set({
    //       boxId: this.boxId,
    //       userId: this.currentUser.uid,
    //       value: value,
    //       weight: this.userProfile.userLevel,
    //       createdOn: new Date()
    //     })
    //     .then(() => {
    //       fb.reviewsCollection
    //         .where("boxId", "==", this.boxId)
    //         .get()
    //         .then(docs => {
    //           let reviewsArray = [];

    //           let reviews = 0;
    //           let reviewsValue = 0;
    //           let weight = 0;

    //           docs.forEach(doc => {
    //             let review = doc.data();
    //             reviews++;
    //             weight = weight + review.weight;
    //             reviewsValue = reviewsValue + review.value * review.weight;

    //             if (review.userId == this.currentUser.uid) {
    //               this.myReviewValue = review.value;
    //             }
    //           });
    //           reviewsValue = reviewsValue / weight;

    //           fb.boxesCollection
    //             .doc(this.boxId)
    //             .update({
    //               reviews: reviews,
    //               reviewsValue: reviewsValue
    //             })
    //             .then(() => {
    //               this.box.reviews = reviews;
    //               this.box.reviewsValue = reviewsValue;
    //             });
    //         });
    //     });
    // },
    addComment() {
      let boxId = this.boxId;
      let boxComments = this.box.comments;

      fb.commentsCollection
        .add({
          createdOn: new Date(),
          content: this.comment,
          boxId: boxId,
          userId: this.currentUser.uid,
          user: {
            name: this.userProfile.name,
            email: this.userProfile.email
          }
        })
        .then(doc => {
          fb.boxesCollection
            .doc(boxId)
            .update({
              comments: boxComments + 1
            })
            .then(() => {
              //this.closeCommentModal();
              this.comment = ''
              //this.box.comments++
              this.viewBox();
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    onReviewsUpdated(info) {
      this.box.reviews = info.reviews;
      this.box.reviewsValue = info.reviewsValue;
    },
    viewLink(link) {
      window.open(link)
    },
    start() {
      let msg = ''
      if (!this.currentUser) {
        msg = `Si vols guardar els teus resultats, si us plau, registra't abans de continuar`
      }

      this.$swal({
        title: "Començar repte?",
        text: "Assegura't d'haver consultat els continguts abans de començar el repte. " + msg,
        icon: "question",
        confirmButtonText: "Sí",
        showCancelButton: true,
        cancelButtonText: "No"
      }).then(result => {
        if (result.value) {
          fb.intentsCollection.add({
              createdOn: new Date(),            
              boxId: this.boxId,
              userId: this.currentUser ? this.currentUser.uid : '', 
            })
            .then(doc => {
              this.intentId = doc.id              
              // this.mode = 'activity'
              this.$router.push(`/intent/${this.intentId}`)
            })
            .catch(err => {
                console.log(err);
            });

        }
      });

    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "";
      }
      return moment.unix(val).format("DD/MM/YYYY");
    },
    formatDateComment(val) {
      if (!val) {
        return "";
      }
      let date = val.toDate();
      moment.locale('ca')
      return moment(date).fromNow();      
      //return moment.unix(val).format("DD/MM/YYYY HH:mm");
    },
    
    formatReview(val) {
      if (!val || val == '-') {
        return "-";
      }
      return Math.round(val * 10) / 10
    },
    firstInitial(val) {
      if (val && val.length > 0) {
        return val.substring(0,1);
      }
      return ``;
    },
  }
};
</script>
<style scoped>
p.desc, li.desc {
  font-size: 16px;
  font-family: "Varela Round";
  color: #a3a3a3;  
  line-height: 30px;
}
li.desc{
  line-height: 20px;
}
.title {
  margin-bottom: 2.5rem;
}
.subtitle {
  margin-top: 1.5rem;
}

ul.info {
  background: #f9f9f9;
  border: 2px solid #f1f1f1;
  border-bottom: 0;
  list-style: none;
}
ul.info li {
  border-bottom: 2px solid #dbdbdb;
  border-bottom: 2px solid #f1f1f1;
  padding: 12px 12px;
  font-size: 16px;
  font-family: "Varela Round";
  color: #727475;
  color: #a3a3a3;
  line-height: 30px;
}
ul.info .material-icons {
  vertical-align: -7px;
  margin-left: 10px;
}
ul.info .text {
  text-align: right;
  display: inline-block;
}
ul.info .text-center {
  text-align: center;
}
ul.info .admin-buttons button {
  margin-bottom: 0.5rem;
}
ul.info-buttons {
  background: none;
  border: 0;
}
ul.info-buttons li {
  border: 0;
}
.reviews {
  color: #a3a3a3;
  font-family: "Varela Round";
}
.title.has-margin-bottom-1 {
  margin-bottom: 1rem !important;
}
.is-full {
  width: 100%;
}
ul.menu {
  border-bottom: 2px solid #f1f1f1;
}
nav.level {
  border-bottom: 2px solid #f1f1f1;
}
.level-item {
  color: #727475;
  padding: 20px;
  cursor: pointer;
}
.selected-menu {
  box-shadow: 0 2px 0 #ffb72f;
}
.tu-tag {
  margin-right: 6px;
}
.box {
  background-color: #34495e;
}
.comment-text {
  margin-bottom: 1.5rem;
  line-height: 22px !important;
}
p .date {
  color: #727475;
  padding-left: 10px;
}
.title .tag {
  text-transform: uppercase;
  font-weight: normal;
  font-family: "Varela Round";
}
table.links{
  max-width: 100%;
}
table.links td.link span{
  margin-left: 50px;
  display: inline-block;
  max-width: 600px;
  cursor: pointer;
}
.link-to-user{
color: #727475;
font-weight: bold;
font-size: 16px;
line-height: 30px;
}
.date{
  color: #a3a3a3;
  font-family: "Varela Round";
  font-size: 16px;
  line-height: 30px;
}
.user-initial{
  background: #c3c3c3;
  color: #fff;
  font-family: "Varela Round";
  font-size: 16px;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  text-transform: uppercase;
}
.comment .level-item{
  padding: 10px;
}
.comment .level-item.first-left {
  padding-left: 0px;
}
.link-icon{
  color: #999;
  margin-top: 6px;
  margin-left: 10px;
  font-size: 28px;
}
.detail-info{
  padding-top: 1rem;
}

@media screen and (min-width: 1024px) {
  .row-reverse-mobile{
    flex-direction: row-reverse;
  }
}   

</style>