'use strict'

const LIMIT = '1000';

const wpApi = require('../lib/wpApiInstance');

const getAttachInfo = async (attachId) => await wpApi({ url: `/${attachId}?fields=reactions.limit(${LIMIT})` });
const getAttachCommentInfo = async (attachId) => await wpApi({ url: `/${attachId}/comments?fields=message,from,reactions.limit(${LIMIT})` });

const __getPostInfo = async ({ postId, addAttach }) => {
  try {

    const url = `/${postId}?fields=created_time,name,link,caption,from,message,reactions.limit(${LIMIT})&limit=${LIMIT}`;
    const result = await wpApi({ url });
    if (result.error) {
      return { error: { message: result.error }};
    }

    const callUserInfo = wpApi({ url: `/${result.from.id}?fields=id,name,picture` });

    //첨부된 파일에 대한 통계 통합
    const callAttach = addAttach === "Y" ? wpApi({ url: `/${postId}/attachments?limit=${LIMIT}` }) : [];

    const infos = await Promise.all([callUserInfo, callAttach]);

    if (infos[1] && infos[1].data && infos[1].data[0] && infos[1].data[0].subattachments) {
      const subAtt = infos[1].data[0].subattachments;
      const callAttachInfos = subAtt.data.map(a => getAttachInfo(a.target.id));
      const attachInfos = await Promise.all(callAttachInfos);

      const attachReactions = attachInfos.reduce((acc, cur) => {
        if (cur && cur.reactions && cur.reactions.data) {
          acc = acc.concat([...cur.reactions.data]);
        }
        return acc;
      }, []);

      if (!result.reactions) {
        result.reactions = { data: [] };
      }
      result.reactions.data = result.reactions.data.concat(attachReactions);
    }

    return {
      ...result,
      picture: infos[0].picture.data.url
    };
  } catch (e) {
    return { error: { message: e.toString() } };
  }
}

module.exports.getPostInfo = async (req, res, next) => {
  const result = await __getPostInfo({ postId: req.postId.value, addAttach: req.addAttach.value });
  res.send(result);
};

module.exports.postInfo2xls = async (req, res, next) => {
  try {
    const result = await __getPostInfo({ postId: req.postId.value, addAttach: req.addAttach.value });
    res.xls(`post_reaction_${req.postId.value}.xlsx`, result.reactions.data && result.reactions.data || []);
  } catch (e) {
    res.status(500).send({ error: { message: e.toString() } });
  }
};

const __getPostCommentInfo = async ({ postId, addAttach }) => {

  const result = await __getCommentInfo({ postId });

  //첨부된 파일에 대한 통계 포함
  if (addAttach === "Y") {
    const moreInfo = await wpApi({ url: `/${postId}/attachments?limit=${LIMIT}` });
    if (moreInfo && moreInfo.data && moreInfo.data[0] && moreInfo.data[0].subattachments) {
      const subAtt = moreInfo.data[0].subattachments;
      const callAttachInfos = subAtt.data.map(a => getAttachCommentInfo(a.target.id));
      const attachInfos = await Promise.all(callAttachInfos);
      const attachComments = attachInfos.reduce((acc, cur) => {
        if (cur && cur.data ) {
          acc = acc.concat([...cur.data]);
        }
        return acc;
      }, []);

      if (!result) {
        result = { data: [] };
      }
      result.data = result.data.concat(attachComments);
    }
  }

  //댓글에 댓글 가져오기 + 2depth 까지만 존재함
  const replayComment = await Promise.all(result.data.map(r => __getCommentInfo({ postId: r.id })));

  if (!replayComment || replayComment.length === 0 || !replayComment[0].data || replayComment[0].data.length === 0) {
    return result;
  }

  return replayComment[0].data.reduce((acc, cur) => {
    acc.data.push({ ...cur });
    return acc;
  }, result);

}

const __getCommentInfo = async ({ postId }) => {
  const url = `/${postId}/comments?fields=from,message,reactions.limit(${LIMIT})&limit=${LIMIT}`;
  const result = await wpApi({ url });
  return result;
}

module.exports.getPostCommentInfo = async (req, res, next) => {
  try {
    const result = await __getPostCommentInfo({ postId: req.postId.value, addAttach: req.addAttach.value });
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: { message: e.toString() } });
  }
};

module.exports.postCommentInfo2xls = async (req, res, next) => {
  try {
    const result = await __getPostCommentInfo({ postId: req.postId.value, addAttach: req.addAttach.value });
    res.xls(`post_comment_${req.postId.value}.xlsx`, result.data && result.data.map(r => ({
      id: r.from.id,
      name: r.from.name,
      message: r.message,
      reaction: (r.reactions && r.reactions.data.length) || 0
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

module.exports.postRead2xls = async (req, res, next) => {
  try {
    const url = `/${req.postId.value}?fields=seen.limit(10000)&limit=${LIMIT}`;
    const result = await wpApi({ url });
    const userInfoList = await Promise.all((result.seen.data && result.seen.data || []).map(wpUser =>  wpApi({ url: `/${wpUser.id}/?fields=name,email,department` })));
    res.xls(`post_seen_${req.postId.value}.xlsx`, userInfoList);
  } catch (e) {
    res.status(500).send({ error: { message: e.toString() } });
  }
};