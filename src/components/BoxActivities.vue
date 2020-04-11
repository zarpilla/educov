<template>
  <section class="main-container">
    <div v-if="mode == 'answers'">   
      <h3 class="title zis-spaced">
          {{ box.name }}          
      </h3>

      <form @submit.prevent style="margin-top:40px" v-if="results && results.length > 0">
        <h5 class="title zis-spaced preserve-lines">
            <div class="tag is-warning">{{ milestoneIndex + 1 }}/{{ results.length }}</div> {{ results[milestoneIndex].name }}
        </h5>
        <div class="more desc" v-if="results[milestoneIndex].instructions != ''">          
          <!-- {{ results[milestoneIndex].instructions }} -->
          <div class="preserve-lines" v-html="results[milestoneIndex].instructions" v-linkified />
        </div>
        <div class="columns" v-if="results[milestoneIndex].type == 'answer'">
          <div class="column">
            <label class="label">Resposta</label>
            <input v-model.trim="results[milestoneIndex].answer" type="text" :placeholder="''" maxlength="150" id="results.answer" />
          </div>
        </div>
        <div class="columns is-mobile is-multiline" v-if="results[milestoneIndex].type == 'abcd'">
          <div class="column is-half-mobile" v-for="(a, i) in results[milestoneIndex].shuffled" v-bind:key="i">
            <!-- <label class="label">{{ abcd[i] }}</label> -->
            <button class="button is-full has-margin-bottom-2" @click="resultAbcd(i)" v-bind:class="{ 'is-warning': results[milestoneIndex].answer == a, 'is-primary': results[milestoneIndex].answer != a }">
              {{ a }}
            </button>
          </div>
        </div>
        <div class="columns" v-if="results[milestoneIndex].type == 'open'">
          <div class="column">
            <label class="label">Resposta</label>
            <textarea v-if="results[milestoneIndex].answerType == 'open'" v-model.trim="results[milestoneIndex].answer" type="text" :placeholder="''" maxlength="5000" id="results.answer" ></textarea>

            <FileUpload v-if="results[milestoneIndex].answerType == 'document'" class="has-margin-bottom-2" v-bind:accept="'*/*'" v-bind:prefix="'results'" v-bind:box-id="intentId + '/' + results[milestoneIndex].id " @uploaded="onUploaded"></FileUpload>

            <BoxContent v-if="results[milestoneIndex].answerType == 'document'" v-bind:prefix="'results'" v-bind:box-id="intentId + '/' + results[milestoneIndex].id" v-bind:box="box" v-bind:editable="true" v-bind:update="update"></BoxContent>

          </div>
        </div>
        
        <a class="button is-warning" @click="milestoneIndex--" v-if="milestoneIndex > 0">
          <i class="material-icons">
            arrow_back
          </i>
          Anterior
        </a>
        <button class="button is-warning" @click="next()" v-if="results.length > milestoneIndex">
          Següent
          <i class="material-icons">
            arrow_forward
          </i>
        </button>
      </form>

    </div>
    <div v-if="mode == 'review'" class="review">    
      <h3 class="title zis-spaced">
          {{ box.name }}          
          <span class="subtext tag is-success" v-if="resultsOK >= ( box.okAnswers || results.length)">
            REPTE SUPERAT
          </span>
          <span class="subtext tag is-danger" v-if="resultsOK < ( box.okAnswers || results.length)">
            REPTE NO SUPERAT
          </span>
      </h3>
      

      <div class="summary has-margin-bottom-1 bbz">
        <div class="columns">
          <div class="column">
            <span class="subtext tag is-success">
              {{ resultsOK }} 
            </span>
            <span class="subtext sum">
            Respostes correctes
            </span>
          </div>
          <div class="column">
            <span class="subtext tag is-danger">
              {{ resultsKO }} 
            </span>
            <span class="subtext sum">
            Respostes incorrectes
            </span>            
          </div>
          <div class="column">
            <span class="subtext tag is-warning">
              {{ resultsPending }} 
            </span>
            <span class="subtext sum">
            Pendents d'avaluar
            </span>
            
          </div>
        </div>
      </div>

      <div class="do-public bb" v-if="intent.userId == currentUser.uid">        
        <label class="label" v-if="box.level != ''">Vols fer públic el resultat?</label>
        <div class="columns has-margin-bottom-2">
          <div class="column is-one-quarter">
            <button @click="doPublic(false)" class="button content-button" v-bind:class="{ 'is-light': intent.public, 'is-primary': !intent.public }">
              NO
            </button>
          </div>
          <div class="column is-one-quarter">
            <button @click="doPublic(true)" class="button content-button" v-bind:class="{ 'is-light': !intent.public, 'is-primary': intent.public }">
              SÍ
            </button>
          </div>
        </div>
      </div>

      <div v-for="(r, i) in results" v-bind:key="i" class="result-viewer">
        <h5 class="title zis-spaced preserve-lines">{{ r.name }}
        </h5>
        <div class="more desc" v-if="r.instructions != ''">                    
          <div class="preserve-lines" v-html="r.instructions" v-linkified />
        </div>
        <div class="results">
          <p class="desc preserve-line">
              <div class="answer">
              <b v-if="r.type != 'student'">Resposta:</b>
              <span class="answer-tag tag is-success" v-if="r.type == 'answer' && r.ok == true">RESPOSTA CORRECTA!</span>
              <span class="answer-tag tag is-danger" v-if="r.type == 'answer' && r.ok == false">RESPOSTA INCORRECTA!</span>
              <span class="answer-tag tag is-success" v-if="r.type == 'abcd' && r.ok == true">RESPOSTA CORRECTA!</span>
              <span class="answer-tag tag is-danger" v-if="r.type == 'abcd' && r.ok == false">RESPOSTA INCORRECTA!</span>
              <span class="answer-tag tag is-warning" v-if="r.type == 'open'">RESPOSTA PENDENT D'AVALUAR</span>
              <span class="answer-tag is-marginless tag is-success" v-if="r.type == 'student'">ACTIVITAT FINALITZADA</span>
              <br>              
              <div class="r-answer preserve-lines" v-if="r.answerType != 'document'" v-html="r.answer" v-linkified />

              <BoxContent class="has-margin-bottom-2 has-margin-top-2"  v-if="r.answerType == 'document'" v-bind:prefix="'results'" v-bind:box-id="intentId + '/' + r.id" v-bind:box="box" v-bind:editable="false" v-bind:update="false"></BoxContent>

            </div>          
        </div>
      </div>
      
    </div>
    
  </section>
  
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
import FileUpload from "@/components/FileUpload.vue";
import BoxContent from "@/components/BoxContent.vue";
import { currentUser } from '../firebaseConfig';

export default {
  data() {
    return {
      intentId: '',
      intent: {},
      boxId: '',
      box: {},
      milestoneIndex: 0,
      results: [],
      abcd: ['A','B', 'C', 'D'],
      mode: 'answers',
      resultsOK: 0,
      resultsKO: 0,
      resultsPending: 0,
      update: false
    };
  },
  components: {    
    BoxContent,
    FileUpload
  },
  props: {
    
  },  
  computed: {
    ...mapState(["userProfile", "currentUser", "userIntents", "boxes"])
  },
  mounted() {
    // this.startActivity()
    if (this.$route.params.id) {
        this.intentId = this.$route.params.id;
        this.loadIntent();
      }
  },
  watch: {
    $route(to, from) {
      // react to route changes...
      if (this.$route.params.id) {
        this.intentId = this.$route.params.id;
        this.loadIntent();
      }
    }
  },
  methods: {
    loadIntent() {
      
      fb.intentsCollection.doc(this.intentId).get().then(doc => {        
        if (doc.exists) {
          this.intent = doc.data()
          this.intent.id = doc.id

          this.boxId = this.intent.boxId
          fb.boxesCollection.doc(this.boxId).get().then(doc => {
            this.box = doc.data()
            this.box.id = doc.id

            if (this.intent.endedOn > 0) {
              this.results = this.intent.result.results
              this.resultsOK = this.intent.result.summary.resultsOK
              this.resultsKO = this.intent.result.summary.resultsKO
              this.resultsPending = this.intent.result.summary.resultsPending
              
              this.mode = 'review'
            }
            else {
              this.startActivity()
            }

          })
        }
      })
    },
    startActivity() {
      this.results = this.box.milestones

      this.results.forEach(r => {
        r.answer = ''
        r.ok = false
        r.shuffled = JSON.parse(JSON.stringify(r.answers))
        r.shuffled = this.shuffle(r.shuffled)
      })
    },
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    answer() {

    },
    next() {
      if (this.results[this.milestoneIndex].type == 'answer') {
        this.results[this.milestoneIndex].ok = this.results[this.milestoneIndex].answers[0] == this.results[this.milestoneIndex].answer
      }
      if (this.results[this.milestoneIndex].type == 'abcd') {
        this.results[this.milestoneIndex].ok = this.results[this.milestoneIndex].answers[0] == this.results[this.milestoneIndex].answer
      }
      if (this.results[this.milestoneIndex].type == 'student') {
        this.results[this.milestoneIndex].ok = true
      }      

      if (this.milestoneIndex < this.results.length - 1) {
        this.milestoneIndex++
        window.scrollTo(0, 0)
      }
      else {
        this.endActivity();
      }
    },
    resultAbcd(i) {
      this.results[this.milestoneIndex].answer = this.results[this.milestoneIndex].shuffled[i]
      this.results[this.milestoneIndex].ok = this.results[this.milestoneIndex].answers[0] == this.results[this.milestoneIndex].shuffled[i]

      if (this.milestoneIndex < this.results.length - 1) {
        this.milestoneIndex++
      }
      else {
        this.endActivity();
      }
    },
    reloadIntent() {
      fb.intentsCollection.doc(this.intentId).get().then(ref =>{
          this.intent = ref.data()
          this.intent.id = ref.id
        })
    },
    endActivity() { 
      this.$swal({
        title: "Finalitzar repte?",
        text: "Has acabat les activitats, vols veure els resultats?",
        icon: "question",
        confirmButtonText: "Sí",
        showCancelButton: true,
        cancelButtonText: "No"
      }).then(result => {
        if (result.value) {
          
          window.scrollTo(0,0)
          
          this.results.forEach(r => {
            if (r.type == 'answer' && r.ok == true) {
              this.resultsOK++
            }
            else if (r.type == 'answer' && r.ok == false) {
              this.resultsKO++
            }
            else if (r.type == 'abcd' && r.ok == true) {
              this.resultsOK++
            }
            else if (r.type == 'abcd' && r.ok == false) {
              this.resultsKO++
            }
            else if (r.type == 'student' && r.ok == true) {
              this.resultsOK++
            }
            else{
              this.resultsPending++
            }
          })

          let endedOk = this.resultsOK >= ( this.box.okAnswers || this.results.length )

          fb.intentsCollection.doc(this.intentId).update({
            result: { 
              results: this.results, 
              summary: { 
                resultsOK: this.resultsOK, 
                resultsKO: this.resultsKO, 
                resultsPending: this.resultsPending,
                resultsNeeded: ( this.box.okAnswers || this.results.length )
              }
            },
            endedOn: new Date(),
            ended: true,
            endedOk: endedOk,
            public: false
          }).then(ref => {

            this.reloadIntent()            

            let intents = this.boxes.find(b => b.id == this.boxId).intents
            intents++
            let successIntents = this.boxes.find(b => b.id == this.boxId).successIntents || 0

            if (endedOk) {
              let thisBoxAlreadyDone = false
              this.userIntents.forEach(ui => {
                if (ui.boxId == this.boxId && ui.endedOk == true && ui.id != this.intentId) {
                  thisBoxAlreadyDone = true
                }                
              })
              if (!thisBoxAlreadyDone) {
                successIntents++

                fb.usersCollection
                  .doc(this.currentUser.uid)
                  .update({
                    xp: this.userProfile.xp + 1
                  })
              }
            }

            

            fb.boxesCollection.doc(this.boxId).update({
              intents: intents,
              successIntents: successIntents
            })

          })


          this.mode = 'review'          
        }
      });
    },
    onUploaded(info) {
      console.log('info', info)
      //this.$emit('file-uploaded', { })
      this.update = !this.update;
    },
    doPublic(state) {
      fb.intentsCollection.doc(this.intentId).update({            
        public: state
      })            
      this.intent.public = state
    }
  },
  filters: {    
  }
};
</script>
<style scoped>
input, textarea{
  background: #f4f4f4;
}
.desc{
  font-family: 'Varela Round';
  color: #999;
  margin-bottom: 1.5rem;
}
form textarea{
  height: 300px;
}
.tag{
  min-width: 50px;
}
.answer{
  color: #727475;
}
.answer-tag{
  margin-left: 1rem;
  font-weight: bold;
}
.subtext{
  font-weight: bold;
  color: #727475;
  text-transform: uppercase;
}
.subtext.sum{
  font-weight: bold;
  color: #727475;
  padding-left: 1rem;
}
.summary{
  padding-bottom: 3rem;
  padding-top: 2rem;
}
.r-answer{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.result-viewer {
  border-bottom: 3px solid #eee;
  padding-top: 1rem;
}
.bb{
  border-bottom: 3px solid #eee;
}
.do-public .label{
  color:#727475;
}

</style>