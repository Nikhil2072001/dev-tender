const validateEditProfileData = (req)=>{
    const allowedEditFields= ["name", "age", "gender", "photoUrl" ];
    const isEditable = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditable;
}
module.exports = validateEditProfileData 