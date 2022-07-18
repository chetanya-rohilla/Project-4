const validUrl = require('valid-url')
const shortid = require('shortid')
const Url= require('../Models/urlModel')

const baseUrl = 'http:localhost:3000'


const shortenUrl = async function(req,res){
const {longUrl} = req.body // destructure the longUrl from req.body.longUrl

// we create the url code
const urlCode = shortid.generate()

// check long url if valid using the validUrl.isUri method
if (validUrl.isUri(longUrl)) {
    try {
        /* The findOne() provides a match to only the subset of the documents 
        in the collection that match the query. In this case, before creating the short URL,
        we check if the long URL was in the DB ,else we create it.
        */
        let url = await Url.findOne({
            longUrl
        }).select({_id:0,__v:0})

        // url exist and return the respose
        if (url) {
             res.status(200).send(url)
        } else {
            // join the generated short code the the base url
            const shortUrl = baseUrl + '/' + urlCode

            // invoking the Url model and saving to the DB
            url = new Url({
                longUrl,
                shortUrl,
                urlCode,
           })
            await url.save()
            let data ={
                longUrl : url.longUrl,
                shortUrl: url.shortUrl,
                urlCode:url.urlCode
            }
            
            res.status(200).send({status:true,data:data})
        }
    }
    // exception handler
    catch (err) {
        console.log(err)
        res.status(500).send({status:false,message:err.message})
    }
} else {
    res.status(400).send({status:false,message :"invalid longUrl"})
}}


const getUrlCode = async function(req,res){
    try {
        // find a document match to the code in req.params.code
        const url = await Url.findOne({
            urlCode: req.params.urlCode
        })
        if (url) {
            
            return res.status(200).send({status:true,URL:url.longUrl})
        } else {
            // else return a not found 404 status
            return res.status(404).send({status:false,message:'No URL Found'})
        }

    }
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).send({status:false,message:err.message})
    }
}

module.exports={shortenUrl,getUrlCode}