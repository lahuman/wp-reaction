
const __fetch = (url, options = {}) => fetch(url, { ...options, credentials: 'include' });

const getPostInfo = async ({ postId, addAttach }) => {
  const data = await __fetch(`${process.env.REACT_APP_API}/postInfo?postId=${postId}&addAttach=${addAttach?"Y":"N"}`);
  const jsonResult = await data.json();
  return jsonResult;
}

const getPostComment = async ({ postId, addAttach }) => {
  const data = await __fetch(`${process.env.REACT_APP_API}/postCommentInfo?postId=${postId}&addAttach=${addAttach?"Y":"N"}`);
  const jsonResult = await data.json();
  return jsonResult;
}

const getUserPictures = async ({ userIdList }) => {
  const data = await __fetch(`${process.env.REACT_APP_API}/usersPictures`, {
    body: JSON.stringify(userIdList), method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const jsonResult = await data.json();
  return jsonResult;
}

export {
  getPostInfo,
  getPostComment,
  getUserPictures,
}