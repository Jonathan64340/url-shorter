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
                    const payload = {
                        ...data[0],
                        click: data[0].click + 1
                    }
                    this.updateShorterLink(payload)
                        .then(() => {
                            if (data[0].maximum_click && data[0].click >= data[0].maximum_click) {
                                this.response.send('Lien expiré ou innexistant')
                            } else {
                                this.response.redirect(data[0].link)
                            }
                        })
                        .catch((err) => this.response.send(err))
                })
                .catch(() => this.response.send('Lien expiré ou innexistant'))
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

                    if (result[0]) {
                        resolve(result)
                    } else {
                        reject()
                    }
                }
            );
        })
    }

    createShorterLink() {
        const uuidBaseV4 = uuid.v4();
console.log(this.request)
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
                        if (error) this.response.send('Une erreur est survenu');

                        if (result) {
                            this.response.send({
                                'short-link': `https://${this.request.headers.host}/${uuidBaseV4}`
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
                    if (error) reject(error);
                    if (result) {
                        resolve()
                    }
                }
            )
        })

    }
}

module.exports = (payload) => new UrlController(payload);