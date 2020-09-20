import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Content from './components/Content';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
}));


export default function Pricing() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Header />
      <Router>
        <Switch>
          <Route exact path="/"  >
            <Content />
          </Route>
          <Route path="/:postId"  >
            <Content />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </React.Fragment>);

}