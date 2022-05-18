const urlModel = require('../models/urlModel');
const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient(
    11718,
    "redis-11718.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);

redisClient.auth("w33nbMdiEAfivct4GwEqBujruMssxDZd", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const shortenURL = async function(req,res)
{
    try
    {
        if(Object.keys(req.body).length==0)

            return res.status(400).send({status : false, message : "Bad request. Please provide original URL in the request body."});

        if(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(req.body.originalURL))
        
            return res.status(400).send({ status: false, message : "The given originalUrl is not valid URL!"});

        const longUrl = req.body.originalUrl;

        let characters = 'ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        let length = 5;
        
        let urlCode = '';
        
        for(let i=0;i<length;++i)

            urlCode+=characters.charAt(Math.floor(Math.random()*characters.length));

        const shortUrl = "http://localhost:3000/"+urlCode;

        const urlData = { longUrl, shortUrl, urlCode };

        await urlModel.create(urlData);

        return res.status(201).send({status : true, data : urlData})
            
    }
    catch(error)
    {
        return res.status(500).send({ status : false, message : error.message });   
    }
};

const getURL = async function(req,res)
{
    try
    {
        const urlCode = req.params.urlCode;

        if(!urlCode)

            return res.status(400).send({status : false, message : "Invalid request parameter. Please provide urlCode"});
        
        let cahcedUrlData = JSON.parse(await GET_ASYNC(`${req.params.urlCode}`));

        if(cahcedUrlData)

            return res.status(301).send({status  : true, data : cahcedUrlData.longUrl});

        const originalURL = await urlModel.findOne({urlCode});

        if(!originalURL)

            return res.status(404).send({status : false, message : "URL not found !"});
        
        await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(originalURL));

        return res.status(301).send({status  : true, data : originalURL.longUrl});
    }
    catch(error)
    {
        return res.status(500).send({ status : false, message : error.message });   
    }
};

module.exports={shortenURL,getURL};