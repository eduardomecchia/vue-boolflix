const app = new Vue({
    el: "#app",

    data: {
        query: "",

        apiKey: "a38c554ce7236d631b800436519a221a",

        movieResults: [],
        tvResults: [],

        listOfMovieGenres: [],
        listOfTvGenres: [],
        
        movieFilter: "All",
        tvFilter: "All",

        error: null
    },

    methods: {
        /**
         * Fires a request to theMovieDB API and gets the movies AND TV shows which name includes the query
         */
        search() {
            if (this.query != "") {
                const movieRequest = axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.query}`);
                const tvRequest = axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${this.apiKey}&query=${this.query}`);
    
                Promise.all([movieRequest, tvRequest])
                .then(responses => {
                    this.movieResults = responses[0].data.results;
                    this.tvResults = responses[1].data.results;
                })
                .catch(error => {
                    if (error.response.status === 422) {
                        return
                    } else {
                        console.error(error);
                        this.error = "We're sorry, the service is unavailable at this time. Try again later.";
                    }
                })
                .finally(() => {
                    // Get cast and genres of all displayed movies 
                    this.getCast(this.movieResults, "movie");
                    this.getGenres(this.movieResults, "movie");
    
                    // Get cast and genres of all displayed TV shows
                    this.getCast(this.tvResults, "tv");
                    this.getGenres(this.tvResults, "tv");
                });
            }
        },

        /**
         * Gets first five members of the cast of all given movies or shows from theMovieDB API 
         * @param {array} array - Collection of movies or shows in which to cycle
         * @param {string} category - Can either be "movie" or "tv". It's used to build the URL of the HTTP request
         */
        getCast(array, category) {
            array.forEach(entry => {
                axios.get(`https://api.themoviedb.org/3/${category}/${entry.id}/credits?api_key=${this.apiKey}`)
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
         * Gets genres of all given movies or shows from theMovieDB API 
         * @param {array} array - Collection of movies or shows in which to cycle
         * @param {string} category - Can either be "movie" or "tv". It's needed to know which list of genres to use
         */
        getGenres(array, category) {
            array.forEach(entry => {
                this.$set(entry, "genre_names", []);
                
                if (category === "movie") {
                    const currentGenresIds = entry.genre_ids;

                    this.listOfMovieGenres.forEach(genre => {
                        if (currentGenresIds.includes(genre.id)) {
                            entry.genre_names.push(genre.name);
                        }
                    });
                } else if (category === "tv") {
                    const currentGenresIds = entry.genre_ids;

                    this.listOfTvGenres.forEach(genre => {
                        if (currentGenresIds.includes(genre.id)) {
                            entry.genre_names.push(genre.name);
                        }
                    });
                }
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
    },

    created() {
        // Get all movie genres
        axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`)
        .then(response => {
            this.listOfMovieGenres = response.data.genres;
        })
        .catch(error => {
            console.error(error)
        });

        // Get all TV genres
        axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${this.apiKey}`)
        .then(response => {
            this.listOfTvGenres = response.data.genres;
        })
        .catch(error => {
            console.error(error);
        });
    }
});