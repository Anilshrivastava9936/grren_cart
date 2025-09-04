import jwt from 'jsonwebtoken'


//Login Seller : api/selller/login

export const sellerLogin=async(req,res)=>{
   try {
     const {email,password}=req.body;
    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('sellerToken',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
     return res.json({ success: true, message: "LOgged in" })
    }else{
         res.json({ success: false, message: "invalid detailes" })
    }
   } catch (error) {
     res.status(500).json({ success: false, message: error.message })
   }
}

//seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
       
        return res.json({ success: true, email: process.env.SELLER_EMAIL })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "seller Controller login Api" })

    }
}




//seller logout :/api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "seller Controller login Api" })

    }
}
