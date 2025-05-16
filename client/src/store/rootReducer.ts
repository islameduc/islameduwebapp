import { combineReducers } from '@reduxjs/toolkit';
import auth from './features/slices/auth/auth.slice';
import projects from './features/slices/projects/projects.slice';
import posts from './features/slices/posts/posts.slice';
import members from './features/slices/members/members.slice';
import contacts from './features/slices/contacts/contacts.slice';
import tasks from './features/slices/tasks/tasks.slice';
import chats from './features/slices/chats/chats.slice';
import donations from './features/slices/donations/donations.slice';
import theming from './features/slices/theming/theming.slice';
import loader from './features/slices/loader/loader.slice';

const rootReducer = combineReducers({
  auth,
  projects,
  posts,
  members,
  contacts,
  tasks,
  chats,
  loader,
  donations,
  theming,
});

export default rootReducer;
