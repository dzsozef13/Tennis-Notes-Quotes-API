function mapQuote(quote) {
    let quoteObj = {
        id: quote._id,
        author: quote.author,
        content: quote.content,
        appears: quote.appears
    }
    return quoteObj;
}

function mapQuotes(inputArray) {
    let outputArray = inputArray.map(element => (        
        mapQuote(element)        
    ));
    return outputArray;
}

module.exports = { mapQuote, mapQuotes };