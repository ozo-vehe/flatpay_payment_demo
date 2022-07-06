// const bodyParser = require('body-parser')
const express = require('express')
const https = require('https')
// const urlencodedParser = bodyParser.urlencoded({extended: true})

module.exports = (app) => {
	app.use(express.urlencoded({extended: false}))
	app.use(express.json())

	app.get('/', function(req, res) {
		res.render('form')
	})

// REQUESTING LISTS OF BANKS FOR THAT PARTICULAR COUNTRY
	app.get('/form', function(req, res) {
		
		// STORED CUSTOM REQUEST HEADER VALUE IN A VARIABLE
		const customRequestHeader = req.headers['x-custom-header']
		
		// REQUEST TO GET BANK LIST FOR A PARTICULAR COUNTRY
		let bankList

		const options = {
		  hostname: 'api.paystack.co',
  		port: 443,
  		path: '/bank?currency=' + customRequestHeader,
  		method: 'GET',
	 		headers: {
   			Authorization: 'Bearer sk_test_7143006ec0232ef14acfcd39b014ed5975b0fbd9'
 			}
		}
		// MAKE REQUEST USING HTTPS
		const request = https.request(options, response => {
  		let data = ''
 			response.on('data', (chunk) => {
   			data += chunk
	  	});
  		response.on('end', () => {
  			bankList = JSON.parse(data)
				// SEND DATA TO THE FRONTEND
				res.json({...bankList.data})
	  	})
		})
		request.on('error', error => {
 			console.error(error)
		})
		request.end();
	})

	// REQUESTING LISTS OF BANKS FOR THAT PARTICULAR COUNTRY
	app.get('/form/account_verification', function(req, res) {
		const customRequestHeader = req.headers['x-custom-header']

		const accountDetails = JSON.parse(customRequestHeader)
		const accountNumber = accountDetails.accountNumber
		const bankCode = accountDetails.bankCode
		console.log(accountNumber, bankCode)
		let verifiedAccount
		const options = {
		  hostname: 'api.paystack.co',
	  	port: 443,
  		path: '/bank/resolve?account_number=' + accountDetails.accountNumber + '&bank_code=' + accountDetails.bankCode,
  		method: 'GET',
  		headers: {
    		Authorization: 'Bearer sk_test_7143006ec0232ef14acfcd39b014ed5975b0fbd9'
  		}
		}

  	// MAKE REQUEST USING HTTPS
		const request = https.request(options, response => {
			let data = ''

			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				verifiedAccount = JSON.parse(data).data
				
				console.log(verifiedAccount)
				// SEND DATA TO THE FRONTEND
				res.json({ ...verifiedAccount }) 
			})
		})
		request.on('error', error => {
			console.error(error)
		})
		request.end()
	})

	app.post('/form/create_transfer_recipient', function(req, res) {
		const params = JSON.stringify(req.body)
		const options = {
  		hostname: 'api.paystack.co',
  		port: 443,
  		path: '/transferrecipient',
  		method: 'POST',
  		headers: {
    		Authorization: 'Bearer sk_test_7143006ec0232ef14acfcd39b014ed5975b0fbd9',
    		'Content-Type': 'application/json'
  		}
		}

		const request = https.request(options, response => {
			let data = ''
			let recipient

			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				recipient = JSON.parse(data)

				res.json({ ...recipient })
				console.log(recipient)
			})
		})
		request.on('error', error => {
			console.log(error)
		})
		request.write(params)
		request.end()
	})

// INT
	app.post('/form/initiate_transfer', function(req, res) {
		const params = JSON.stringify(req.body)

		const options = {
  		hostname: 'api.paystack.co',
  		port: 443,
  		path: '/transfer',
  		method: 'POST',
  		headers: {
    		Authorization: 'Bearer sk_test_7143006ec0232ef14acfcd39b014ed5975b0fbd9',
    		'Content-Type': 'application/json'
  		}
		}

		const request = https.request(options, response => {
			let data = ''
			let transferInfo

			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				transferInfo = JSON.parse(data)
				
				res.json({ ...transferInfo })
				console.log(transferInfo)
			})
		})
		request.on('error', error => {
			console.log(error)
		})
		request.write(params)
		request.end()
	})

}