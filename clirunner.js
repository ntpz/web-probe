const { stdin } = process

const { probe } = require('./probe')
const extractor = require('./json-extractor')
const { download } = require('./downloader')

const readStdin = () => {
    let result = ''

    return new Promise(resolve => {
        if (stdin.isTTY) {
            resolve(result)
            return
        }

        stdin.setEncoding('utf8')

        stdin.on('readable', () => {
            let chunk

            while ((chunk = stdin.read())) {
                result += chunk
            }
        })

        stdin.on('end', () => {
            resolve(result)
        })
    })
}

const run = async () => {
    try {
        const spec = JSON.parse(await readStdin())
        result = await probe(download, extractor, spec)
        console.log(JSON.stringify(result))
    } catch (e) {
        console.error(e)
    }
}

try {
    run()
} catch (e) {
    console.error(e)
}
