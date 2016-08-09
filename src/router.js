/**
 * Created by xiangsongtao on 16/7/24.
 * Description: vue-router 路由控制
 * 每个vue的SPA有且只有一个路由控制,且将控制挂载到了顶级组件-->APP.vue上
 * */

//引入
import Vue from "vue";
import VueRouter from "vue-router";
//启用
Vue.use(VueRouter);

// 路由器需要一个根组件,App.vue为根组件。就是挂载路由的地方。
var App = Vue.extend(require('./App.vue'));
// 路由配置参数
var router = new VueRouter({
    hashbang: true //hash路由
});


import store from "./vuex/store"


export default function () {

    //定义路由规则
    router.map({
        '/index': {
            name: 'index',
            component: require('./views/blog.index.vue')
        },
        '/login': {
            name: 'login',
            component: require('./views/blog.login.vue')
        },
        '/blog': {
            name: 'blog',
            component: require('./views/blog.vue'),
            subRoutes: {
                '/art-list': {
                    name: 'artList',
                    component: require('./views/blog.articleList.vue')
                },
                '/his-list': {
                    name: 'historyList',
                    component: require('./views/blog.historyList.vue')
                },
                '/tag-list': {
                    name: 'tagList',
                    component: require('./views/blog.tagList.vue')
                },
                '/article/:articleId': {
                    name: 'article',
                    component: require('./views/blog.article.vue')
                },
            }
        },
        '/admin': {
            name: 'admin',
            component: require('./views/admin.vue'),
            auth: true,
            subRoutes:{
                '/admin-myinfo': {
                    name: 'admin-myinfo',
                    component: require('./views/admin.myInfo.vue'),
                    auth: true,
                },
                '/admin-tag': {
                    name: 'admin-tag',
                    component: require('./views/admin.tagList.vue'),
                    auth: true,
                },
                '/admin-articleManager': {
                    name: 'admin-articleManager',
                    component: {
                        template:'<router-view></router-view>'
                    },
                    auth: true,
                    subRoutes:{
                        '/admin-articleList': {
                            name: 'admin-articleList',
                            component: require('./views/admin.articleList.vue'),
                            auth: true,
                        },
                        '/admin-article/:articleId': {
                            name: 'admin-article',
                            component: require('./views/admin.article.vue'),
                            auth: true,
                        },
                    }
                },



                '/admin-commentList': {
                    name: 'admin-commentList',
                    component: require('./views/admin.commentList.vue'),
                    auth: true,
                },
            }
        },

    });

    //路由重定向
    router.redirect({
        '/': '/index',
        '/blog': '/blog/art-list/?listType=latest',
        '/admin/admin-articleManager': '/admin/admin-articleManager/admin-articleList',
    });


    //路由切换前
    router.beforeEach(({to, from, next}) => {
        if(to.auth && !store.state.isLogin){
            router.go({
                name:'login'
            })
        }
        next()
    })

    //路由切换后
    router.afterEach(function ({to}) {
        // console.log(`成功浏览到: ${to.path}`)
        // $.refreshScroller()
    });


    //在根组件上启动路由,挂载点位为body上
    router.start(App, '#app');
}