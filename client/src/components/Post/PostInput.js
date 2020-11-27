import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { addPost } from '../../slices/postSlice';
import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
  formContainter: {
    '& .MuiTextField-root:not(:first-child)': {
      marginTop: theme.spacing(3),
    },
  },
  postButton: {
    position: 'relative',
    bottom: '-14px',
  },
}));

const PostInput = () => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setError, clearErrors } = useForm();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try { //!!TODO Add Confirmation Dialog
      const post = {
        title: data.title,
        content: data.content,
      };
      const response = await api.post('post', post, { withCredentials: true });
      if (response.status === 201) {
        dispatch(addPost(response.data));
      }
    } catch (response) {
      const { data } = response;
      if (Array.isArray(data?.error)) {
        data.error.forEach((error) => {
          setError(`${error.param}`, {
            type: 'manual',
            message: error.msg,
          });
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader title='Create New Post' />
      <CardContent>
        <form
          className={classes.formContainter}
          onSubmit={handleSubmit(onSubmit)}>
          <TextField
            inputRef={register({
              required: { value: true, message: 'The title is required.' },
            })}
            id='Title'
            name='title'
            label='Title'
            placeholder='Title'
            fullWidth
          />
          <TextField
            inputRef={register({
              required: { value: true, message: 'The content is required.' },
            })}
            id='Content'
            name='content'
            label='Content'
            placeholder='Content'
            rows={6}
            rowsMax={18}
            multiline
            fullWidth
          />
          <Button
            variant='contained'
            color='primary'
            className={classes.postButton}
            endIcon={<SendIcon />}
            type='submit'>
            Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostInput;
