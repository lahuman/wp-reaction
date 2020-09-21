export const INITIALIZE_DATA = {
  loading: false,
  postInfo: null,
  modal: false,
  popupData: {},
  postComment: null,
  postReactionData: [],
  commentReactionData: [],
  wrong: false,
  selection: [],
  value: 0
};

export const reactionReducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return { ...INITIALIZE_DATA };
    case "POST_MODAL":
      return {
        ...state,
        popupData: { title: `${state.postReactionData[action.target.point].emotion} 를 누른 사람`, avatars: action.avatars.map(a => ({ picture: a.picture.data.url, id: a.id, name: a.name })) }
      };
    case 'SELECT_POST_INFO':
      return {
        ...state,
        postInfo: action.data,
        postReactionData: (action.data.reactions
          && action.data.reactions.data.reduce((acc, cur) => {
            switch (cur.type) {
              case "LIKE":
                acc[0].count += 1;
                break;
              case "LOVE":
                acc[1].count += 1;
                break;
              case "HAHA":
                acc[2].count += 1;
                break;
              case "WOW":
                acc[3].count += 1;
                break;
              case "SAD":
                acc[4].count += 1;
                break;
              case "ANGRY":
                acc[5].count += 1;
                break;
              default:
                console.log(cur.type);
            }
            return acc;
          }, [
            { emotion: 'LIKE', count: 0 },
            { emotion: 'LOVE', count: 0 },
            { emotion: 'HAHA', count: 0 },
            { emotion: 'WOW', count: 0 },
            { emotion: 'SAD', count: 0 },
            { emotion: 'ANGRY', count: 0 },
          ]).sort((a, b) => a.count - b.count)) || [],
      };
    case "COMMENT_MODAL":
      return {
        ...state,
        popupData: {
          title: `${state.commentReactionData[action.target.point].name}`,
          avatars: (action.selectedCommentInfo.reactions && action.selectedCommentInfo.reactions.data.map(a => ({ id: a.id, name: a.name, picture: action.avatarsPicture.filter(p => p.id === a.id)[0].picture.data.url }))) || [],
          picture: action.avatarsPicture.filter(p => p.id === action.selectedCommentInfo.from.id)[0].picture.data.url, commentInfo: action.selectedCommentInfo
        }
      }
    case "SELECT_COMMENT_INFO":
      return {
        ...state,
        postComment: action.data,
        commentReactionData: (action.data && action.data.reduce((acc, cur) => {
          acc.push({
            id: cur.id, name: `${cur.from.name}_${cur.id}`, message: cur.message,
            LIKE: (cur.reactions && cur.reactions.data.filter(r => r.type === 'LIKE').length) || 0,
            LOVE: (cur.reactions && cur.reactions.data.filter(r => r.type === 'LOVE').length) || 0,
            HAHA: (cur.reactions && cur.reactions.data.filter(r => r.type === 'HAHA').length) || 0,
            WOW: (cur.reactions && cur.reactions.data.filter(r => r.type === 'WOW').length) || 0,
            SAD: (cur.reactions && cur.reactions.data.filter(r => r.type === 'SAD').length) || 0,
            ANGRY: (cur.reactions && cur.reactions.data.filter(r => r.type === 'ANGRY').length) || 0,
            reactions: (cur.reactions && cur.reactions.data.length) || 0,
          });
          return acc;
        }, []).sort((a, b) => a.reactions - b.reactions)) || []
      };
    case "UPDAET_LOADDING":
      return {
        ...state,
        loading: action.loading
      };
    case "MODAL_DATA":
      return {

      };
    case "MODAL":
      return {
        ...state,
        modal: action.modal
      };
    default:
      return state;
  }
}
