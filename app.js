function createApp(redis,express,notFound,userRouter,friendRouter,register_login_router,groupRouter,messageRouter,auth,cookieParcer,refreshToken) {
  //!import security packages :start
  const cors = require("cors");
  const helmet = require("helmet");
  const rateLimit = require("express-rate-limit");
  const xss = require("xss-clean");
  //!import security packages :end

  const swaggerUi = require("swagger-ui-express");
  const YAML = require("yamljs");
  const swaggerDocument = YAML.load("./swagger.yaml");

  const app = express();
  //!use the security packages :start
  app.use(cors());//?this to allow the frontend to access the backend
  app.use(xss());//?this to prevent the xss attack by removing the xss code from the request
  app.use(helmet());//?this to secure the app by setting various http headers like xss protection,frameguard etc
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   })
  // );//?this to limit the number of request from a single ip
  //!use the security packages :end
  app.use(express.json());
  app.use(cookieParcer());
  //!my routes :start
  app.get("/", (req, res) => {
    res.send('<h1>Messenger</h1><a href="/api-docs">API Documentation</a>');
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  app.use("/api/v1/auth", register_login_router);//!create access token and refresh token
  app.use(refreshToken);//!create access token if expired
  app.use(auth);//!initialize the req.user if the access token is valid
  //?all routes after this middleware should have the req.user
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/friends", friendRouter);
  app.use("/api/v1/groups", groupRouter);
  app.use("/api/v1/messages", messageRouter);
  app.get("/api/v1/logout",(req,res)=>{
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("expire");
    res.status(200).json({success:true,msg:"logout successfull"});
  })
  //!my routes :end
  //!error handling :start
  app.use(notFound);
  //!error handling :end
  return app;
}

module.exports = createApp;