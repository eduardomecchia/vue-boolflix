const app = new Vue({
    el: "#app",

    data: {
        query: "",

        apiKey: "a38c554ce7236d631b800436519a221a",

        results: [],

        error: null
    },

    methods: {
        /**
         * Fires a request to theMovieDB API and gets the movies AND TV shows which name includes the query
         */
        search() {
            const movieRequest = axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.query}`);
            const tvRequest = axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${this.apiKey}&query=${this.query}`);

            axios
            .all([movieRequest, tvRequest])
            .then(axios.spread((...responses) => {
                const movieResults = responses[0].data.results;
                const tvResults = responses[1].data.results;

                this.results = [...movieResults, ...tvResults];
            }))
            .catch(error => {
                console.error(error);
                this.error = "We're sorry, the service is unavailable at this time. Try again later";
            });
        },

        /**
         * Rounds up the a base 10 number and transforms it in a base 5 number
         * @param {number} number - The base 10 number
         * @returns The new base 5 number 
         */
        toBaseFive(number) {
            const roundedNumber = Math.ceil(number);
            return Math.ceil(roundedNumber / 2);
        }
    }
});