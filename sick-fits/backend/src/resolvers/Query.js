const { hasPermission } = require("../utils");

const { forwardTo } = require("prisma-binding");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is acurrent user ID
    if (!ctx.request.userId) return null;
    return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
  },

  async users(parent, args, ctx, info) {
    // Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }

    // Check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    // If they do, query all the users!
    return ctx.db.query.users({}, info);
  }
};

module.exports = Query;
