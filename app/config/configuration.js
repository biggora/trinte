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
    port: 3000,
    session: {
        maxAge: 8640000,
        key: "trinte",
        secret: "feb723690aeccfa92ca9ee6fdf06e55a",
        clear_interval: 60
    },
    parser: {
        encoding: "utf-8",
        keepExtensions: true,
        uploadDir: __dirname + '/../uploads'
    },
    mailer: {
        production: {
            transport: "SMTP",
            config: {
                auth: {
                    user: '',
                    pass: ''
                },
                host: "127.0.0.1" //, hostname
                //   secureConnection: false, // use SSL
                //   port: 465, // port for secure SMTP
            },
            senderName: 'Example Server',
            senderMail: 'example@example.com'
        },
        development: {
            transport: "Sendmail",
            config: '/usr/sbin/sendmail',
            senderName: 'Example Server',
            senderMail: 'example@example.com'
        },
        test: {
            transport: "SMTP",
            config: {
                auth: {
                    user: '',
                    pass: ''
                },
                host: "127.0.0.1" //, hostname
                //   secureConnection: false, // use SSL
                //   port: 465, // port for secure SMTP
            },
            senderName: 'Example Server',
            senderMail: 'example@example.com'
        }
    },
    uploader: {
        tmpDir: __dirname + '/../uploads',
        publicDir: __dirname + '/../public',
        uploadDir: __dirname + '/../public/files',
        uploadUrl: '/files/'
    },
    recaptcha: {
        public_key: '',
        private_key: ''
    },
    analytics: {
        code: '',
        domain: ''
    }
};