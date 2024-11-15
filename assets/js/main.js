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

fetchContainer.addEventListener('submit',async (e) => {
    e.preventDefault();
    const id = document.querySelector('.fetch-id-input').value;
    fetchDataById(id)
})

function fetchDataById(id) {
    fetch(`https://acb-api.algoritmika.org/api/transaction/${id}`)
        .then(response => {
            if (!response.ok) { 
                document.querySelector('.fetch-result').textContent = 'Melumat tapilmadi!';
                throw Error('Melumat tapilmadi!');
            }
            return response.json(); 
        })
        .then(data => {
            document.querySelector('.fetch-result').textContent = `ID: ${data.id}, Amount: ${data.amount}, From: ${data.from}, To: ${data.to}`;
        })
        .catch(err => {
            console.error(err);
            document.querySelector('.fetch-result').textContent = 'Error';
        });
}
