
const PORT = process.env.PORT || 8000

const express = require('express')
const axios = require('axios').default
const app = express()

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
})