if(process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: "mongodb+srv://wisnudm:1234@cluster0-liiwc.mongodb.net/easypcassemble?retryWrites=true&w=majority",
        secret: 'secret'
    };
} else {
    module.exports = {
        mongoURI: "mongodb://localhost:27017/easypcassemble",
        secret: 'secret'
    };
}
