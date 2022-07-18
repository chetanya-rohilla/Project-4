const shortid = require('shortid')
const Url = require('../Models/urlModel')

const baseUrl = 'http://localhost:3000'
const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/


const shortenUrl = async function (req, res) {
    try {
        const { longUrl } = req.body // destructure the longUrl from req.body.longUrl

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Body should not be Empty.. " })
        }

        const urlCode = shortid.generate().toLowerCase()

        // const check = await Url.findOne({urlCode})
        // if(check)   urlCode = shortid.generate().toLowerCase()

        if (urlRegex.test(longUrl)) {

            let url = await Url.findOne({longUrl}).select({ _id: 0, __v: 0 })

            if (url) {
                res.status(200).send({ status: true, data: url })
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode

                let url = await Url.create({longUrl, shortUrl, urlCode})
                let data = {
                    longUrl : url.longUrl,
                    shortUrl : url.shortUrl,
                    urlCode : url.urlCode
                }

                res.status(201).send({ status: true, data: data })
            }
        }
        else {
            res.status(400).send({ status: false, message: "invalid longUrl" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}


const getUrlCode = async function (req, res) {
    try {
        // find a document match to the code in req.params.code
        const url = await Url.findOne({
            urlCode: req.params.urlCode
        })
        if (url) {

            return res.status(302).send({ status: true, data: url.longUrl })
        } else {
            // else return a not found 404 status
            return res.status(404).send({ status: false, message: 'No URL Found' })
        }

    }
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { shortenUrl, getUrlCode }