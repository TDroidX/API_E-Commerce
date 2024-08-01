const messages={};

messages.messageGeneral=(res,statusCode,ok,data,message)=>{
  res.status(statusCode).json({
    ok,
    data,
    message,
  });
};

module.exports = messages;