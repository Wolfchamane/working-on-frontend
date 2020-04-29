import '@/styles/main.sass';
import '@amjs/vue-tools/config/vue';
import AppLayout    from './app';
import Vue          from 'vue';

/**
 * Loads Vue instance
 */
function loadVue()
{
    /* eslint-disable no-new */
    new Vue({
        el          : '#app',
        components  : {
            AppLayout
        },
        template    : '<app-layout/>'
    });
    /* eslint-enable no-new */
}

window.addEventListener('load', loadVue, false);
