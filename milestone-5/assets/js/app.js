const app = new Vue({
    el: "#app",

    data: {
        query: "",

        apiKey: "a38c554ce7236d631b800436519a221a",

        movieResults: [],
        tvResults: [],

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
                this.movieResults = responses[0].data.results;
                this.tvResults = responses[1].data.results;
            }))
            .catch(error => {
                if (error.response.status === 422) {
                    return
                } else {
                    console.error(error);
                    this.error = "We're sorry, the service is unavailable at this time. Try again later.";
                }
            })
            .finally(() => {
                this.getCast(this.movieResults, "movie");
                this.getCast(this.tvResults, "tv");
            });
        },

        /**
         * Gets first five members of the cast of a movie or show with the given ID from theMovieDB API 
         * @param {array} array - Collection of movies or shows in which to cycle
         * @param {string} category - Can either be movie or tv. It's used to build the URL of the HTTP request
         */
        getCast(array, category) {
            array.forEach(entry => {
                axios
                .get(`https://api.themoviedb.org/3/${category}/${entry.id}/credits?api_key=${this.apiKey}`)
                .then((response) => {
                    this.$set(entry, "cast", []);

                    for (let i = 0; i < 5; i++) {
                        if (response.data.cast[i]) {
                            entry.cast.push(response.data.cast[i].name);
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            });
        },

        /**
         * Gets genres of movie or show with the given ID from theMovieDB API 
         * @param {string} typeOfEntry - Either "movie" or "tv". Needed to make the HTTP request
         * @param {string} id - ID that points to a specific entry in theMovieDB API
         */
        /* getGenres(typeOfEntry, id) {
            axios
            .get(`https://api.themoviedb.org/3/${typeOfEntry}/${id}/credits?api_key=${this.apiKey}`)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        }, */

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