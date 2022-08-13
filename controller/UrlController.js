const AppController = require("./AppController");

const uuid = require('uuid62');



class UrlController extends AppController {

    constructor({ request, response }) {

        super();



        this.request = request;

        this.response = response;

    }



    request = {};

    response = {};



    async redirectToShorterLink() {

        const { link } = this.request.params;



        if (link) {

            this.getShortLink({ link })

                .then((data) => {

                    if (data[0]) {

                        const payload = {

                            ...data[0],

                            click: data[0].click + 1

                        }

                        this.updateShorterLink(payload)

                            .then(() => {



                                if (data[0].maximum_click > 0 && data[0].click >= data[0].maximum_click) {

                                    this.response.send('Lien expiré ou innexistant')

                                } else {

                                    const link = (data[0].link.indexOf('://') === -1) ? 'http://' + data[0].link : data[0].link;

                                    this.response.redirect(link)

                                }

                            })

                            .catch((err) => { this.response.send(err); console.log(err) })

                    }

                })

                .catch(() => { this.response.send('Lien expiré ou innexistant'); console.log('erreur dans update') })

        } else {

            this.response.send('Aucun lien passé');

        }

    }



    getShortLink(param) {

        return new Promise((resolve, reject) => {

            this.connection.query(

                `SELECT * FROM url WHERE \`short-link\` = '${param.link}'`,

                (error, result) => {

                    if (error) {

                        reject();

                    }



                    if (result) {

                        if (result[0]) {

                            resolve(result)

                        } else {

                            reject()

                        }

                    } else {

                        reject()

                    }

                }

            );

        })

    }



    createShorterLink() {

        const uuidBaseV4 = uuid.v4();



        if (typeof this.request.body === 'string') {

            this.request.body = JSON.parse(this.request.body);

        }



        if (!this.request.body.link) return this.response.send('Vous devez spécifier un lien');



        const payload = {

            'short-link': uuidBaseV4,

            'link': this.request.body.link,

            ...(this.request.body.pwd && { 'pwd': this.request.body.pwd }),

            ...(this.request.body.maximum_click && { 'maximum_click': this.request.body.maximum_click })

        }



        this.getShortLink({ link: uuidBaseV4 })

            .then(() => {

                this.response.send('Impossible de créer la short url');

            })

            .catch(() => {

                this.connection.query(

                    `INSERT INTO url SET ?`,

                    payload,

                    (error, result) => {

                        if (error) this.response.send({ code: 'Error insert' });



                        if (result) {

                            this.response.send({

                                'short-link': `https://${this.request.headers.host}/short-link/${uuidBaseV4}`

                            })

                        }

                    }

                )

            })

    }



    updateShorterLink(payload) {

        return new Promise((resolve, reject) => {

            this.connection.query(

                `UPDATE url SET ? WHERE id = ${payload.id}`,

                payload,

                (error, result) => {

                    if (error) return reject(error);

                    if (result) {

                        resolve()

                    }

                }

            )

        })

    }



    getTotalShorterLink() {

        this.connection.query(

            `SELECT count(*) as count FROM url`,

            (error, result) => {

                if (error) this.response.send(error);



                if (result) {

                    if (result[0]) {

                        this.response.send(result[0]);

                    } else {

                        this.response.send(error);

                    }

                }

            }

        )

    }



    getTopLink() {

        this.connection.query(

            `SELECT click, \`short-link\` FROM url ORDER BY click DESC LIMIT 5`,

            (error, result) => {

                if (error) this.response.send(error);



                if (result) {

                    this.response.send(result);

                } else {

                    this.response.send([])

                }

            }

        )

    }

    getRandom() {
        this.connection.query(
            `SELECT DISTINCT link FROM url ORDER BY RAND() LIMIT 1`,
            (error, result) => {
                if (error) this.response.send(error);

                if (result) {
                    this.getShortLink({ link: result[0]['short-link'] });
                }

            }
        )
    }

}



module.exports = (payload) => new UrlController(payload);