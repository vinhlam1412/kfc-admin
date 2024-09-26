const Papa = require('papaparse')
const fs = require('fs')
const lodash = require('lodash')

const inputPath = 'language.csv'
const outputPath = 'locals'

fs.readFile(inputPath, 'utf8', (error, data) => {
    if (error) {
        console.log('Error', error)
        return
    }

    const parsed = Papa.parse(data, {
        skipEmptyLines: true,
    })

    if (!parsed.errors.length) {
        let json = {}
        let jsonData = parsed.data

        const headers = []
        for (let i = 1; i < jsonData[0].length; i++) {
            headers.push(jsonData[0][i])
        }

        for (let n = 0; n < lodash.size(headers); n ++) {
            for (let i = 1; i < jsonData.length; i++) {
                const item = jsonData[i]
                const key = item[0]
                const value = item[n+1]
                json = lodash.set(json, key, value)
            }

            if (Object.keys(json).length > 0) {
                if (!fs.existsSync(outputPath + '/' + headers[n])) {
                    fs.mkdirSync(outputPath + '/' + headers[n])
                }

                fs.writeFile(outputPath + '/' + headers[n] + '/' + headers[n] + '.json' , JSON.stringify(json, null, 4), error => {
                    if (error) {
                        console.log(`Write json for ${headers[n]} error`, error)
                    } else {
                        console.log(`Write json for ${headers[n]} success`)
                    }
                })
            } else {
                console.log(`Json data ${headers[n]} empty`)
            }
        }
    }
    else {
        console.log("Error", parsed)
    }
})
