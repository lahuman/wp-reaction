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
import GetAppIcon from '@material-ui/icons/GetApp';

import { getPostInfo, getPostComment, getUserPictures } from '../../apiInstance';
import Dialog from '../Dialog';
import PostUI from '../PostUI';
import PostChart from './PostChart';
import CommentChart from './CommentChart';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [popupData, setPopupData] = React.useState({});
  const [postInfo, setPostInfo] = React.useState(null);
  const [postComment, setPostComment] = React.useState(null);
  const [postReactionData, setPostReactionData] = React.useState([]);
  const [commentReactionData, setCommentReactionData] = React.useState([]);
  const [postId, setPostId] = React.useState(pathPostId || null);
  const [isWorng, setIsWrong] = React.useState(false);
  const [selection, setSelection] = React.useState([]);
  const [value, setValue] = React.useState(0);


  React.useEffect(() => {
    if (!pathPostId) return;

    searchPostInfoAction();
  }, []);
  const handleChange = async (event, newValue) => {
    setValue(newValue);
    setLoading(true);
    setSelection([]);
    const { data } = await getPostComment({ postId });
    setPostComment(data);
    setCommentReactionData((data && data.reduce((acc, cur) => {
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
    }, []).sort((a, b) => a.reactions - b.reactions)) || []);
    setLoading(false);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const searchPostInfoAction = async () => {

    if (!POST_ID_REGEX.test(postId)) {
      setIsWrong(true);
      return;
    }
    setLoading(true);
    history.push(`/${postId}`);
    setIsWrong(false);
    setValue(0);
    setSelection([]);
    setPostComment(null);
    setPostReactionData([]);
    const data = await getPostInfo({ postId });
    setPostInfo(data);
    setPostReactionData((data.reactions
      && data.reactions.data.reduce((acc, cur) => {
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
      ]).sort((a, b) => a.count - b.count)) || []);
    setLoading(false);
  }

  const clickChart = async (targets, type = "post") => {
    if (!targets || targets.length === 0) return;
    const target = targets[0];
    setSelection([target]);
    setLoading(true);
    if (type === 'post') {
      const avatars = await getUserPictures({ userIdList: postInfo.reactions.data.filter(p => p.type === postReactionData[target.point].emotion).map(r => r.id) });
      setPopupData({ title: `${postReactionData[target.point].emotion} 를 누른 사람`, avatars: avatars.map(a => ({ picture: a.picture.data.url, id: a.id, name: a.name })) });
    } else {
      const commentInfo = postComment.filter(c => c.id === commentReactionData[target.point].id)[0];
      let userIdList = (commentInfo.reactions && commentInfo.reactions.data.map(r => r.id)) || [];
      userIdList.push(commentInfo.from.id);
      let avatarsPicture = await getUserPictures({ userIdList });
      avatarsPicture = (avatarsPicture && avatarsPicture) || [];
      console.log(avatarsPicture.filter(p => p.id === commentInfo.from.id)[0].picture.data.url)
      setPopupData({
        title: `${commentReactionData[target.point].name}`,
        avatars: (commentInfo.reactions && commentInfo.reactions.data.map(a => ({ id: a.id, name: a.name, picture: avatarsPicture.filter(p => p.id === a.id)[0].picture.data.url }))) || [],
        picture: avatarsPicture.filter(p => p.id === commentInfo.from.id)[0].picture.data.url, commentInfo
      });
    }
    setOpen(true);
    setLoading(false);
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading} >
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
              console.log(pUrl)
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
            <Button variant="contained" color="primary" onClick={() => searchPostInfoAction()}>조회</Button>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" component="main">
        {(postInfo
          &&
          <React.Fragment>
            {(postInfo.error && postInfo.error.message) ||
              <React.Fragment>
                {/* postInfo.picture && 정상 호출 되었을 경우 처리  */}
                <Card className={classes.root}>
                  <PostUI id={postInfo.from.id} postId={postInfo.id} picture={postInfo.picture} name={postInfo.from.name} created_time={postInfo.created_time} message={postInfo.message} reactionCount={postInfo.reactions.data.length} />
                  <CardContent>
                    <Tabs
                      value={value}
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
                      // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <TabPanel index={0} value={value}>
                        <Button variant="outlined" size="large" color="primary" onClick={() => {
                          window.location.href=`${process.env.REACT_APP_API}/postInfo2xls?postId=${postId}`;
                        }}>
                          게시글 반응정보 Excel 다운받기
                        </Button>
                        <PostChart postReactionData={postReactionData} clickChart={clickChart} selection={selection} />
                      </TabPanel>
                      <TabPanel index={1} value={value}>
                      <Button variant="outlined" size="large" color="primary" onClick={() => {
                          window.location.href=`${process.env.REACT_APP_API}/postCommentInfo2xls?postId=${postId}`;
                        }}>
                          게시글의 댓글에 대한 반응정보 Excel 다운받기
                        </Button>
                        <CommentChart commentReactionData={commentReactionData} clickChart={clickChart} selection={selection} />
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
      <Dialog open={open} setOpen={setOpen} data={popupData} />
    </React.Fragment>);

}