import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PostUI from '../PostUI';


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);


const useStyles = makeStyles((theme) => ({
  avatars: {
    flexGrow: 1
  },
}));

export default function CustomizedDialogs({ open, setOpen, data }) {
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog xs={12} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {data.title}
        </DialogTitle>
        <DialogContent dividers>

          {data.commentInfo && <React.Fragment>
            <PostUI id={data.commentInfo.from.id} postId={data.commentInfo.id} picture={data.picture} name={data.commentInfo.from.name} message={data.commentInfo.message} reactionCount={(data.commentInfo.reactions && data.commentInfo.reactions.data.length) || 0} />
            {data.commentInfo.reactions && <CardContent>
              <Grid container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={2} style={{ width: '550px' }}>

              </Grid>
            </CardContent>}
          </React.Fragment>}
          {data.avatars &&
            <Grid container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={2} style={{ width: '550px' }}>
              {data.avatars.map(a => (AvatarList({ id: a.id, name: a.name, picture: a.picture })))}
            </Grid>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AvatarList({ id, name, picture }) {
  return <Grid item xs={2} style={{ textAlign: 'center' }}><a href={`${process.env.REACT_APP_WP_URL}/${id}`} style={{textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)'}} target="_blank" rel="noopener noreferrer">
    <Avatar key={id} alt={name} src={picture} style={{ marginLeft: '1.2rem' }} />
    <Typography variant="caption" display="block" gutterBottom>{name}</Typography></a>
  </Grid>;
}
