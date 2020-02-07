import axios from 'axios';
import {
    ADD_USER
} from './types';

export const AddUser = () => async dispatch => {
       const res = await axios.get('/api/user')
       dispatch({ type: ADD_USER, payload: res.data});
};
