import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store.js'
const fb = require('./firebaseConfig.js')
import './../node_modules/bulma/css/bulma.css';
import './assets/scss/app.scss'
import VueSweetalert2 from 'vue-sweetalert2';
import "./services/descriptions.filters";
import linkify from 'vue-linkify'
import VueSimpleMarkdown from 'vue-simple-markdown'
import 'vue-simple-markdown/dist/vue-simple-markdown.css'

Vue.config.productionTip = false

const options = {
    confirmButtonColor: '#49ADC1',
    cancelButtonColor: '#F14668',
}

Vue.use(VueSweetalert2, options)
Vue.use(VueSimpleMarkdown)
Vue.directive('linkified', linkify)

// handle page reloads
let app
fb.auth.onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
            el: '#app',
            router,
            store,
            render: h => h(App)
        })
    }
})
