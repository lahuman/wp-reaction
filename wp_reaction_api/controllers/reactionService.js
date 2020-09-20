'use strict'

const wpApi = require('../lib/wpApiInstance');

module.exports.getPostInfo = async (req, res, next) => {
  try {
    const url = `/${req.postId.value}?fields=created_time,name,link,caption,from,message,reactions.limit(1000)&limit=1000`;
    const result = await wpApi({ url });
    if (result.error) {
      res.send(result);
      return;
    }
    const userInfo = await wpApi({ url: `/${result.from.id}?fields=id,name,picture` });
    res.send({
      ...result,
      picture: userInfo.picture.data.url
    });
  } catch (e) {
    res.status(500).send({ error: { message: e.toString() } });
  }
};

module.exports.postInfo2xls = async (req, res, next) => {
  try {
    const url = `/${req.postId.value}?fields=created_time,name,link,caption,from,message,reactions.limit(1000)&limit=1000`;
    const result = await wpApi({ url });
    if (result.error) {
      res.send(result);
      return;
    }
    res.xls(`post_reaction_${req.postId.value}.xlsx`, result.reactions.data && result.reactions.data || []);
  } catch (e) {
    res.status(500).send({ error: { message: e.toString() } });
  }
};

module.exports.getPostCommentInfo = async (req, res, next) => {
  try {
    const url = `/${req.postId.value}/comments?fields=from,message,reactions.limit(1000)&limit=1000`;
    const result = await wpApi({ url });
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: { message: e.toString() } });
  }
};

module.exports.postCommentInfo2xls = async (req, res, next) => {
  try {
    const url = `/${req.postId.value}/comments?fields=from,message,reactions.limit(1000)&limit=1000`;
    const result = await wpApi({ url });
    res.xls(`post_comment_${req.postId.value}.xlsx`, result.data && result.data.map(r => ({
      id: r.from.id,
      name: r.from.name,
      message: r.message,
      reaction: (r.reaction && r.reaction.data.length) || 0
    })) || []);
  } catch (e) {
    res.status(500).send({ error: { message: e.toString() } });
  }
};

module.exports.getUserPictures = async (req, res, next) => {
  try {
    const userIdList = req.body.value;
    const userInfoList = await Promise.all(userIdList.map(u => wpApi({ url: `/${u}?fields=id,name,picture` })));
    res.send(userInfoList);
  } catch (e) {
    res.status(500).send({ error: { message: e.toString() } });
  }
};