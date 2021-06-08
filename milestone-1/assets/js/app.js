const app = new Vue({
    el: "#app",

    data: {
        query: ""
    },

    methods: {},

    mounted() {
        axios
        .get("https://api.themoviedb.org/3/search/movie?api_key=a38c554ce7236d631b800436519a221a&query=" + this.query)
        .then(response => {
            console.log(response.data.results);
        })
    }
});