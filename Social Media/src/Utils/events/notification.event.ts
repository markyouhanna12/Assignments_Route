import { EventEmitter } from 'events';
import { Types } from 'mongoose';
import { sendNotification } from '../services/push.notification';
import { NotificationTypeEnum } from '../../DB/Models/notification.model';

export const notificationEvent = new EventEmitter();

interface IActor {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
}

const fullName = (actor: IActor): string => `${actor.firstName} ${actor.lastName}`.trim();

notificationEvent.on(
  'friendRequest',
  async (data: { to: Types.ObjectId; sender: IActor; requestId: Types.ObjectId }) => {
    await sendNotification({
      userId: data.to,
      senderId: data.sender._id,
      type: NotificationTypeEnum.FRIEND_REQUEST,
      title: 'New Friend Request',
      body: `${fullName(data.sender)} send you a friend Request`,
      requestId: data.requestId,
    });
  },
);

notificationEvent.on('friendAccepted', async (data: { to: Types.ObjectId; sender: IActor }) => {
  await sendNotification({
    userId: data.to,
    senderId: data.sender._id,
    type: NotificationTypeEnum.FRIEND_ACCEPTED,
    title: 'New Friend Accepted',
    body: `${fullName(data.sender)} accepted your friend request`,
  });
});

notificationEvent.on(
  'postLike',
  async (data: { to: Types.ObjectId; sender: IActor; postId: Types.ObjectId }) => {
    await sendNotification({
      userId: data.to,
      senderId: data.sender._id,
      type: NotificationTypeEnum.POST_LIKE,
      title: 'new Like',
      body: `${fullName(data.sender)} liked your post`,
      postId: data.postId,
    });
  },
);

notificationEvent.on(
  'postComment',
  async (data: {
    to: Types.ObjectId;
    sender: IActor;
    postId: Types.ObjectId;
    commentId: Types.ObjectId;
    content: string;
  }) => {
    await sendNotification({
      userId: data.to,
      senderId: data.sender._id,
      type: NotificationTypeEnum.POST_COMMENT,
      title: 'new Comment',
      body: `${fullName(data.sender)} commented : ${data.content} on your post`,
      postId: data.postId,
      commentId: data.commentId,
    });
  },
);

notificationEvent.on(
  'commentReply',
  async (data: {
    to: Types.ObjectId;
    sender: IActor;
    postId: Types.ObjectId;
    commentId: Types.ObjectId;
    content: string;
  }) => {
    await sendNotification({
      userId: data.to,
      senderId: data.sender._id,
      type: NotificationTypeEnum.COMMENT_REPLY,
      title: 'new Reply',
      body: `${fullName(data.sender)} replied : ${data.content} on your post`,
      postId: data.postId,
      commentId: data.commentId,
    });
  },
);

notificationEvent.on('testNotification', async (data: { to: Types.ObjectId; sender: IActor }) => {
  console.log('🔥 Test notification event received');

  await sendNotification({
    userId: data.to,
    senderId: data.sender._id,
    type: NotificationTypeEnum.TEST_NOTIFICATION,
    title: 'Test Notification',
    body: `${fullName(data.sender)} sent you a test notification`,
  });
});
