app.get("/test", (req, res) => {
  // 이 임의의 배열은 데이터 베이스에서 가져온다고 가정한다.
  const cats = ["Blue", "Rocket", "Monty", "Stephanie", "Winston"];
  res.render("cats", { cats })
});