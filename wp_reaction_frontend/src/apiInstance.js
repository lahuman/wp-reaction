
const checkLogin = (statusCode) => statusCode === 403 ? window.location.href = `${process.env.REACT_APP_API}/login` : '';

const getPostInfo = async ({ postId }) => {
  const data = await fetch(`${process.env.REACT_APP_API}/postInfo?postId=${postId}`, {
    credentials: 'include'  
  });
  checkLogin(data.status);
  const jsonResult = await data.json();
  return jsonResult;
}

const getPostComment = async ({ postId }) => {
  const data = await fetch(`${process.env.REACT_APP_API}/postCommentInfo?postId=${postId}`, {
    credentials: 'include'  
  });
  checkLogin(data.status);
  const jsonResult = await data.json();
  return jsonResult;
}

const getUserPictures = async ({ userIdList }) => {
  const data = await fetch(`${process.env.REACT_APP_API}/usersPictures`, {
    body: JSON.stringify(userIdList), method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  checkLogin(data.status);
  const jsonResult = await data.json();
  return jsonResult;
}

export {
  getPostInfo,
  getPostComment,
  getUserPictures
}