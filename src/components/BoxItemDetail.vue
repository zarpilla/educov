<template>
  <div class="box-detail-item">
    <div class="z">
      <div class="bordered">
              
        <router-link v-bind:to="`/repte/${box.id}`">

          <div v-bind:style="{ backgroundImage: 'url(' + bgImage(box.scopes[0]) }" class="box-header" >
            <div class="box-header-overlay">            
              
            </div>
            <div class="box-header-button">
              <div class="columns is-marginless access_time-col">
                <div class="column zis-hidden-mobile " v-if="box.state == 'deleted' || box.state == 'draft'">
                </div>
                <div class="column zis-hidden-mobile" v-if="box.liveDate && box.liveDate != ''">
                  <span class="button is-pulled-left is-danger button-detalls">EN DIRECTE!</span>
                </div>
                <div class="column zis-hidden-mobile">
                  <span class="button is-pulled-right is-primary button-detalls">VEURE DETALLS</span>
                </div>

              </div>
            </div>
          </div>

        </router-link>
        
        <router-link v-bind:to="`/repte/${box.id}`">
          <div class="box-body">
            <router-link v-bind:to="`/repte/${box.id}`">
            {{ box.name }}
            </router-link>
            <span class="tag is-info" v-if="currentUser && box.userId == currentUser.uid">TEU
            </span>
            <p class="box-description block-with-text">{{ box.description | ellipsizeText}}</p>
          </div>
        </router-link>

        <div class="info-row info-row-last">
          <div class="columns is-marginless more-info is-mobile">            
            <div class="column column-download" :title="box.downloads + ' intents'">              
              <i class="material-icons">new_releases</i>
              {{ box.downloads }}
            </div>
            <div class="column column-download" :title="(box.successIntents || 0) + ' intents superats'">
              <i class="material-icons">check_circle</i>
              {{ box.successIntents || 0 }} 
            </div>
            <div class="column column-download" :title="box.reviews + ' valoracions'">
              <i class="material-icons">grade</i>
              <span v-if="box.reviews > 0">{{ box.reviewsValue | formatReview }}/5 ({{ box.reviews }})</span>
              <span v-if="box.reviews == 0">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import { scopes } from "../services/scope.service";

export default {
  props: {
    box: Object
  },
  computed: {
    ...mapState(["userBoxes", "currentUser", "downloadedBoxes"]),
    canAccess() {
        return this.currentUser && ( this.userBoxes.find(u => u.id == this.box.id) != null || this.downloadedBoxes.find(u => u.id == this.box.id) != null || this.box.userId == this.currentUser.uid )
    }
  },
  methods: {    
    bgImage(scope) {
      let image = scopes.find(s => s.id == scope) ? scopes.find(s => s.id == scope).image : 'ALT'
      return require(`@/assets/images/${image}`)
    }
  },
  filters: {    
    formatDate(val) {
      if (!val) {
        return "";
      }
      return moment.unix(val).format("DD/MM/YYYY")
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    },
    firstInitial(val) {
      if (val && val.length > 0) {
        return val.substring(0,1);
      }
      return ``;
    },
    ellipsizeText(text) {
      if (text.length > 250) {
        text = text.substring(0, 250) + '...'
      }
      return text
    },
    formatReview(val) {
      if (!val || val == '-') {
        return "-";
      }
      return Math.round(val * 10) / 10
    }

  }
};
</script>
<style scoped>
.access_time-col{
  color: rgb(114, 116, 117);
  color: #fff;
  font-size: 16px;
  font-family: 'Varela Round';
}
.column-access_time-col{
  margin-top: 6px;
}
.access_time{
  vertical-align: -5px;
}
.round{
  background-color: #a3a3a3;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  font-weight: bold;
  color:#fff;
  text-transform: uppercase;
  font-family: 'Varela Round';
  margin-right: 4px;
}
.more-info{
  color: #a3a3a3;
  font-family: 'Varela Round';
  font-weight: bold;
}
a.link-to-user{
  color: #a3a3a3;
  display: inline-block;
  max-width: 80px;
  vertical-align: -8px;
}
a.link-to-user:hover{
  color: #0a0a0a;
}
.column-download i{
  font-size: 34px;
  vertical-align: -12px;
  margin-right: 4px;
}
a.button.button-detalls{
  color:#fff;  
  font-family: 'Varela Round';  
}
.button-detalls{
  margin-bottom: 15px;
}

@media screen and (min-width: 1024px) {
  .button-detalls{
    margin-bottom: 0px;
  }
}   

.info-row{
  border-top:1px solid #f1f1f1;background-color: #f9f9f9;
}
.bordered {
  border: 1px solid #f1f1f1;
}
.box-header{
  position:relative;height:70px;  
  height: 140px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.box-header-overlay{
    position: absolute;
    height: 140px;
    width: 100%;
    opacity: 0.3;
    background-color: #000;
    top: 0;
    left: 0;
    z-index: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.box-header-button{
  position:absolute; bottom:0;width:100%
}
.box-body{
  padding:20px;
  min-height: 200px;
}
.box-body a{
color: #727475;font-size:20px;margin-bottom:20px;font-family:'Varela Round'
}
.box-body p{
  color: #a3a3a3; 
  font-size:16px; 
  height: 100px; 
  font-family:'Varela Round';
  line-height:24px;
  margin-top: 10px;
  overflow: hidden;
}
.box-body .tag{
  vertical-align: 4px;
  margin-left: 4px;
}
/* styles for '...' */ 
.block-with-text {
  height: 3.6rem;
}
.bordered{
  border-radius: 4px;
}
</style>
