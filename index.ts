
const PORT = process.env.PORT || 8000

require('dotenv').config()
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
                url: 'https://bing-news-search1.p.rapidapi.com/news/search',
                params: {
                  q: sector.param,
                  count: '2',
                  freshness: 'Day',
                  textFormat: 'Raw',
                  safeSearch: 'Moderate'
                },
                headers: {
                  'x-bingapis-sdk': 'true',
                  'x-rapidapi-host': 'bing-news-search1.p.rapidapi.com',
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
                    "title": data.value[i].name,
                    "description": data.value[i].description,
                    "fields": [
                        {
                            "name": "Full Article",
                            "value": `[here](${data.value[i].url})`,
                            "inline": true,
                        },
                        {
                            "name": "Provider",
                            "value": `**${data.value[i].provider[0].name}**`,
                            "inline": true,
                        }
                    ],
                    "color": sector.color,
                }
                if(data.value[i].image){
                    embed = {
                        ...embed,
                        "thumbnail": {
                            "url": data.value[i].image.thumbnail.contentUrl,
                        },
                    }
                }
                embeds.push(embed)
            }
        }, i * 1000)
    })

    setTimeout(() => {
        const message = {
            "embeds": embeds,
        }
    
        axios.post(process.env.DISCORD_URL, message)
            .then(res => console.log(res.data))
            .catch(err => console.log(err.code))
    }, 20000)

    res.json({ message: 'Select the news type' })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
})