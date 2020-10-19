import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
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

  return (
    <Grid container direction='column' spacing={3}>
      <Grid item>
        <PostInput />
      </Grid>
      {loading ? (
        <p>loading</p>
      ) : (
        posts.map((post) => (
          <Grid item key={post.id}>
            <PostPreview post={post} />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default PostList;
