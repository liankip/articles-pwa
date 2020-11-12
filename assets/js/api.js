var base = 'https://my-json-server.typicode.com/liankip/blog-api/posts';

if ('caches' in window) {
    caches.open('cache_name').then((cache) => {
        var app = new Vue({
            el: "#app",
            data: {
                title: "Hello Cars",
                description: "Article about Cars",
                datas: []
            },
            methods: {
                showArticles() {
                    axios
                        .get(base)
                        .then((Response) => (this.datas = Response.data));
                }
                
            },
            mounted() {
                this.showArticles();
            }
        });
    }).catch((err) => {
        l(err)
    })
}

var networkUpdate = fetch(base).then(function (response) {
    return response.json();
}).then(function (data) {
    networkDataReceived = true;
    renderPage(data);
})


caches.match(base).then(function (response) {
    if (!response) throw Error('no data on cache')
    return response.json();
}).then(function (data) {
    if (!networkDataReceived) {
        renderPage(data);
        console.log('render data from cache');
    }
}).catch(function () {
    return networkUpdate;
})