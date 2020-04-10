<template>
    <div id="app">
        <Navigation></Navigation>        
        <div class="zcontainer" v-bind:class="{ 'container' : showContainer, 'main-container': currentUser && currentUser.uid != '' }">
    	    <router-view/>
        </div>
        
        <Footer></Footer>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Navigation from './components/Navigation.vue'
    import Footer from './components/Footer.vue'

    export default {
        components: { Navigation, Footer },
        computed: {
            ...mapState(['currentUser'])
        },
        data() {
            return {
            showContainer: true
            }
        },
        watch: {
            $route(to, from) {
            this.showContainer = to.path != '/'
            }
        },
        mounted() {
            this.showContainer = this.$route.path != '/'
        }
    }
</script>

<style>
.main-container{
    margin-top: 30px;
    margin-bottom: 150px;
    @media screen and (min-width: $desktop) {
        margin: 30px 20px;
    }    
}
</style>