<template>
    <section id="settings" class="main-container">
        <h3 class="title is-spaced">El meu compte</h3>
        <h3 class="subtitle">Actualitza el perfil</h3>

        <form @submit.prevent>
            <label class="label" for="email">Correu</label>
            <input v-model.trim="currentUser.email" type="text" disabled :placeholder="currentUser.email" id="email" />

            <label class="label" for="name">Nom</label>
            <input v-model.trim="name" type="text" :placeholder="name" maxlength="150" id="name" />                

            <label class="label" for="description">Foto</label>
            
            <FileUpload v-if="photo == ''" class="has-margin-bottom-2" v-bind:accept="'image/*'" v-bind:prefix="'users'" v-bind:box-id="currentUser.uid" @uploaded="onUploaded"></FileUpload>

            <UserPhoto class="has-margin-top-2 has-margin-bottom-2" v-bind:editable="true" v-bind:user-id="currentUser.uid" v-bind:file-name="photo" @deleted="onDeleted" v-bind:update="update"></UserPhoto>

            <label class="label" for="description">Una mica sobre tu</label>
            <textarea class="ztextarea" v-model.trim="description" type="text" maxlength="2500" :placeholder="description" id="description" ></textarea>


            <button @click="updateProfile" class="button has-margin-top-3">Actualitza</button>
        </form>

    </section>
</template>

<script>
    import { mapState } from 'vuex'
    import FileUpload from "@/components/FileUpload.vue";
    import UserPhoto from "@/components/UserPhoto.vue";

    export default {
        components: {
            FileUpload, UserPhoto
        },
        data() {
            return {
                name: '',
                description: '',
                showSuccess: false,
                photo: '',
                update: false,
                init: false
            }
        },
        computed: {
            ...mapState(['userProfile', 'currentUser'])
        },
        watch: {
            userProfile(val) {            
                if (val.email != '' && !this.init) {
                    this.init = true
                    this.name = this.userProfile.name
                    this.description = this.userProfile.description ? this.userProfile.description : ''
                    this.photo = this.userProfile.photo ? this.userProfile.photo : ''

                    this.update = !this.update
                }
            }
        },
        mounted() {
            this.name = this.userProfile.name
            this.description = this.userProfile.description ? this.userProfile.description : ''
            this.photo = this.userProfile.photo ? this.userProfile.photo : ''
        },
        methods: {
            updateProfile() {
                this.$store.dispatch('updateProfile', {
                    name: this.name,
                    email: this.currentUser.email,
                    description: this.description,
                    photo: this.photo
                })

                this.$swal('Dades guardades', '', 'success');
            },
            onUploaded(info) {
                if (info.fileList && info.fileList.length > 0) {
                    this.photo = info.fileList[0].name
                    this.$store.dispatch('updateProfile', {
                        name: this.name,
                        email: this.currentUser.email,
                        description: this.description,
                        photo: this.photo,
                    })
                    this.update = !this.update
                }
            },
            onDeleted(info) {
                console.log('onDeleted', info)
                this.photo = ''
                this.$store.dispatch('updateProfile', {
                    name: this.name,
                    email: this.currentUser.email,
                    description: this.description,
                    photo: this.photo,
                })
                //this.update = !this.update;
            }
        }
    }
</script>
