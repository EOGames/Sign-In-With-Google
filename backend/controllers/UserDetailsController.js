const User = require('../model/userDetail');

module.exports.GetUserDetails = async (req, res) =>
{
    let userToFind = req.params.email;
    console.log('UserToFind',userToFind);
    try {

        let data = await User.findOne({email: userToFind});

        if (data)
        {
            return res.status(200).json(data);
        }
         else
        {
            return res.status(404).json({message:'User Not Found'});
        }
    } 
    catch (error)
    {
        console.log('Error In [UserDetailsController] Error: ',error);
    }
}