<template>
  <div class="zcontainer">
      <!--UPLOAD-->
      <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving || isSuccess">        
        <div id="dropzone" class="dropbox" v-cloak @drop.prevent="addFile($event)" @dragover.prevent >
          <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event, $event.target.name, $event.target.files)"
            :accept="accept" class="input-file">
            <p v-if="isInitial || isSuccess">
              Arrosega fitxer(s) aquí<br> o fes click
            </p>
            <p v-if="isSaving">
              Pujant {{ fileCount }} arxius...
            </p>
        </div>
      </form>

      <!--SUCCESS-->
      <div v-if="false && isSuccess">
        <h2 class="has-text-primary">Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
        <p>
          <a href="javascript:void(0)" @click="reset()">Upload again</a>
        </p>
      </div>
      <!--FAILED-->
      <div v-if="isFailed">
        <h2>Uploaded failed.</h2>
        <p>
          <a href="javascript:void(0)" @click="reset()">Torna-ho a provar</a>
        </p>
      </div>
  </div>
</template>

<script>

import { upload } from '../services/file-upload.service';

  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

  export default {
    name: 'app',
    data() {
      return {
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'photos',
        fileCount: 0
      }
    },
    props: {
      prefix: String,
      boxId: String,
      accept: String,
    },
    computed: {
      isInitial() {
        return this.currentStatus === STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED;
      }
    },
    mounted () {
      // this.$on('uploaded', () => {
      //   this.currentStatus = STATUS_INITIAL;
      // });
    },
    methods: {
      addFile(e) {
        console.log('addFile', e)
        let fileList = e.dataTransfer.files;
        if(!fileList) return;
        
        const formData = new FormData();

        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(this.boxId, fileList[x], fileList[x].name);
          });

        this.fileCount = fileList.length

        // save it
        this.save(formData, fileList);
      },
      reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
      },
      save(formData, fileList) {
        // upload data to the server
        this.currentStatus = STATUS_SAVING;

        upload(this.prefix, this.boxId, formData)
          .then(x => {
            this.uploadedFiles = [].concat(x);
            this.currentStatus = STATUS_SUCCESS;
            //alert('uploaded')

            this.$emit('uploaded', { boxId: this.boxId, fileList: fileList })

          })
          .catch(err => {
            this.uploadError = err.response;
            this.currentStatus = STATUS_FAILED;
          });
      },
      filesChange(event, fieldName, fileList) {
        //console.log('(fieldName, fileList)', fieldName, fileList)
        // handle file changes
        const formData = new FormData();

        if (!fileList.length) return;

        // append the files to FormData
        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(this.boxId, fileList[x], fileList[x].name);
          });

        this.fileCount = event.target.files.length
        // save it
        this.save(formData, fileList);
      }
    },
    mounted() {
      this.reset();

      // window.addEventListener("dragenter", function (e) {
      //         document.querySelector("#dropzone").style.visibility = "";
      //         document.querySelector("#dropzone").style.opacity = 1;
      //         //document.querySelector("#textnode").style.fontSize = "48px";
      // });

      // window.addEventListener("dragleave", function (e) {
      //     e.preventDefault();

      //         document.querySelector("#dropzone").style.visibility = "hidden";
      //         document.querySelector("#dropzone").style.opacity = 0;
      //         //document.querySelector("#textnode").style.fontSize = "42px";
          
      // });

      // window.addEventListener("dragover", function (e) {
      //     e.preventDefault();
      //     document.querySelector("#dropzone").style.visibility = "";
      //     document.querySelector("#dropzone").style.opacity = 1;
      //     //document.querySelector("#textnode").style.fontSize = "48px";
      // });

      // window.addEventListener("drop", function (e) {
      //     e.preventDefault();
      //     document.querySelector("#dropzone").style.visibility = "hidden";
      //     document.querySelector("#dropzone").style.opacity = 0;
      //     //document.querySelector("#textnode").style.fontSize = "42px";
          
      //   // var files = e.dataTransfer.files;
      //   //   console.log("Drop files:", files);
      //   //   //this.uploadFile(files);
      //   //   self.uploadFiles(files);
      //   // });
      // });
    

    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .dropbox {
    outline: 2px dashed #aaa; /* the dash box */
    outline-offset: -10px;
    background: #F9F9F9;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
    font-family: 'Varela Round';
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: #eee; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
  
</style>
