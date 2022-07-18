const shortid = require('shortid')
const Url = require('../Models/urlModel')
const validator = require('validator')

const baseUrl = 'http://localhost:3000'

const shortenUrl = async function (req, res) {
    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Body should not be Empty.. " })
        }
        const { longUrl } = req.body
        if(!longUrl)    return res.status(400).send({ status: false, msg: "Please provide longUrl" })

        const urlCode = shortid.generate().toLowerCase()

        // const check = await Url.findOne({urlCode})
        // if(check)   urlCode = shortid.generate().toLowerCase()

        if (validator.isURL(longUrl)) {
            let url = await Url.findOne({longUrl}).select({ _id: 0, __v: 0 })

            if (url) {
                res.status(200).send({ status: true, data: url })
            } else {
                // join the generated short code and the base url
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
            res.status(400).send({ status: false, message: "Invalid longUrl" })
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
            return res.status(404).send({ status: false, message: 'No URL Found' })
        }

    }
    catch (err) {
        console.error(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { shortenUrl, getUrlCode }