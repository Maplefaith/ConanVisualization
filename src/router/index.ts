
import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/pages/Home.vue'
import Palgantong from '@/pages/Palgantong.vue'
import TVseries from '@/pages/TVseries.vue'
import Relationship from '@/pages/Relationship.vue'
// create router

const router = createRouter({
    history:createWebHistory('/ConanVisualization/'), // work pattern
    routes:[ // route 
        {
            name:'home',
            path:'/',
            component:Home
        },
        {   
            name:'palgantong',
            path:'/palgantong',
            component:Palgantong
        },
        {   
            name:'relationship',
            path:'/relationship',
            component:Relationship
        },
        {   
            name:'tvseries',
            path:'/tvseries',
            component:TVseries,
        },
    ]
})



export default router