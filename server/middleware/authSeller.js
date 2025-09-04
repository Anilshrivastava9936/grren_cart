import jwt from 'jsonwebtoken'

const authSeller=async (req,res,next)=>{
    const {sellerToken}=req.cookies
    if(!sellerToken){
        return res.json({success:false,message:"not Authorised"})
    }
    try {
            const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
            // console.log("token", tokenDecode)
            // console.log("token", tokenDecode.id)
    
            if (tokenDecode.email === process.env.SELLER_EMAIL) {
               
                next();
            } else {
                return res.json({ success: false, message: "Not Authorised Login again" })
    
            }
        } catch (error) {
            console.log("error in authSeller middleware")
            return res.json({ success: false, message: error.message })
    
        }
    
}
export default authSeller;
