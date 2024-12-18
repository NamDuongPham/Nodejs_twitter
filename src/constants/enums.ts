export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}
export enum tokenType {
  AccessToken,
  RefreshToken,
  ForgotPassToken,
  EmailVerifyToken
}
export enum MediaType {
  Image,
  Video,
  HLS
}
export enum EncodingStatus {
  Pending, // Đang chờ ở hàng đợi (chưa được encode)
  Processing, // Đang encode
  Success, // Encode thành công
  Failed // Encode thất bại
}

export enum TweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}
export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}
export enum TweetAudience {
  Everyone, // 0
  TwitterCircle // 1
}

export enum PeopleFollow {
  Anyone = '0',
  Following = '1'
}
