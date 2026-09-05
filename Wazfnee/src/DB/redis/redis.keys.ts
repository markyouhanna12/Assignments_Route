export const revokeTokenKeyPrefix = ({ userId }: { userId: string | number }): string => {
  return `user:revokedTokens:${userId}`;
};

export const revokeTokenKey = ({
  userId,
  jti,
}: {
  userId: string | number;
  jti: string;
}): string => {
  return `${revokeTokenKeyPrefix({ userId })}:${jti}`;
};
