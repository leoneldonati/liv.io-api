import type { Request } from "express";
import type { ObjectId } from "mongodb";

interface UserLocation {
  city: string;
  country: string;
  language: string;
}
interface Asset {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  size: number;
  lastModified: string;
}
interface Settings {
  theme: string;
  enableNotifications: boolean;
  accentColor: string;
}
interface Follower {
  info: User;
  joinedIn: Date;
}
interface User {
  _id: ObjectId;
  name: string;
  username: string;
  email: string;
  bio: string;
  password: string;
  date: Date;
  hasPremium: boolean;
  location: UserLocation | null;
  avatar: Asset | null;
  header: Asset | null;
  followers: Follower[];
  following: Follower[];
  settings: Settings;
  joinedAt: Date;
  updatedAt: Date;
}

type UserWithoutId = Omit<User, "_id">;

interface PostOwner {
  _id: ObjectId;
  name: string;
  username: string;
  avatar: Asset | null;
  joinedAt: Date;
}

interface Post {
  _id: ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  hashtags: string[];
  files: Asset[] | null;
  likes: string[];
  responses: Omit<Post, "responses">[];
  owner: PostOwner;
}

type PostWithoutId = Omit<Post, "_id">;
interface RequestWithUser extends Request {
  userLogged: User;
}

interface Status {}
