const createFrom = document.querySelector('.create-form');

createFrom.addEventListener('submit', async (e) => {

    e.preventDefault();
    const amount = document.querySelector('.amount-input').value;
    const from = document.querySelector('.from-input').value;
    const to = document.querySelector('.to-input').value;

    await createData({from, to, amount});
})

async function createData(data){
    try{
        await fetch('https://acb-api.algoritmika.org/api/transaction',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
        alert("Melumat elave edildi.")
    }
    catch (err){
        console.log(err)
    }
}

const fetchContainer = document.querySelector('.fetch-container');

fetchContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = document.querySelector('.fetch-from-input').value;
    const to = document.querySelector('.fetch-to-input').value;
    fetchDataByFromOrTo(from,to);
})

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
                document.querySelector('.fetch-result').textContent = 'Melumat tapilmadi!';
                throw Error('Melumat tapilmadi!');
            }
            return response.json(); 
        })
        .then(data => {
                const resultText = data.map(item => 
                    `ID: ${item.id}, Amount: ${item.amount}, From: ${item.from}, To: ${item.to}`
                ).join('\n');
                document.querySelector('.fetch-result').textContent = resultText;
            
        })
        .catch(err => {
            console.error(err);
            document.querySelector('.fetch-result').textContent = 'Error';
        });
}

