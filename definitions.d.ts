import type { ObjectId } from "mongodb";

type UserLocation = {
  city: string;
  country: string;
  language: string;
};
type Asset = {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  size: number;
  lastModified: string;
};
type Settings = {
  theme: string;
  enableNotifications: boolean;
  accentColor: string;
};
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
