const app = new Vue({
    el: "#app",

    data: {
        query: "",

        results: []
    },

    methods: {
        /**
         * Fires a request to theMovieDB API and gets the movies AND TV shows which name includes the query
         */
        search() {
            const movieRequest = axios.get("https://api.themoviedb.org/3/search/movie?api_key=a38c554ce7236d631b800436519a221a&query=" + this.query);
            const tvRequest = axios.get("https://api.themoviedb.org/3/search/tv?api_key=a38c554ce7236d631b800436519a221a&query=" + this.query);

            axios.all([movieRequest, tvRequest])
            .then(axios.spread((...responses) => {
                const movieResults = responses[0].data.results;
                const tvResults = responses[1].data.results;

                this.results = [...movieResults, ...tvResults];
            }))
        },

        /**
         * Dynamically gets a flag from the Country Flags API
         * @param {string} flagId 
         * @returns An URL that points to the requested flag
         */
        getFlag(flagId) {
            // theMovieDB returns "en" in case of English, which is not supported by Country Flags API, so we convert it to "us"
            if (flagId === "en") {
                flagId = "us"
            }

            return `https://www.countryflags.io/${flagId}/shiny/32.png`;
        }
    }
});