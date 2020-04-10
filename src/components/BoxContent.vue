<template>
  <section>    

    <table class="content-files is-full">
      <tbody>
        <tr v-for="(file, index) in files" v-bind:key="file.path" v-bind:class="{ first: index == 0}">
          <td class="content-image-div">
            <img v-if="isImage(file.itemRef.location.path) && urls.length == files.length" class="content-image" :src="getImageUrl(index)" alt="" />
            <i v-if="!isImage(file.itemRef.location.path)" class="material-icons content-icon">file_copy</i>
            
          </td>
          <td class="content-file-name" >
            <a :href="getImageUrl(index)" target="_blank">
              {{ file.itemRef.location.path | fileName}}
            </a>
          </td>
          <td class="actions">
            <div class="actions-div" v-bind:class="{ 'can-edit': canEdit }">
              <i class="material-icons is-pulled-left" v-if="canEdit && editable" title="Esborrar" @click="deleteFile(file.itemRef.location.path, index)">
              delete
              </i>
            </div>            
          </td>
        </tr>        
      </tbody>
    </table>

  </section>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
import firebase from "firebase";

export default {
  data() {
    return {
      files: [],
      urls: [],
      showSuccess: false
    };
  },
  props: {
    boxId: String,
    box: Object,
    update: Boolean,
    editable: Boolean,
    prefix: String
  },
  watch : {
    update(val) {
      this.viewContent(true)
    }
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "boxesContent"]),
    canEdit() {
        return this.userProfile.role != 'user' || this.box.userId == this.currentUser.uid
    }
  },
  mounted() {
    this.viewContent(false)
  },
  methods: {
    viewContent(forceFromStorage) {
      let files = []

      let boxContent = this.boxesContent.find(b => b.id == this.boxId)


      if (boxContent && !forceFromStorage && !this.editable) {
        // from state
        this.urls = []
        boxContent.content.forEach((c, i) => {
          files.push({ itemRef: c.itemRef, i : i })
          this.displayImage(c.itemRef, i)
        })
        this.files = files
        
      }
      else {
        // from storage
        setTimeout(() => {
          var key = `${this.prefix}/${this.boxId}`
          var storageRef = firebase.storage().ref(key)      
          storageRef.listAll().then((res) => {
            res.prefixes.forEach((folderRef) => {
              // All the prefixes under listRef.
              // You may call listAll() recursively on them.
            })        

            this.urls = []
            res.items.forEach((itemRef, i) => {          
              files.push({ itemRef: itemRef, i : i })
              this.displayImage(itemRef, i)
            })
            this.files = files
            if (this.prefix == 'boxes') {
                this.$store.commit("setBoxesContent", { id: this.boxId, content: this.files });
            }            
          }).catch(function(error) {
          });
        }, 500)
      }

    },
    displayImage(imageRef, index) {
      imageRef.getDownloadURL().then((url) => {
        this.urls.push({i: index, url: url});                
      }).catch((error) => {
        console.warn('error', error)
      });
    },
    getImageUrl(index) {      
      let url = this.urls.find(f => f.i == index).url      
      return url
    },
    onFileUploaded: function (ev) {
      console.log('ev', ev)
      this.showSuccess = true
      setTimeout(() => {
        this.showSuccess = false
      }, 2000)
    },
    isImage(val) {      
      let img = false;

      ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'].forEach(ext => {        
        if (val.toLowerCase().endsWith(ext)) {
          img = true
        }
      })
      return img
    },
    viewFile(fileRef, index) {
      fileRef.getDownloadURL().then((url) => {
        // this.getBase64FromImageUrl(url).then((base64) => {
        //   console.log('base64', base64)
        // });
        window.open(url)
      }).catch((error) => {
        console.warn('error', error)
      });
      
    },
    deleteFile(file, index) {
      var fileRef = firebase.storage().ref(file)
      // Delete the file
      fileRef.delete().then(() => {
        // File deleted successfully        
        this.files.splice(index, 1)
        this.$store.commit("setBoxesContent", { id: this.boxId, content: this.files });

        this.showSuccess = true
        setTimeout(() => {
          this.showSuccess = false
        }, 2000)

      }).catch((error) => {
        // Uh-oh, an error occurred!
        alert('error')
      });
    },
    getBase64FromImageUrl(url) {

      return new Promise((resolve, reject) => {
        var img = new Image();

        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width =this.width;
            canvas.height =this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            resolve(dataURL)
            //alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        };

        img.onerror = function(err) {
          reject(err);
        };

        img.src = url;

      })

        
    }
  },
  filters: {    
    fileName(val) {
      let boxes = 'boxes/'
      val = val.substring(boxes.length)      
      let index = val.indexOf('/') + 1
      val = val.substring(index)      
      return val
    }
  }
};
</script>
<style scoped>
.content-file-item{
  border-bottom: 2px solid #f1f1f1;
}
.content-file-icon{
  vertical-align: -5px;
  display: inline-block;
  margin-right: 6px;
  margin-left: 4px;
  color: #727475;
}
.content-file-name{
  font-family: 'Varela Round';
  color: #999;
}
.content-image-div{
  width: 90px;
  display: inline-block;
}
.content-image{
  max-width: 80px;
  max-height: 50px;
}
.content-icon{
  line-height: 50px;
  margin-left: 15px;
}
table.is-full{
  width: 100%;
}
table .content-image-div{
  width: 80px;
}
table .content-file-name{
  line-height: 50px;
  width: 100%;
  padding-left: 10px!important;
}
table.content-files tr{
  border-top: 2px solid #f1f1f1;
}
table.content-files tr.first{
  border-top: 0;
}
table.content-files td{  
  padding: 4px 0;
  vertical-align: middle;
}
table td.actions .actions-div{
  width: 90px;
}
table td.actions .actions-div.can-edit{
  width: 120px;
}
table td.actions .actions-div i{
  margin-right: 12px;
  cursor: pointer;
}
table td.actions .actions-div i:hover{
  color: #49ADC1
}
</style>