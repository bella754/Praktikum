import { createMemoryHistory, createRouter } from 'vue-router'

import Startseite from './components/Startseite.vue';
import ListPersons from './components/ListPersons.vue';
import Search from './components/Search.vue';
import Registrierung from './components/Registrierung.vue';
import RegBestätigung from './components/RegBestätigung.vue';
import Login from './components/Login.vue';
import Suchergebnis from './components/SearchResult.vue';
import Personalblatt from './components/Personalblatt.vue';

const routes = [
  { 
    path: '/', 
    name: 'Login',
    component: Login 
  },
  { 
    path: '/myData/:user', 
    name: 'Startseite', 
    component: Startseite 
  },
  { 
    path: '/listPersons/:user', 
    name: 'ListPersons',
    component: ListPersons 
  },
  { 
    path: '/search/:user', 
    name: 'Search',
    component: Search 
  },
  { 
    path: '/register', 
    component: Registrierung 
  },
  { 
    path: '/registerMsg', 
    name: 'Registrierungsbestätigung',
    component: RegBestätigung 
  },
  { 
    path: '/personalblatt/:id/:user', 
    name: 'personalblatt', 
    component: Personalblatt
  },
  { 
    path: '/search/result/:result/:user', 
    name: 'Suchergebnis', 
    component: Suchergebnis
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router