module.exports = {
    port : 3000,
    session: {
        maxAge : 8640000,
        key : "trinte",
        secret : "Web-based Application"
    },
    parser : {
        encoding : "utf-8",
        keepExtensions : true
    },
    db: {
        host       : "localhost",
        port       : "27017",
        username   : "",
        password   : "",
        database   : "trinte-dev"
    }, 
    dburi: function() {
        var uri = "mongodb://", port = 27017;
        if(this.db.username != "" && this.db.password != "") {
            uri += this.db.username + ':' + this.db.password + '@';
        } 
        if(this.db.port != "") {
            port = this.db.port;
        }
        uri += this.db.host + ':' + port;
        uri += '/' + this.db.database
        return uri;
    }
}