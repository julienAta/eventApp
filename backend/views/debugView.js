export const renderDebugView = (req, res) => {
  res.render("debugView", { users: [], events: [] });
};
