function createApp(express,notFound,userRouter,friendRouter,register_login_router,groupRouter,messageRouter,auth,cookieParcer,refreshToken) {
  const app = express();
  app.use(express.json());
  app.use(cookieParcer());
  //!my routes :start
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", register_login_router);//!create access token and refresh token
  app.use(refreshToken);//!create access token if expired
  app.use(auth);//!initialize the req.user if the access token is valid
  //?all routes after this middleware will have the req.user
  app.use("/api/v1/friends", friendRouter);
  app.use("/api/v1/groups", groupRouter);
  app.use("/api/v1/messages", messageRouter);
  app.get("/", (req, res) => {
    res.send(
      `<h1 style="text-align:center">Here i will put the swager documentation:</h1>`
    );
  });
  //!my routes :end
  //!error handling :start
  app.use(notFound);
  //!error handling :end
  return app;
}

module.exports = createApp;