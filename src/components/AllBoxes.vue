<template>
  <div v-if="boxes && boxes.length > 0">

    <h3 class="title zall-boxes">
      Reptes
    </h3>

    <div class="columns">
      <div class="column is-half">

        <h3 class="subtitle sub-subtitle is-spaced" >Per àmbits</h3>
        <button @click="setScope(''); expanded1 = false; expanded2 = false" class="button scope-list" v-bind:class="{ 'is-warning': scope != '' || expanded1 || expanded2, 'is-primary': scope == '' &&  !expanded1 && !expanded2 }">TOTS</button>

          <button @click="setScopeCategory(1); expanded1 = !expanded1; expanded2 = false" class="button scope-list" v-bind:class="{ 'is-warning': !expanded1, 'is-primary': expanded1 }">
            Primaria
          </button>

          <button @click="setScopeCategory(2); expanded2 = !expanded2; expanded1 = false" class="button scope-list" v-bind:class="{ 'is-warning': !expanded2, 'is-primary': expanded2 }">
            Secundària
          </button>

          
      </div>
      <div class="column is-half">

        <h3 class="subtitle sub-subtitle is-spaced" >En directe</h3>
        <div class="scope-list">
          <button @click="setDirect(null)" class="button scope-list" v-bind:class="{ 'is-primary': direct == null, 'is-warning': direct != null }">TOTS</button>
        
          <button @click="setDirect(true)" class="button scope-list" v-bind:class="{ 'is-primary': direct == true, 'is-warning': direct !== true }">SÍ</button>

          <button @click="setDirect(false)" class="button scope-list" v-bind:class="{ 'is-primary': direct == false, 'is-warning': direct != false }">NO</button>
          
        </div>   

      </div>
    </div>

    <transition-expand>
      <div v-if="expanded1" class="expanded">
        <div class="columns is-multiline">
          <div class="scope-list column is-3" v-for="option in sortedPrimaria" v-bind:key="option.id">
            <button @click="setScope(option.id)" :title="option.description" class="button is-full" v-bind:class="{ 'is-warning': scope != option.id, 'is-primary': scope == option.id }">
              <span class="ellipsis">
              {{ option.description }} <span class="num-tag tag is-danger">{{option.num}}</span>            
              </span>
            </button>
          </div> 
        </div>
      </div>
    </transition-expand>

    <transition-expand>
      <div v-if="expanded2" class="expanded">
        <div class="columns is-multiline">
          <div class="scope-list column is-3" v-for="option in sortedSecundaria" v-bind:key="option.id">
            <button @click="setScope(option.id)"   :title="option.description" class="button is-full" v-bind:class="{ 'is-warning': scope != option.id, 'is-primary': scope == option.id }">
              <span class="ellipsis">
              {{ option.description }} <span class="num-tag tag is-danger">{{option.num}}</span>            
              </span>
            </button>
          </div>  
        </div>
      </div>
    </transition-expand>

    <div class="columns">

      <div class="column">
        
        <h3 class="title all-boxes" v-if="scope != ''" style="padding-top:40px">
          {{ scope | scopeAlias }}          
          <span class="tag is-danger">{{ filteredBoxes.length }}</span>
          <span class="subsubtitle" v-if="direct == true">En directe</span>
          <span class="subsubtitle" v-if="direct == false">Sense directe</span>
        </h3>
        <h3 class="title all-boxes" v-if="scope == ''" style="padding-top:40px">
          Tots els reptes
          <span class="tag is-danger">{{ filteredBoxes.length }}</span>
          <span class="subsubtitle" v-if="direct == true">En directe</span>
          <span class="subsubtitle" v-if="direct == false">Sense directe</span>
        </h3>
        
        <div class="columns is-multiline is-desktop">
          <div class="column is-one-third" v-for="box in filteredBoxes" v-bind:key="box.id">
            <BoxItemDetail :box="box"></BoxItemDetail>
          </div>
        </div>
        <p v-if="filteredBoxes.length == 0" class="desc">
          No hi ha reptes d'aquest àmbit
        </p>
        
      </div>
    </div>

    
  </div>
</template>

<script>
import { mapState } from "vuex";
import BoxItemDetail from '@/components/BoxItemDetail'
const fb = require("../firebaseConfig.js");
import { scopes } from "../services/scope.service";
import TransitionExpand from '@/components/TransitionExpand';

export default {  
  components: {
    BoxItemDetail, TransitionExpand
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "boxes"]),
    filteredScopes() {
      let scopesWithBoxes = []
      scopes.forEach(c => {
        let len = this.filteredBoxes.filter(b => b.scopes.indexOf(c.id) >= 0)
        if (len && len.length > 0) {
          c.num = len.length
          scopesWithBoxes.push(c)
        }
      })
      return scopesWithBoxes
    },
    filteredBoxes() {
      if (this.scope == '' && this.direct == null ) {
        return this.boxes
      }
      else {
        let boxes = this.boxes
        if (this.scope != '') {
          boxes = boxes.filter(b => b.scopes.indexOf(this.scope) >= 0)
        }        
        if (this.direct === true) {
          boxes = boxes.filter(b => b.liveDate != null && b.liveDate != '')
        }
        else if (this.direct === false) {
          boxes = boxes.filter(b => b.liveDate == null || b.liveDate == '')
        }
        return boxes
      }
    },
    sortedPrimaria() {
      return this.sortByKey(this.filteredScopes.filter(s => s.level == 'primaria'), 'description')
    },
    sortedSecundaria() {
      return this.sortByKey(this.filteredScopes.filter(s => s.level != 'primaria'), 'description')
    }
    
  },
  data() {
    return {
      scopes: scopes,
      scope: '',
      direct: null,
      expanded1: false,
      expanded2: false,
    }
  },
  methods: {
    setScope(scope) {
      this.scope = scope
      if (true || window.innerWidth <= 1024) {
        document.querySelector('.all-boxes').scrollIntoView({ 
          behavior: 'smooth' 
        });
      }
    },
    setScopeCategory(expanded) {
      this.scope = ''
      this.direct = null
    },
    bgImage(scope) {            
      let image = scopes.find(s => s.id == scope) ? scopes.find(s => s.id == scope).image : 'ALT'
      return require(`@/assets/images/${image}`)
    },
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    setDirect(direct) {
      this.direct = direct
      if (true || window.innerWidth <= 1024) {
        document.querySelector('.all-boxes').scrollIntoView({ 
          behavior: 'smooth' 
        });
      }
    }
  }
};
</script>
<style scoped>
section {
    padding: 2rem 0;
}
p.desc{
  font-size: 16px;
  font-family: 'Varela Round';
  color: #a3a3a3;
  line-height: 30px;
}
.scope{text-transform: uppercase;font-weight: bold;}
.xtile{
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
  min-height: 120px;
  position: relative;
  color:#000;
  vertical-align: middle;
  border-radius: 6px;  
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.xtile .button{
  z-index: 1;
  /* font-weight: bold; */
  margin-top: 70px;
  max-width: 100%;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.clickable{cursor: pointer;}
.button-overlay{
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.6;
  z-index: 0;
  border-radius: 4px;
}
.button-overlay.is-selected{
  opacity: 0.3;
}
.scope-list{
  margin-bottom: 0.75rem;
}
.scope-list .button{
  max-width: 100%;
}
.sub-subtitle{
  font-size: 16px;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}
.scopes{
  margin-top: 50px;
}
.subsubtitle{
  font-size: 18px;
  color: #a3a3a3;
}

.expand-enter-active,
.expand-leave-active {
  transition-property: opacity, height;
}
.expand-enter,
.expand-leave-to {
  opacity: 0;
}
.expanded{
  margin-top: 1rem;
  margin-bottom: 3rem;
}
.area{
  margin-bottom: 1rem;
}
.button.is-full{
  width: 100%;
}
.num-tag{
  margin-left: 10px;
  font-weight: bold;
}
</style>

