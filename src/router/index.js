import Vue from 'vue';
import Router from 'vue-router';
import brightnessControl from '@/components/brightness-control';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'brightnessControl',
            component: brightnessControl,
        },
    ],
});
