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