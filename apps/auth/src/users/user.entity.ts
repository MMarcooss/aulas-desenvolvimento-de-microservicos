export class User {
  private readonly _id?: string;
  private _email: string;
  private _password: string;
  private _permissions: string[];
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(props: {
    id?: string;
    email: string;
    password: string;
    permissions: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id;
    this._email = props.email;
    this._password = props.password;
    this._permissions = props.permissions;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get permissions(): string[] {
    return this._permissions;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  withEmail(email: string): this {
    this._email = email;
    return this;
  }

  withPassword(password: string): this {
    this._password = password;
    return this;
  }

  withPermissions(permissions: string[]): this {
    this._permissions = permissions;
    return this;
  }

  static create(props: {
    email: string;
    password: string;
    permissions?: string[];
  }): User {
    return new User({
      email: props.email,
      password: props.password,
      permissions: props.permissions ?? [],
    });
  }

  static restore(props: {
    id: string;
    email: string;
    password: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(props);
  }
}
