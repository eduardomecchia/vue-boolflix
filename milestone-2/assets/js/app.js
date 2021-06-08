const app = new Vue({
    el: "#app",

    data: {
        query: "",

        apiKey: "a38c554ce7236d631b800436519a221a",

        results: [],

        languages: [],

        error: null
    },

    methods: {
        /**
         * Fires a request to theMovieDB API and gets the movies AND TV shows which name includes the query
         */
        search() {
            const movieRequest = axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=` + this.query);
            const tvRequest = axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${this.apiKey}&query=` + this.query);

            axios.all([movieRequest, tvRequest])
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
         * Dynamically gets a flag from the Country Flags API
         * @param {string} flagCode 
         * @returns An URL that points to the requested flag
         */
        getFlag(flagCode) {
            // theMovieDB returns "en" in case of English, which is not supported by Country Flags API, so we convert it to "us"
            if (flagCode === "en") {
                flagCode = "us";
            }

            return `https://flagcdn.com/20x15/${flagCode}.png`;
            /* return `https://www.countryflags.io/${flagCode}/shiny/32.png`; */
        }
    }
});