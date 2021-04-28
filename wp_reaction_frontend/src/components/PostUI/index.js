import React from 'react';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import dayjs from 'dayjs';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: red[500],
  },
}));

export default ({ id, postId, picture, name, created_time, message, reactionCount, isPost = false  }) => {
  const classes = useStyles();
  return (<React.Fragment>
    <CardHeader
      avatar={
        <a href={`${process.env.REACT_APP_WP_URL}/${id}`} target="_blank" rel="noopener noreferrer"><Avatar aria-label="recipe" className={classes.avatar} src={picture} /></a>
      }
      title={
        <Grid item xs={3}>
          <Grid container direction="row"
            justify="space-between"
            alignItems="center"
            spacing={2}>
            <Grid item>
              <a href={`${process.env.REACT_APP_WP_URL}/${id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}>{name}</a>
            </Grid>
            <Grid item>
              <a href={`${process.env.REACT_APP_WP_URL}/${postId}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}>게시글 바로가기<OpenInNewIcon color="primary" style={{ fontSize: '0.7rem' }} /></a>
            </Grid>
          </Grid>
        </Grid>}
      subheader={created_time && dayjs(created_time).format("YYYY-MM-DD HH:mm:ss")}
    />
    <CardContent>
      <Typography variant="body1" color="textSecondary" component="p">
        {message}
      </Typography>
    </CardContent>
    <CardActions disableSpacing>
      <IconButton aria-label="add to favorites">
        <FavoriteIcon /> ({reactionCount})
      </IconButton>
      <IconButton style={{ marginLeft: 'auto', }} onClick={e => {
        window.location.href = `${process.env.REACT_APP_API}/postRead2xls?postId=${postId}`;
      }}>
        <VisibilityIcon /> &nbsp;읽은 사람 목록 받기
        </IconButton>
    </CardActions>
  </React.Fragment>)
}