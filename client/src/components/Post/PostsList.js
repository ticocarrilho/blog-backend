import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { useSprings, animated, config } from 'react-spring';
import { Waypoint } from 'react-waypoint';
import { postSelector } from '../../slices/postSlice';
import PostPreview from './PostPreview';
import PostInput from './PostInput';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const PostList = () => {
  const classes = useStyles();
  const { posts, loading } = useSelector(postSelector);
  const { session } = useSelector(sessionSelector);
  const [showArray, setShowArray] = useState([]);
  useEffect(() => {
    if (!loading) {
      setShowArray(posts.map((e) => false));
    }
  }, [loading]);

  const springs = useSprings(
    showArray.length,
    showArray.map((show) => ({
      opacity: show ? 1 : 0,
      transform: show ? 'translate3d(0, 0px, 0)' : 'translate3d(0, 50px, 0)',
      config: config.slow,
    }))
  );

  const AnimatedGrid = animated(Grid);
  return (
    <Grid container direction='column' spacing={3}>
      <Grid item>
        <PostInput />
      </Grid>
      {loading ? (
        <p>Loading</p>
      ) : (
        springs.map((animation, id) => (
          <Waypoint
            key={`waypoint_${id}`}
            onEnter={() => {
              setShowArray(
                showArray.map((show, i) => (id === i ? true : show))
              );
            }}>
            <AnimatedGrid item key={posts[id]} style={animation}>
              <PostPreview post={posts[id]} />
            </AnimatedGrid>
          </Waypoint>
        ))
      )}
    </Grid>
  );
};

export default PostList;
