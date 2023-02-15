
const PORT = process.env.PORT || 8000

require('dotenv').config({ path: '../.env' })
const express = require('express')
const axios = require('axios').default
const app = express()

const sectors = [
    {
        param: 'business',
        color: 7925926,
    },
    {
        param: 'technology',
        color: 14842096,
    },
    {
        param: 'health',
        color: 7898864,
    },
    {
        param: 'politics',
        color: 15759504,
    },
]

app.get('/', async (_req, res) => {

    const embeds = [];

    sectors.forEach((sector, i) => {
        setTimeout(async () => {
            const options = {
                method: 'GET',
                url: 'https://free-news.p.rapidapi.com/v1/search',
                params: {
                  q: sector.param,
                  page: 1,
                  page_size: 2,
                  lang: 'en',
                },
                headers: {
                  'x-rapidapi-host': 'free-news.p.rapidapi.com',
                  'x-rapidapi-key': process.env.RAPID_API_KEY,
                }
            };
    
            const data = await axios.request(options).then(function (response) {
                return response.data
            }).catch(function (error) {
                console.error(error);
            });
    
            for (let i = 0; i < 2; i++) {
                let embed: any = {
                    "title": data.articles[i].title,
                    "description": data.articles[i].summary.slice(0, 100),
                    "fields": [
                        {
                            "name": "Full Article",
                            "value": `[here](${data.articles[i].link})`,
                            "inline": true,
                        },
                        {
                            "name": "Provider",
                            "value": `**${data.articles[i].author||data.articles[i].rights}**`,
                            "inline": true,
                        }
                    ],
                    "color": sector.color,
                }
                if(data.articles[i].media){
                    embed = {
                        ...embed,
                        "thumbnail": {
                            "url": data.articles[i].media,
                        },
                    }
                }
                embeds.push(embed)
            }
        }, 2000)
    })

    setTimeout(() => {
        const message = {
            "embeds": embeds,
        }
    
        axios.post(process.env.DISCORD_URL, message)
            .then(res => console.log("data", res.data))
            .catch(err => console.log("error", err.response))
    }, 12000)
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
})