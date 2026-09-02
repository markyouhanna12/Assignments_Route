import { Router } from 'express';

import { ChatController } from './chat.controller';
import { getChatSchema } from './chat.validation';

import { authentication } from '../../Middlewares/Auth.middleware';
import { validation } from '../../Middlewares/Validation.middleware';

import { TokenTypeEnum } from '../../Utils/enums/auth.enum';

const router = Router();

const chatController = new ChatController();

router.get(
  '/:userId',

  authentication({
    tokenType: TokenTypeEnum.ACCESS,
  }),

  validation(getChatSchema),

  chatController.getChat,
);

export default router;
