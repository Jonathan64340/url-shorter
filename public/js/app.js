const count = document.getElementById('count');
const base = 'https://url-shorter.myun-book.com';
const local = 'http://localhost:1234';

const createLink = (e) => {

    e.preventDefault();

    const link = document.getElementById('urlshorter').value;

    const maximum_click = document.getElementById('urlmaximumclick').value;

    e.target.setAttribute('disabled', true);

    let body = `{ "link": "${link}`;

    if (maximum_click) {
        body += `"maximum_click": "${maximum_click}"`;
    }

    body += `"}`;

    let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `${body}`
    };

    fetch(`${base}/create-short-link`, options)
        .then(res => res.json())
        .then(json => {
            const shortLinkResult = document.getElementById('short-link-result');
            shortLinkResult.innerHTML = `<a href="${json['short-link']}" target="_blank">${json['short-link']}</a>`;
            const _count = parseInt(count.innerText) + 1;
            count.innerText = _count;
            e.target.removeAttribute('disabled');
        })
        .catch(err => {
            const _count = parseInt(count.innerText);
            count.innerText = _count;
            e.target.removeAttribute('disabled');
            console.error('error:' + err)
        });
}

const handleChangeSection = () => {

    const buttons = document.getElementsByClassName('btn-menu');

    const activeSection = ({ target }) => {

        if (!target.classList.contains('active')) {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('active');
            }
            target.classList.add('active');
        }
    }

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', activeSection);
    }
}

const getCountShorterLink = () => {

    let options = {
        method: 'GET'
    };

    fetch(`${base}/count-short-link`, options)
        .then(res => res.json())
        .then(json => {
            count.innerText = json.count;
        })
        .catch(err => console.error('error:' + err));
}

const getTopLink = () => {

    let options = {
        method: 'GET'
    };

    const topElement = document.getElementById('top-link');

    fetch(`${base}/top-link`, options)
        .then(res => res.json())
        .then(json => {

            for (let i = 0; i < json.length; i++) {

                const div = document.createElement('div');

                div.innerHTML = `<div class="top-link-container">
                                    <a href="/short-link/${json[i]['short-link']}" target="_blank" class="top-link-a">${json[i]['short-link']}</a>
                                    <span class="top-link-view"><i class="fa-solid fa-eye icon-small"></i>&nbsp;${json[i].click}</span>
                                </div>`

                topElement.appendChild(div);
            }

        })
        .catch(err => console.error('error:' + err));
}

const getRandomLink = () => {

    let options = {
        method: 'GET'
    };

    fetch(`${base}/get-random`, options)
        .then(res => res.json())
        .then(json => {

            if (json.link) {
                const link = (json.link.indexOf('://') === -1) ? 'http://' + json.link : json.link;
                window.open(link, '_blank');
            }

        })
        .catch(err => console.error('error:' + err));
}

const btnSubmit = document.getElementById('btn-submit').addEventListener('click', createLink);
const randomBtn = document.getElementById('generate-random-link').addEventListener('click', getRandomLink);

getCountShorterLink();
getTopLink();