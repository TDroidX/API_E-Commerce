const Cliente = require('../Models/clienteModel');
const jwt = require('jsonwebtoken')

const checkRole = (roles) => async (req, res, next) =>{
    try{
        
        const token = req.cookies.token;
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const clienteData = await Cliente.findByPk(tokenData.id)
        console.log(clienteData.Rol, clienteData.Usuario)
        
        if([].concat(roles).includes(clienteData.Rol)){
            next()
        }
        else{
            res.status(409)
            res.send({error: 'No tienes acceso. Solo administrador autorizado'})
        }
        
        
    }
    catch(e)
    {
        console.log(e)
        res.status(409)
        res.send({error: 'No entro al try'})
    }
}

module.exports = checkRole;