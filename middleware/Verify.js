import jwt from "jsonwebtoken";

export const Verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Verification Middleware");
    if(authHeader){
        const token = authHeader.split(" ")[1]
        console.log(token);

        jwt.verify(token, "mySecretKey", (err,user) => {
            if(err){
                return res.status(403).json("Token is not valid")
            }

            req.user = user;
            next();
        })
    }else{
        console.log('Not Verified');
        res.status(401).send("You are not authenticated")
    }
}

