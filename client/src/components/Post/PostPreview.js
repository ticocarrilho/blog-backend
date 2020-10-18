import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import formatDate from '../../utils/formatDate';

const useStyles = makeStyles((theme) => ({
  contentText: {
    wordBreak: 'break-word',
  },
  title: {
    flexGrow: 1,
  },
}));

const PostPreview = ({ post }) => {
  const classes = useStyles();
  const postedDate = formatDate(post.createdAt);
  const charLimit = 300;

  return (
    <Card square>
      <CardHeader
        title={post.title}
        subheader={`By ${post.post_owner.name} on ${postedDate}`}
      />
      <CardContent>
        <Typography className={classes.contentText}>
          {post.content.length > charLimit
            ? post.content.substring(0, charLimit) + '...'
            : post.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small'>Read More</Button>
      </CardActions>
    </Card>
  );
};

export default PostPreview;
