import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { red } from '@material-ui/core/colors';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import { useParams, useHistory } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


import { getPostInfo, getPostComment, getUserPictures } from '../../apiInstance';
import Dialog from '../Dialog';
import PostUI from '../PostUI';
import PostChart from './PostChart';
import CommentChart from './CommentChart';
import { reactionReducer, INITIALIZE_DATA } from './reactionReducer';
import ButtonGroups from './ButtonGroups';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  heroContent: {
    padding: '20px',
    display: "flex"
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const POST_ID_REGEX = /^\d{15,20}\_\d{15,20}$/
const POST_URL = /^\/groups\/(\d{15,20})\/permalink\/(\d{15,20})/;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Content() {
  let { postId: pathPostId } = useParams();
  let history = useHistory();
  const classes = useStyles();

  const [postId, setPostId] = React.useState(pathPostId || null);
  const [addAttach, setAddAttach] = React.useState(true)
  const [isWorng, setIsWrong] = React.useState(false);

  const [state, dispatch] = React.useReducer(reactionReducer, { ...INITIALIZE_DATA });

  React.useEffect(() => {
    if (!pathPostId) return;

    searchPostInfoAction();
  }, []);

  const handleChange = async (event, newValue) => {
    dispatch({ type: 'CHANGE_TAB', value: newValue });
    if (newValue === 1) {
      dispatch({ type: 'IS_LOADING' });
      const { data } = await getPostComment({ postId, addAttach });
      dispatch({ type: 'SELECT_COMMENT_INFO', data });
    }
  };

  const searchPostInfoAction = async () => {
    if (!POST_ID_REGEX.test(postId)) {
      setIsWrong(true);
      return;
    }
    setIsWrong(false);
    dispatch({ type: 'INITIALIZE' });
    history.push(`/${postId}`);
    const data = await getPostInfo({ postId, addAttach });
    dispatch({ type: 'SELECT_POST_INFO', data });
  }

  const drawLotsWinnerEvent = async (winningList) => {
    const avatars = await getUserPictures({ userIdList: winningList });
    dispatch({ type: 'WINNER_MODAL', avatars });
  }
  const clickChart = async (targets, type = "post" ) => {
    if (!targets || targets.length === 0) return;
    const target = targets[0];

    dispatch({ type: 'CHART_SELECTION', selection: [target] });

    if (type === 'post') {

      const avatars = await getUserPictures({ userIdList: state.postInfo.reactions.data.filter(p => p.type === state.postReactionData[target.point].emotion).map(r => r.id) });
      dispatch({ type: 'POST_MODAL', avatars, target });

    } else if (type === 'comment') {
      const commentInfo = state.postComment.filter(c => c.id === state.commentReactionData[target.point].id)[0];
      let userIdList = (commentInfo.reactions && commentInfo.reactions.data.map(r => r.id)) || [];
      userIdList.push(commentInfo.from.id);
      let avatarsPicture = await getUserPictures({ userIdList });
      avatarsPicture = (avatarsPicture && avatarsPicture) || [];

      dispatch({ type: 'COMMENT_MODAL', avatarsPicture, selectedCommentInfo: commentInfo, target });
    }else if(type === 'drawlots'){
  
    }

  }


  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={state.loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container maxWidth="lg" component="main" className={classes.heroContent}>
        <Grid container direction="row" alignItems="center" spacing={3}>
          <Grid item>
            <TextField id="standard-basic" style={{ width: '400px' }} label="게시글 ID or URL" value={postId} onKeyPress={(e) => {
              if (e.key === 'Enter') {
                searchPostInfoAction();
              }

            }} onChange={(e) => {
              let pUrl = e.target.value.replace(`${process.env.REACT_APP_WP_URL}`, '');
              const vals = pUrl.match(POST_URL);
              if (vals && vals.length > 2) {
                setPostId(`${vals[1]}_${vals[2]}`);
              } else {
                setPostId(e.target.value);
              }
            }} />
            {isWorng && <Alert severity="error">게시물 ID를 다시 확인해주세요!</Alert>}

          </Grid>
          <Grid item >
            <FormControlLabel
              control={
                <Checkbox
                  checked={addAttach}
                  onChange={(e) => setAddAttach(e.target.checked)}
                  color="primary"
                />
              }
              label="첨부 추가(중복발생)"
            />
          </Grid>
          <Grid item >
            <Button variant="contained" color="primary" onClick={() => searchPostInfoAction()}>조회</Button>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" component="main">
        {(state.postInfo
          &&
          <React.Fragment>
            {(state.postInfo.error && state.postInfo.error.message) ||
              <React.Fragment>
                {/* postInfo.picture && 정상 호출 되었을 경우 처리  */}
                <Card className={classes.root}>
                  <PostUI id={state.postInfo.from.id} postId={state.postInfo.id} picture={state.postInfo.picture} name={state.postInfo.from.name} created_time={state.postInfo.created_time} message={state.postInfo.message} reactionCount={(state.postInfo.reactions && state.postInfo.reactions.data.length || 0)} />
                  <CardContent>
                    <Tabs
                      value={state.value}
                      onChange={handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab label="게시글 반응" />
                      <Tab label="댓글 반응" />
                    </Tabs>
                    <SwipeableViews
                      index={state.value}
                    >
                      <TabPanel index={0} value={state.value}>
                        <ButtonGroups postId={postId} value={state.value} addAttach={addAttach} postReactionUserList={state.postInfo.reactions.data} dispatch={dispatch} drawLotsWinnerEvent={drawLotsWinnerEvent} />
                        <br />
                        <PostChart postReactionData={state.postReactionData} clickChart={clickChart} selection={state.selection} />
                      </TabPanel>
                      <TabPanel index={1} value={state.value}>
                        <ButtonGroups postId={postId} value={state.value} addAttach={addAttach} commentUserList={state.postComment} dispatch={dispatch} drawLotsWinnerEvent={drawLotsWinnerEvent} />
                        <br />
                        <CommentChart commentReactionData={state.commentReactionData} clickChart={clickChart} selection={state.selection} />
                      </TabPanel>
                    </SwipeableViews>
                  </CardContent>
                </Card>
              </React.Fragment>
            }
          </React.Fragment>)
          || <Typography variant="h4" color="inherit" noWrap >
            게시글 ID 또는 게시물 URL을 입력 후 조회 버튼을 눌러주세요.
        </Typography>
        }
      </Container>
      <Dialog open={state.modal} setOpen={(isOpen) => dispatch({ type: 'MODAL', modal: isOpen })} data={state.popupData} />
    </React.Fragment>);

}
