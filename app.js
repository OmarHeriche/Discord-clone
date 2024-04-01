function createApp(express,notFound,userRouter,friendRouter,register_login_router,groupRouter,messageRouter) {
  const app = express();
  app.use(express.json());
  //!my routes :start
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", register_login_router);
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