let formData
const loader = `
	<span></span>
`
const transferBtn = document.querySelector('.transfer-btn')

transferBtn.addEventListener('click', function() {
	const form1 = document.querySelector('.form-1')
	transferBtn.classList.add('hide')
	form1.classList.replace('hide', 'show')
})

const form1Btn = document.querySelector('.form-1 .btn')
const form2Btn = document.querySelector('.form-2 .btn')
const form3Btn = document.querySelector('.form-3 .btn')
const form4Btn = document.querySelector('.form-4 .btn')

// FORM ONE BUTTON
form1Btn.addEventListener('click', function(e) {
	e.preventDefault()

	const form2 = document.querySelector('.form-2')
	const form1 = document.querySelector('.form-1')

	form1.classList.replace('show', 'hide')
	form2.classList.replace('hide', 'show')
})

// FORM TWO BUTTON
let bankList = []
form2Btn.addEventListener('click', async function(e) {
	e.preventDefault()
	
	const selectedCountry = document.querySelector('#country')

	if(selectedCountry.value !== "") {
		form2Btn.innerHTML = loader

		const data = {
			country: selectedCountry.value
		}
	
		const fetchBankList = await fetch('/form', {
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				'X-Custom-Header': selectedCountry.value
			}
		})
		bankList = await fetchBankList.json()
		const banksContainer = document.querySelector('.bank-details select')
		
		for(banks in bankList) {
			const optionEl = document.createElement('option')
			optionEl.setAttribute('value', bankList[banks].code)
			optionEl.textContent = bankList[banks].name
			banksContainer.appendChild(optionEl)
		}
	
		const form2 = document.querySelector('.form-2')
		const form3 = document.querySelector('.form-3')
	
		form2.classList.replace('show', 'hide')
		form3.classList.replace('hide', 'show')
	}
	else {
		console.log("Error")
		const invalidCountry = document.querySelector(".form-2 .error")
		invalidCountry.classList.add("show-error")
	}

})


// ACCOUNT NUMBER VERIFICATION
let account
let bankCode

form3Btn.addEventListener('click', async function(e) {
	e.preventDefault()
	form3Btn.innerHTML = loader

	bankCode = document.querySelector('.bank-details select').value
	const accountNumber = document.querySelector('.account-number input').value
	const accountDetails = {
		bankCode,
		accountNumber
	}

	const verifyAccount = await fetch('/form/account_verification', {
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
			'X-Custom-Header': JSON.stringify(accountDetails)
		}
	})
	account = await verifyAccount.json()
	const accountName = document.querySelector('.account-name input')
	accountName.value = account.account_name
	accountName.setAttribute('placeholder', account)

	const form3 = document.querySelector('.form-3')
	const form4 = document.querySelector('.form-4')

	form3.classList.replace('show', 'hide')
	form4.classList.replace('hide', 'show')
	// console.log(account)
})


// CREATING A TRANSFER RECEIPT
form4Btn.addEventListener('click', async function(e) {
	e.preventDefault()
	form4Btn.innerHTML = loader

	const amount = document.querySelector('#amount').value
	const acc = await account
	const banks = await bankList
	const code = await bankCode
	let params = {
		"type": "nuban",
		"name": "John Doe*",
		"account_number": "1234567890*",
		"bank_code": "123",
		"currency": "NGN"
	}

	for(bank in banks) {
		if(banks[bank].code == code) {
			params.name = acc.account_name
			params.account_number = acc.account_number
			params.type = banks[bank].type
			params.currency = banks[bank].currency
			params.bank_code = code
		}
		// console.log(b[bank].code == y)
	}
	await fetch('/form/create_transfer_recipient', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(params)
	})
	.then(res => res.json())
	.then(res => {
		console.log(res)
		if(res.status == true) {
			const data = {
				"source": "balance",
				"amount": amount,
				"recipient": res.data.recipient_code
			}
			initiateTransfer(data)
		}
	})
	.catch((err) => {
		console.log(err)
	})
})

const initiateTransfer = async (data) => {
	await fetch('/form/initiate_transfer', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(res => res.json())
	.then(res => {
		const invalidBalance = document.querySelector(".form-4 .error")

		invalidBalance.textContent = res.message
		invalidBalance.classList.add("show-error")

		form4Btn.innerHTML = "Transfer"
	})
	.catch((err) => {
		console.log(err)
	})
}