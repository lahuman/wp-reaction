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
    case 'INITIALIZE':
      return { ...INITIALIZE_DATA, loading: true };
    case "POST_MODAL":
      return {
        ...state,
        loading: false,
        modal: true,
        popupData: { title: `${state.postReactionData[action.target.point].emotion} 를 누른 사람`, avatars: action.avatars.map(a => ({ picture: a.picture.data.url, id: a.id, name: a.name })) }
      };
    case "WINNER_MODAL":
      return {
        ...state,
        loading: false,
        modal: true,
        popupData: { title: `당첨자::왼쪽 1등부터 오른쪽으로`, avatars: action.avatars.map(a => ({ picture: a.picture.data.url, id: a.id, name: a.name })) }
      };
    case 'SELECT_POST_INFO':
      return {
        ...state,
        loading: false,
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
        loading: false,
        modal: true,
        popupData: {
          title: `${state.commentReactionData[action.target.point].name}`,
          avatars: (action.selectedCommentInfo.reactions && action.selectedCommentInfo.reactions.data.map(a => ({ id: a.id, name: a.name, picture: action.avatarsPicture.filter(p => p.id === a.id)[0].picture.data.url }))) || [],
          picture: action.avatarsPicture.filter(p => p.id === action.selectedCommentInfo.from.id)[0].picture.data.url, commentInfo: action.selectedCommentInfo
        }
      }
    case "SELECT_COMMENT_INFO":
      return {
        ...state,
        loading: false,
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
    case "IS_LOADING":
      return {
        ...state,
        loading: true
      };
    case "MODAL":
      console.log(action.modal)
      return {
        ...state,
        loading: false,
        modal: action.modal,
        selection: action.modal?action.selection:[]
      };
    case "CHART_SELECTION":
      return {
        ...state,
        loading: true,
        selection: action.selection
      };
    case "CHANGE_TAB":
      return {
        ...state,
        value: action.value
      };
    default:
      return state;
  }
}
