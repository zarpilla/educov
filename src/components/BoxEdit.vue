<template>
  <section class="main-container">
    <div class="columns">
      <div class="column">
        <div class="col1">
          <h3 class="title" v-if="boxId == ''">Nou repte </h3>
          <h3 class="title" v-if="boxId != ''">Edita repte <span class="tag is-info">{{ box.state | stateDescription }}</span></h3>
          
          <h4 class="box-subtitle">Informació bàsica</h4>

          <form @submit.prevent style="margin-top:40px">
            
            <label class="label">Nom</label>
            <input v-model.trim="box.name" type="text" :placeholder="box.name" maxlength="150" id="name" />

            <label class="label">Descripció</label>
            <textarea v-model.trim="box.description" type="text" :placeholder="box.description" maxlength="5000" id="description"></textarea>

            <label class="label">Durada</label>
            <input v-model.trim="box.duration" type="text" :placeholder="box.duration" maxlength="150" id="name" />

            <label class="label">Nivell</label>
            <div class="columns has-margin-bottom-2">
              <div class="column is-one-fifth" v-for="option in levels" v-bind:key="option.id">
                <button @click="setLevel(option.id)" class="button content-button" v-bind:class="{ 'is-light': box.level != option.id, 'is-primary': box.level == option.id }">
                  {{ option.description }}
                </button>                
              </div>
            </div>


            <label class="label" v-if="allscopes.length > 0">Àmbits
              <span class="label-info">(selecció múltiple)</span>
            </label>                        
            <div class="columns has-margin-bottom-2 is-multiline">
              <div class="column is-one-fifth" v-for="option in sortedScopes" v-bind:key="option.id">
                <div @click="setScope(option.id)" class="button content-button content-button-multiline ellipsis" v-bind:class="{ 'is-light': !hasScope(option.id), 'is-primary': hasScope(option.id) }">
                  {{ option.description }}
                </div>                
              </div>
            </div>

            <label class="label" v-if="box.level != ''">Curs (des de)</label>
            <div class="columns has-margin-bottom-2">
              <div class="column is-one-sixth" v-for="age in ages" v-bind:key="age.id">
                <button @click="box.minAge = age.id" :disabled="age.id > box.maxAge" class="button content-button" v-bind:class="{ 'is-light': box.minAge != age.id, 'is-primary': box.minAge == age.id }">
                  {{ age.desc }}
                </button>                
              </div>
            </div>

            <label class="label" v-if="box.level != ''">Curs (fins a)</label>
            <div class="columns has-margin-bottom-2">
              <div class="column is-one-sixth" v-for="age in ages" v-bind:key="age.id">
                <button @click="box.maxAge = age.id" :disabled="age.id < box.minAge" class="button content-button" v-bind:class="{ 'is-light': box.maxAge != age.id, 'is-primary': box.maxAge == age.id }">
                  {{ age.desc }}
                </button>                
              </div>
            </div>

            <!-- <label class="label" v-if="competences && competences.length > 0">Competències</label>            
            <div class="columns has-margin-bottom-2 is-multiline" v-if="competences && competences.length > 0">
              <div class="column is-full" v-for="option in competences" v-bind:key="option.id">
                <button @click="setCompetence(option.id)" class="button" v-bind:class="{ 'is-light': !hasCompetence(option.id), 'is-primary': hasCompetence(option.id) }">
                  {{ option.description }}
                </button>                
              </div>              
            </div> -->



            <h4 class="box-subtitle has-margin-top-3 has-margin-bottom-2">En directe</h4>
            <div class="direct">
              <label class="label">Aquest repte te videoconferència en directe?</label>
              <input v-model.trim="box.liveLink" :placeholder="'enllaç del directe (hangsout, skype, jitsi, zoom...) '" type="text" maxlength="800" />

              <label class="label">Data del directe</label>
              <masked-input v-model="box.liveDate" mask="11/11/1111" placeholder="dd/mm/aaaa" />

              <label class="label">Hora del directe</label>
              <masked-input v-model="box.liveHour" mask="11:11" placeholder="hh:mm" />
            </div>

            <div v-if="boxId != ''">              
              <h4 class="box-subtitle has-margin-top-3 has-margin-bottom-2">Material (Enllaços)</h4>

              <div class="columns">
                <div class="column">
                  <input v-model.trim="newLink" type="text" :placeholder="'Afegeix un enllaç vàlid: https://...'" maxlength="400" id="link" />    
                </div>
                <div class="column is-one-fifth">
                  <button                    
                    @click="addLink"
                    v-bind:disabled="newLink == '' || !newLink.startsWith('http')"
                    class="button"
                  >Afegeix</button>
                </div>
              </div>

              <table class="links is-full has-margin-bottom-2">
                <tbody>
                  <tr v-for="(link, index) in box.links" v-bind:key="link" v-bind:class="{ first: index == 0}">
                    <td class="link">
                    {{ link }}
                    </td>
                    <td class="actions">
                      <div class="actions-div">
                        <i class="material-icons is-pulled-left" title="Anar-hi" @click="viewLink(link)">
                        remove_red_eye
                        </i>
                        <i class="material-icons is-pulled-left" title="Esborrar" @click="deleteLink(link, index)">
                        delete
                        </i>
                      </div>            
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
            
            <div v-if="boxId != ''">          

              <h4 class="box-subtitle has-margin-bottom-2">Material (Documents o fotos)</h4>

              <FileUpload class="has-margin-bottom-2" v-bind:accept="'*/*'" v-bind:prefix="'boxes'" v-bind:box-id="boxId" @uploaded="onUploaded"></FileUpload>

              <BoxContent v-bind:box-id="boxId" v-bind:box="box" v-bind:prefix="'boxes'" v-bind:editable="true" v-bind:update="update"></BoxContent>

              <h4 class="box-subtitle has-margin-bottom-2">Activitats</h4>

              <div class="milestones">

                <div class="milestone" v-for="(m, i) in box.milestones" v-bind:key="m.num">

                  <h4 class="box-subtitle has-margin-top-2 has-margin-bottom-2">
                    Activitat #{{ i + 1 }}
                    <span>
                    <i class="material-icons delete-activity" @click="deleteActivity(m, i)" v-if="box.milestones.length > 1" title="esborrar">delete
                    </i>
                    </span>
                  </h4>

                  <label class="label">Enunciat</label>
                  <textarea v-model.trim="m.name" type="text" :placeholder="m.name" maxlength="1500"  />

                  <label class="label">Informació adicional</label>
                  <textarea v-model.trim="m.instructions" type="text" :placeholder="m.instructions" maxlength="5000"  />

                  <label class="label">Tipus d'avaluació de l'activitat</label>

                  <div class="columns has-margin-bottom-1">
                    <div class="column is-one-third" v-for="option in questionsType" v-bind:key="option.id">
                      <button @click="setMilestoneType(m, option.id)" class="button content-button" v-bind:class="{ 'is-light': m.type != option.id, 'is-primary': m.type == option.id }">
                        {{ option.description }}
                      </button>                
                    </div>
                  </div>

                  <div class="help has-margin-bottom-2" v-if="m.type == 'answer' || m.type == 'abcd'">Aquesta tipus d'activitat s'avalua automàticament a partir de la resposta</div>
                  <div class="help has-margin-bottom-2" v-if="m.type == 'student'">Aquesta tipus d'activitat sempre és correcta</div>

                  <div class="answer" v-if="m.type == 'answer'">
                    <label class="label">Resposta correcta</label>
                    <input v-model.trim="m.answers[0]" type="text" maxlength="250" />
                  </div>

                  <div class="answer has-margin-bottom-2" v-if="m.type == 'abcd'">
                    <div class="columns ">
                      <div class="column is-one-quarter" v-for="(item, index) in m.answers" v-bind:key="abcd[index]">
                        <label class="label">{{ abcd[index] }} {{ index == 0 ? '(Resposta correcta)' : '' }} </label>
                        <input v-model.trim="m.answers[index]" type="text" maxlength="250" />
                      </div>
                    </div>                    
                  </div>

                  <div class="answer has-margin-bottom-2" v-if="m.type == 'open'">
                    <label class="label">Tipus d'avaluació</label>
                    <div class="columns ">
                      <div class="column is-one-third" v-for="option in evaluationType" v-bind:key="option.id">
                        <button @click="m.evaluation = option.id" class="button content-button" v-bind:class="{ 'is-light': m.evaluation != option.id, 'is-primary': m.evaluation == option.id }">
                          {{ option.description }}
                        </button>
                      </div>
                    </div>                    
                  </div>

                  <div class="answer has-margin-bottom-2" v-if="m.type == 'open'">
                    <label class="label">Tipus de resposta</label>
                    <div class="columns ">
                      <div class="column is-one-third" v-for="option in answerType" v-bind:key="option.id">
                        <button @click="m.answerType = option.id" class="button content-button" v-bind:class="{ 'is-light': m.answerType != option.id, 'is-primary': m.answerType == option.id }">
                          {{ option.description }}
                        </button>
                      </div>
                    </div>                    
                  </div>

                </div>
                
                <button
                    @click="addMilestone"                    
                    v-if="box.milestones && box.milestones.length > 0"
                    class="button has-margin-top-2 has-margin-bottom-2"                    
                  >Afegeix un altra activitat</button>

                <button
                    v-if="box.milestones && box.milestones.length == 0"
                    @click="addMilestone"                    
                    class="button has-margin-top-2 has-margin-bottom-2"                    
                  >Afegeix una activitat</button>

                <div class="answer" v-if="box.milestones.length > 0">
                  <label class="label">Número de respostes correctes per superar el repte</label>
                  <input v-model.trim="box.okAnswers" :placeholder="'màxim ' + box.milestones.length" max="box.milestones.length" type="numeric" maxlength="3" />
                </div>

              </div>

            </div>

            <button
              title=""
                v-if="boxId == ''"
                @click="createBox"
                v-bind:disabled="cantSaveBox"
                class="button has-margin-top-3 has-margin-bottom-1"
              >Guardar</button>
              
              <button
                v-if="boxId != ''"
                @click="saveBox"
                v-bind:disabled="box.name == '' || box.description == ''"
                class="button has-margin-top-3 has-margin-bottom-1"
              >Guardar</button>

              <div class="has-text-danger has-margin-bottom-2" v-if="cantSaveBox">
                El nom, la descripció, el nivell i els àmbits son obligatoris
              </div>                        

          </form>

        </div>
      </div>

    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import MyBoxes from "@/components/MyBoxes";
import FileUpload from "@/components/FileUpload.vue";
import BoxContent from "@/components/BoxContent.vue";
import { createNotification } from "../services/notifications.service";
import { levels } from "../services/level.service";
import { scopes } from "../services/scope.service";
import MaskedInput from 'vue-masked-input' 

const fb = require("../firebaseConfig.js");

export default {
  
  components: {
    MyBoxes, FileUpload,BoxContent,MaskedInput 
  },
  computed: {
    ...mapState(["userProfile", "currentUser"]),
    cantSaveBox() {
      return this.box.name == '' || this.box.description == '' || this.box.level == '' || this.box.scopes.length == 0
    },
    sortedScopes() {
      return this.sortByKey(this.allscopes, 'description')
    }
  },
  data() {
    return {
      boxId: '',
      box: {
        name: "",
        description: "",
        targets: "",
        level: "",
        scopes: [],        
        milestones: [],
        language: "",
        category: "",
        duration: "",
        links: [],
        minAge: 0,
        maxAge: 99,
        documents: 0,
        okAnswers: 0,
        liveLink: '',
        liveDate: '',
        liveHour: '',
      },
      milestone0: { num: 1, name: '', instructions: '', type: 'answer', evaluation: 'teacher', answerType: 'open', answers: ['']},
      levels: levels,
      allscopes: [],
      contents: [],
      competences: [],
      showSuccess: false,
      update: false,
      newLink: '',
      ages: [],
      milestoneNum: 1,
      questionsType: [
        { id: 'answer', description: 'Resposta tancada'},
        { id: 'abcd', description: 'Test ABCD'},
        { id: 'student', description: 'Sempre correcta'},
        // { id: 'open', description: 'Resposta oberta'},
      ],
      evaluationType: [
        { id: 'teacher', description: 'Avaluació per part del professor/a'},
        { id: 'pair', description: 'Avaluació entre parelles'},
      ],
      answerType: [
        { id: 'open', description: "Camp de text"},
        { id: 'document', description: "Documents"},
      ],
      abcd: ['A','B', 'C', 'D']
    };
  },
  mounted() {    
    if (this.$route.params.id) {
      this.boxId = this.$route.params.id;
      this.viewBox();
    }
    else {
      this.boxId = ''
    }
  },
  watch: {
    $route(to, from) {
      if (this.$route.params.id) {
        this.boxId = this.$route.params.id;
        this.viewBox();
      }
      else {
        this.boxId = ''
      }
    }
  },
  methods: {
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    viewBox() {
      fb.boxesCollection.doc(this.boxId).get().then(box => {
        this.box = box.data()
        this.box.id = box.id

        if (!this.box.okAnswers) {
          this.box.okAnswers = 0
        }
        

        this.setLevel(this.box.level)
      })
    },
    createBox() {

      if (this.box.okAnswers > this.box.milestones.length) {
        this.box.okAnswers = this.box.milestones.length
      }

      let newBox = {
          createdOn: new Date(),
          modifiedOn: new Date(),
          environment: process.env.BOX_ENV,
          name: this.box.name,
          description: this.box.description,
          targets: this.box.targets,
          level: this.box.level,
          scopes: this.box.scopes,
          milestones: [],
          duration: this.box.duration,
          links: [],
          minAge: this.box.minAge,
          maxAge: this.box.maxAge,
          userId: this.currentUser.uid,
          user: {
            name: this.userProfile.name,
            email: this.currentUser.email
          },
          comments: 0,
          intents: 0,
          successIntents: 0,
          reviews: 0,
          reviewsValue: 0,
          liveLink: this.box.liveLink || '',
          liveDate: this.box.liveDate || '',
          liveHour: this.box.liveHour || '',
          okAnswers: this.box.okAnswers || 0,          
          state: "new"
        };
      
      fb.boxesCollection
        .add(newBox)
        .then(ref => {
          this.boxId = ref.id
          
          this.$swal('Repte guardat', 'Si us plau, continua el repte afegint documentació, enllaços i activitats', 'success');

          fb.usersCollection
            .doc(this.currentUser.uid)
            .update({
              uploads: this.userProfile.uploads + 1
            })

          this.$router.push(`/box-edit/${this.boxId}`)
        })
        .catch(err => {
          console.error(err);
        });
    },
    saveBox() {

      if (this.box.okAnswers > this.box.milestones.length) {
        this.box.okAnswers = this.box.milestones.length
      }
      
      fb.boxesCollection.doc(this.boxId).update({
          name: this.box.name,
          description: this.box.description,
          targets: this.box.targets,
          level: this.box.level,
          scopes: this.box.scopes,   
          minAge: this.box.minAge,
          maxAge: this.box.maxAge,
          milestones: this.box.milestones,
          duration: this.box.duration,
          links: this.box.links,
          modifiedOn: new Date(),
          okAnswers: this.box.okAnswers,
          liveLink: this.box.liveLink || '',
          liveDate: this.box.liveDate || '',
          liveHour: this.box.liveHour || '',

      })
      .then(box => {

        let msg = ''

        if (this.box.state == 'new' || this.box.state == 'draft') {
          //msg = `Si us plau, continua afegint almenys una fita al repte. Mentrestant, el teu repte continuarà pendent i no serà públic`
        }
        else if (this.box.state == 'deleted') {
          msg = 'Tot i això, aquest repte está esborrat, no és públic per a ningú'
        }

        this.$swal('Repte guardat', msg, 'success');
        
        this.$router.push('/repte/' + this.boxId)
        
      })
    },
    onUploaded(info) {
      console.log('info', info)
      //this.$emit('file-uploaded', { })
      this.update = !this.update;
    },
    setScope(scope) {
      let index = this.box.scopes.indexOf(scope)
      if (index < 0) {
        this.box.scopes.push(scope)
      }
      else {
        this.box.scopes.splice(index, 1)
      }
    },    
    setContent(content) {
      let index = this.box.contents.indexOf(content)
      if (index < 0) {
        this.box.contents.push(content)
      }
      else {
        this.box.contents.splice(index, 1)
      }
      this.setScope(this.box.scope) // fix for non reactive contents on empty boxes
    },
    setLevel(level) {
      if (this.box.level != level) {
        this.box.scopes = []
      }      
      this.box.level = level      
      this.allscopes = scopes.filter(s => s.level == level)
      this.ages = levels.find(l => l.id == level).ages
    },
    addLink() {
      this.box.links.push(this.newLink)
      this.newLink = ''
    },
    addMilestone() {
      let error = ''
      let index = -1
      this.box.milestones.forEach((m, i) => {        
        if (m.name == '') {
          error = 'Enunciat'
          index = i
        }
        
        if (error == '' && m.type == 'answer' && m.answers[0] == '') {
          error = 'Resposta'
          index = i
        }
        else if (error == '' && m.type == 'abcd' && ( m.answers[0] == '' || m.answers[1] == '')) {
          error = 'Respostes'
          index = i
        }
      })

      if (index >= 0) {
        this.$swal(`Atenció`, `L'activitat ${index + 1} está incompleta. <br>Hi ha un error al camp: <b>${error}</b>`, 'error');
      }
      else {
        this.milestoneNum++
        let milestone0 = JSON.parse(JSON.stringify(this.milestone0))
        milestone0.id = Date.now()
        milestone0.num = this.milestoneNum

        this.box.milestones.push(milestone0)
      }

      
    },
    viewLink(link) {
      window.open(link)      
    },
    deleteLink(link, index) {
      this.box.links.splice(index, 1)
    },
    setMilestoneType(m, typeId) {
      m.type = typeId;
      if (typeId == 'answer') {
        m.answers = ['']
      }
      else if (typeId == 'abcd') {
        m.answers = ['','','','']        
      }
      else {
        m.answers = ['']
      }

    },    
    hasScope(c) {
      return this.box.scopes.indexOf(c) >= 0
    },
    deleteActivity(m, i) {
      this.box.milestones.splice(i, 1)
    }
  },  
  filters: {
    withputFinalDot(val) {
      if (val && val.endsWith('.')) {
        return val.substring(0, val.length -1)
      }
      return val
    },
  }
};
</script>

<style scoped>
textarea#description{
  height: 250px;
}
.buttons-column{
  position: fixed;
  top:80px
}
.content-button{
  width: 100%;
  white-space: normal;
}
.content-button-multiline{
  height: auto;
}
.label-info{
  font-size:12px; padding-left:10px;
}
input, textarea{
  background: #f4f4f4;
}
.delete-activity {
  margin-left: 40px;
  cursor: pointer;
}
.milestones .milestone:first-child {
  border-top:3px solid #eee;
  margin-top: 3rem;
}
.milestone{
  border-bottom:3px solid #eee;
}
.help{
  font-family: 'Varela Round';
}
</style>