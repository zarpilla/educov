<template>
  <div>    
    <div class="image-container" v-for="(file, index) in files" v-bind:key="file.path" v-bind:class="{ first: index == 0}">
      <div class="clear" @click="deleteFile(file.itemRef.location.path, 0)" v-if="editable">
        <i class="material-icons">
        clear
        </i>
      </div>
      
        <img v-if="isImage(file.itemRef.location.path) && urls.length == files.length" class="content-image" :src="getImageUrl(index)" alt="" />
    </div>
  </div>
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
    userId: String,
    fileName: String,
    update: Boolean,
    editable: Boolean,
  },
  watch : {
    update(val) {
      this.viewContent(true)
    }
  },
  computed: {
    ...mapState(["userProfile", "currentUser"]),    
  },
  mounted() {
    this.viewContent(false)
  },
  methods: {
    viewContent(forceFromStorage) {
      let files = []

      setTimeout(() => {

        var storageRef = firebase.storage().ref(`users/${this.userId}`)      

        storageRef.listAll().then((res) => {
          res.prefixes.forEach((folderRef) => {
            // All the prefixes under listRef.
            // You may call listAll() recursively on them.
          })        

          this.urls = []
          res.items.forEach((itemRef, i) => {          
            if (i == 0) {
              files.push({ itemRef: itemRef, i : i })
              this.displayImage(itemRef, i)
            }          
          })
          
          this.files = files
          
        }).catch(function(error) {
        });
          
      },500)

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
        
        this.$emit('deleted', { userId: this.userId })

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
.content-image{
  max-width: 150px;
  max-height: 150px;
  border-radius: 14px;
}
.content-icon{
  line-height: 50px;
  margin-left: 15px;
}
.image-container{
  position: relative;
}
.clear{
  position: absolute;
  background: #999;
  width: 40px;
  height: 40px;
  font-size: 30px;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%;
  color: #fff;
  left: -20px;
  top: -20px;
  cursor: pointer;
}
.clear:hover{
  background: #777;
}
</style>