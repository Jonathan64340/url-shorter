const createLink = (e) => {
    e.preventDefault();

    const link = document.getElementById('urlshorter').value;
    const maximum_click = document.getElementById('urlmaximumclick').value;
    // const password = document.getElementById('urlpassword').value;

    let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{ "link": "${link}", "maximum_click": "${maximum_click || null}" }`
    };

    fetch('https://url-shorter-jonathan-domingues.herokuapp.com/create-short-link', options)
        .then(res => res.json())
        .then(json => {
            const shortLinkResult = document.getElementById('short-link-result');

            shortLinkResult.innerHTML = `<a href="${json['short-link']}" target="_blank">${json['short-link']}</a>`;
        })
        .catch(err => console.error('error:' + err));
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

const btnSubmit = document.getElementById('btn-submit').addEventListener('click', createLink);
handleChangeSection();