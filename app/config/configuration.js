/**
 *  Default configuration file
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

module.exports = {
    debug: false,
    language: "en",
    port : 3000,
    session: {
        maxAge : 8640000,
        key : "trinte",
        secret : "feb723690aeccfa92ca9ee6fdf06e55a",
        clear_interval: 60
    },
    parser : {
        encoding : "utf-8",
        keepExtensions : true
    }
};