const app = new Vue({
    el: "#app",

    data: {
        query: "",

        results: {

        }
    },

    methods: {
        search() {
            axios
            .get("https://api.themoviedb.org/3/search/movie?api_key=a38c554ce7236d631b800436519a221a&query=" + this.query)
            .then(response => {
                this.results = (response.data.results);
                console.log(this.results);
            })
        }
    },

    mounted() {
        
    }
});