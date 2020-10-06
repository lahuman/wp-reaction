import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

export default ({ value, postId, addAttach, postReactionUserList, commentUserList, drawLotsWinnerEvent, dispatch }) => {
    const [downloadUrl,] = React.useState(value === 0 ? `${process.env.REACT_APP_API}/postInfo2xls?postId=${postId}&addAttach=${addAttach ? "Y" : "N"}` : `${process.env.REACT_APP_API}/postCommentInfo2xls?postId=${postId}&addAttach=${addAttach ? "Y" : "N"}`);
    const [buttonText,] = React.useState(value === 0 ? '게시글에 대한 반응정보 Excel 다운받기' : '게시글의 댓글에 대한 반응정보 Excel 다운받기');
    const [drawLotsBtnTxt,] = React.useState(value === 0 ? '반응 추첨' : '댓글 추첨');
    const [drawLotsNumber, setDrawLotsNumber] = React.useState(1);
    return (<Grid container direction="row" justify="space-between" alignItems="center" spacing={3}>
        <Grid item >
            <Button variant="outlined" size="large" color="primary" onClick={() => {
                window.location.href = downloadUrl;
            }}>
                {buttonText}
            </Button>
        </Grid>
        <Grid item >
            <Grid container direction="row" alignItems="center" spacing={3} style={{ border: 'solid 1px red' }}>
                <Grid item>
                    <TextField
                        label="추첨자 수"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={drawLotsNumber}
                        onChange={e => setDrawLotsNumber(e.target.value)}
                    />
                </Grid>
                <Grid item >
                    <Button variant="outlined" size="large" color="primary" onClick={_ => {
                        let maxLength = (value === 0 ? postReactionUserList.length : commentUserList.length)
                        if (drawLotsNumber > maxLength) {
                            alert('추첨자 수가 응모한 수보다 큽니다.');
                            return;
                        }
                        dispatch({ type: 'IS_LOADING' });
                        let winning = new Set();
                        let drawinglots = true;
                        while (drawinglots) {
                            winning.add(getRandomIntInclusive(1, maxLength));
                            if (winning.size == drawLotsNumber) {
                                drawinglots = false;
                                break;
                            }
                        }

                        if (value === 0) {
                            drawLotsWinnerEvent([...winning].map(w => postReactionUserList[w - 1].id));
                        } else {
                            drawLotsWinnerEvent([...winning].map(w => commentUserList[w - 1].from.id));
                        }
                    }}>
                        {drawLotsBtnTxt}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    </Grid>);
}