const createForm = document.querySelector('.create-form');
const fetchForm = document.querySelector('.fetch-form');
const dont_show = document.querySelector('.dont-show');
const create_result = document.querySelector('.create-result');
const fetch_result = document.querySelector('.fetch-result');

createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const from = document.querySelector('.from-input').value;
    const to = document.querySelector('.to-input').value;
    const amount = document.querySelector('.amount-input').value;

    if (from === '' || to === '' || amount <= 0) {
        create_result.style.color = 'red';
        create_result.textContent = 'Please enter all fields';
    } else {
        await createData({ from, to, amount });
    }
});

async function createData(data) {
    try {
        await fetch('https://acb-api.algoritmika.org/api/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        create_result.textContent = 'Data added.';
        create_result.style.color = 'green';
    } catch (err) {
        console.log(err);
    }
}

fetchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = document.querySelector('.fetch-from-input').value;
    const to = document.querySelector('.fetch-to-input').value;

    fetchDataByFromOrTo(from, to);

    fetch_result.style.display = 'block';
    dont_show.style.display = 'block';

    dont_show.addEventListener('click', (e) => {
        e.preventDefault();
        dont_show.style.display = 'none';
        fetch_result.style.display = 'none';
    });
});

function fetchDataByFromOrTo(fromValue, toValue) {
    let url = 'https://acb-api.algoritmika.org/api/transaction';
    if (fromValue) {
        url += `?from=${encodeURIComponent(fromValue)}`;
    }
    if (toValue) {
        url += fromValue ? `&to=${encodeURIComponent(toValue)}` : `?to=${encodeURIComponent(toValue)}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                fetch_result.textContent = 'Data not found!';
                fetch_result.style.color = 'red';
                throw new Error('Data not found!');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                fetch_result.textContent = 'Data not found!';
                fetch_result.style.color = 'red';
                return;
            }

            const resultHTML = data.map(item => {
                return `
                    <div class="transfer-card" data-id="${item.id}">
                        <h3>Transaction ID: ${item.id}</h3>
                        <p><span>Amount:</span> <span class="amount">${item.amount}</span></p>
                        <p><span>From:</span> ${item.from}</p>
                        <p><span>To:</span> ${item.to}</p>
                        <input type="text" class="update-amount-input" placeholder="New amount" value="${item.amount}">
                        <input type="text" class="update-from-input" placeholder="New from" value="${item.from}">
                        <input type="text" class="update-to-input" placeholder="New to" value="${item.to}">
                        <button class="update-button" data-id="${item.id}">Update</button>
                        <button class="delete-button" data-id="${item.id}">Delete</button>
                    </div>
                `;
            }).join('');
            fetch_result.innerHTML = resultHTML;
        })
        .catch(err => {
            fetch_result.textContent = 'Data not found!';
            fetch_result.style.color = 'red';
            console.error(err);
        });
}

document.querySelector('.fetch-result').addEventListener('click', (e) => {
    if (e.target.classList.contains('update-button')) {
        const card = e.target.closest('.transfer-card');
        const id = card.dataset.id;
        const updatedAmount = card.querySelector('.update-amount-input').value;
        const updatedFrom = card.querySelector('.update-from-input').value;
        const updatedTo = card.querySelector('.update-to-input').value;

        const updatedData = {
            from: updatedFrom,
            to: updatedTo,
            amount: updatedAmount
        };

        updateData(id, updatedData);
    }


    if (e.target.classList.contains('delete-button')) {
        const id = e.target.dataset.id;
        deleteData(id);

        const card = e.target.closest('.transfer-card');
        if (card) {
            card.remove();
        }
    }
});

function updateData(id, updatedData) {
    const url = `https://acb-api.algoritmika.org/api/transaction/${id}`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
        .then(response => {
            if (!response.ok) {
                fetch_result.textContent = 'Update failed!';
                fetch_result.style.color = 'red';
                throw new Error('Update failed!');
            }
            return response.json();
        })
        .then(data => {
            fetch_result.textContent = `Updated successfully: ID: ${data.id}, Amount: ${data.amount}, From: ${data.from}, To: ${data.to}`;
            fetch_result.style.color = 'green';
        })
        .catch(err => {
            console.log(err);
            fetch_result.textContent = 'Update failed!';
            fetch_result.style.color = 'red';
        });
}

function deleteData(id) {
    const url = `https://acb-api.algoritmika.org/api/transaction/${id}`;

    fetch(url, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Deletion failed!');
            }
        })
        .catch(err => {
            console.error(err);
        });
}

