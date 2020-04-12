import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '@/components/Login'
import Home from '@/components/Home'
import Help from '@/components/Help'
import Privacy from '@/components/Privacy'
import Settings from '@/components/Settings'
import Verify from '@/components/Verify'
import Box from '@/components/Box'
import BoxActivities from '@/components/BoxActivities'
import BoxEdit from '@/components/BoxEdit'
import MyBoxes from '@/components/MyBoxes'
import MyIntents from '@/components/MyIntents'
import BoxIntents from '@/components/BoxIntents'
import User from '@/components/User'


Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '*',
			redirect: '/'
		},
		{
			path: '/',
			name: 'Home',
			component: Home,
			meta: {
				title: 'EDUCOV - Reptes i recursos educatius en directe, públics, gratuïts i oberts',
			}
		},
		{
			path: '/privacitat',
			name: 'Privacy',
			component: Privacy,
			meta: {
				title: 'Polítiques de privacitat - EDUCOV',
			}
		},
		{
			path: '/ajuda',
			name: 'Help',
			component: Help,
			meta: {
				title: 'Ajuda - EDUCOV',
			}
		},		
        {
			path: '/verify',
			name: 'Verify',
			component: Verify,
			meta: {
				title: 'Verificació - EDUCOV',
			}
		},
		{
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				title: 'Login - EDUCOV',
			}
		},
        {
			path: '/perfil',
			name: 'Settings',
			component: Settings,
            meta: {
				requiresAuth: true,
				title: 'Perfil - EDUCOV',
            }
		},
        {
			path: '/repte/:id',
			name: 'Box',
			component: Box,
            meta: {
				requiresAuth: false,
				title: 'Repte - EDUCOV',
            }
		},
        {
			path: '/box-edit/:id',
			name: 'BoxEditId',
			component: BoxEdit,
            meta: {
				requiresAuth: true,
				title: 'Edita repte - EDUCOV',
            }
		},
        {
			path: '/intent/:id',
			name: 'BoxActivities',
			component: BoxActivities,
            meta: {
				requiresAuth: false,
				title: 'Activitat - EDUCOV',
            }
		},
        {
			path: '/results/:id',
			name: 'BoxIntents',
			component: BoxIntents,
            meta: {
				requiresAuth: true,
				title: 'Intents - EDUCOV',
            }
		},
        {
			path: '/els-meus',
			name: 'MyBoxes',
			component: MyBoxes,
            meta: {
				requiresAuth: true,
				title: 'Els meus reptes - EDUCOV',
            }
		},
        {
			path: '/superats',
			name: 'MyIntents',
			component: MyIntents,
            meta: {
                requiresAuth: true,
				title: 'Els reptes superats - EDUCOV',
            }
		},
        {
			path: '/box-edit',
			name: 'BoxEdit',
			component: BoxEdit,
            meta: {
                requiresAuth: true,
				title: 'Crea un repte - EDUCOV',
            }
		},
        {
			path: '/user/:id',
			name: 'User',
			component: User,
            meta: {
                requiresAuth: true,
				title: 'Usuari - EDUCOV',
            }
		}
	]
})

router.beforeEach((to, from, next) => {
	window.scrollTo(0, 0)
	
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    const currentUser = firebase.auth().currentUser

    if (requiresAuth && !currentUser) {
        next('/login')
    } else if (requiresAuth && currentUser) {
        // next()
    } else {
        // next()
	}


	const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)

	// Find the nearest route element with meta tags.
	const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)
	const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

	// If a route with a title was found, set the document (page) title to that value.
	if(nearestWithTitle) document.title = nearestWithTitle.meta.title

	// Remove any stale meta tags from the document using the key attribute we set below.
	Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el))

	// Skip rendering meta tags if there are none.
	if(!nearestWithMeta) return next()

	// Turn the meta tag definitions into actual elements in the head.
	nearestWithMeta.meta.metaTags.map(tagDef => {
		const tag = document.createElement('meta')

		Object.keys(tagDef).forEach(key => {
		tag.setAttribute(key, tagDef[key])
		})

		// We use this to track which meta tags we create, so we don't interfere with other ones.
		tag.setAttribute('data-vue-router-controlled', '')

		return tag
	})
	// Add the meta tags to the document head.
	.forEach(tag => document.head.appendChild(tag))	
	







})

export default router
