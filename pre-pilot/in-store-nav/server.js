const e=require("express")(); const p=process.env.PORT||80; 
e.get("/health",(_,r)=>r.send("ok")); e.get("/",(_,r)=>r.send("nav ok"));
e.listen(p,"0.0.0.0",()=>console.log("nav on",p));
