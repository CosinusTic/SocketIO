function check(schema) {
    return (req, res, next) => {
        for (const [key, value] of Object.entries(schema)) {
            console.log(key, value.type.name);
            if(!(key in req.body)){
                res.status(400).json({ message: "Invalid body request"});
                return;
            }
            else if(req.body.length !== schema.length){
                res.status(400).json({ message: "Invalid body request"});
                return;
            }
        }
        next();
    };
}

module.exports = {
    check
};
