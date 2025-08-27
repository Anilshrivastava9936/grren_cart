import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.cookies;
    console.log("token", token)
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
    }


    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("token", tokenDecode)
        // console.log("token", tokenDecode.id)

        if (tokenDecode.id) {
            req.body = req.body || {}
            req.body.userId = tokenDecode.id;
            console.log("id", req.body.userId)
        } else {
            return res.json({ success: false, message: "Not Authorised Login again" })

        }
        console.log("hii")
        next();
    } catch (error) {
        console.log("error in authUser middleware")
        return res.json({ success: false, message: error.message })

    }

}
export default authUser;
