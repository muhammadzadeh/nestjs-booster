import { UserEntity } from "../../users/profiles/domain/entities/user.entity";

export enum AuthenticationEvents {
  USER_REGISTERED = 'user.registered',
  USER_VERIFIED = 'user.verified',
  USER_LOGGED_IN = 'user.logged_in',
}

export class UserVerifiedEvent {
  constructor(readonly user: UserEntity) {}
}

export class UserLoggedInEvent {
  constructor(readonly user: UserEntity) {}
}

export class UserRegisteredEvent {
  constructor(readonly user: UserEntity) {}
}
